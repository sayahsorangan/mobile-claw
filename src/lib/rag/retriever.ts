import {embed} from './embedder';
import {RetrievedChunk, RetrieveOptions} from './types';
import {getAllChunksMeta, getChunkEmbedding} from './vector-store';

/** Cosine similarity between two equal-length vectors */
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Retrieve the top-K most relevant chunks for a query string using a
 * two-stage pipeline: embed search → candidate pool → rerank → final K.
 *
 * Default pipeline: retrieve top 10 candidates, return top 3.
 * Requires the embedding model to be loaded via loadEmbedModel().
 */
export async function retrieve(query: string, options?: RetrieveOptions): Promise<RetrievedChunk[]> {
  // Mobile-safe defaults: top 3 results from a 10-candidate pool
  const topK = options?.topK ?? 3;
  const candidatePool = Math.max(topK, options?.candidatePool ?? 10);
  const minScore = options?.minScore ?? 0.0;

  const queryEmbedding = await embed(query);
  const allChunks = getAllChunksMeta();

  const scored: RetrievedChunk[] = [];

  for (const chunk of allChunks) {
    const embedding = getChunkEmbedding(chunk.id);
    if (!embedding) continue;

    const score = cosineSimilarity(queryEmbedding, embedding);
    if (score >= minScore) {
      scored.push({chunk, score});
    }
  }

  // Stage 1: sort by embedding similarity, keep candidate pool
  scored.sort((a, b) => b.score - a.score);
  const candidates = scored.slice(0, candidatePool);

  // Stage 2: rerank candidates by exact query-term overlap (keyword boost)
  const queryTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(t => t.length > 2);

  if (queryTerms.length > 0) {
    candidates.sort((a, b) => {
      const aText = a.chunk.text.toLowerCase();
      const bText = b.chunk.text.toLowerCase();
      const aBoost = queryTerms.filter(t => aText.includes(t)).length;
      const bBoost = queryTerms.filter(t => bText.includes(t)).length;
      // Combine embedding score + keyword boost (weight: 0.7 embed + 0.3 keyword)
      const aFinal = a.score * 0.7 + (aBoost / queryTerms.length) * 0.3;
      const bFinal = b.score * 0.7 + (bBoost / queryTerms.length) * 0.3;
      return bFinal - aFinal;
    });
  }

  // Return final top-K
  return candidates.slice(0, topK);
}

/**
 * Build a RAG prompt string from retrieved chunks + user query.
 * The context is woven in silently — the model answers as if it knows the
 * information, without referencing "provided context" or "documents".
 */
export function buildRagPrompt(query: string, chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) {
    return query;
  }

  const context = chunks.map(r => r.chunk.text).join('\n\n');

  return `[INTERNAL KNOWLEDGE]\n${context}\n[/INTERNAL KNOWLEDGE]\n\n${query}`;
}
