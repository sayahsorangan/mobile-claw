import type {EntryLevelOption, EntryLevelOptionId} from '../types/entry-level-option';

export const entryLevelOptions: EntryLevelOption[] = [
  {
    id: 'start-simple',
    icon: 'S',
    labels: {
      de: 'Ich moechte einfach starten - Starte von Anfang an',
      en: 'I want to start simple - Start from the beginning',
      id: 'Saya ingin mulai sederhana - Mulai dari awal',
    },
    descriptionLabels: {
      de: 'Du beginnst direkt - ohne Vorkenntnisse.',
      en: 'You start directly - no prior knowledge needed.',
      id: 'Kamu langsung mulai - tanpa perlu pengetahuan awal.',
    },
  },
  {
    id: 'diagnostic',
    icon: 'L',
    labels: {
      de: 'Ich kenne mich schon etwas aus - Finde meinen Einstiegspunkt',
      en: 'I already know a bit - Find my starting point',
      id: 'Saya sudah tahu sedikit - Temukan titik mulai saya',
    },
    descriptionLabels: {
      de: 'Kurzer Check - und du startest genau auf deinem Level.',
      en: 'Quick check - and you start exactly at your level.',
      id: 'Cek singkat - lalu kamu mulai tepat di levelmu.',
    },
  },
];

export function isEntryLevelOptionId(value: string): value is EntryLevelOptionId {
  return entryLevelOptions.some(option => option.id === value);
}
