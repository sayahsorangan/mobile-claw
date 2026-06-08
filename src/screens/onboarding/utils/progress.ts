export function getStepProgressLabel(current: number, total: number): string {
  return `STEP ${current} OF ${total}`;
}

export function getStepProgressValue(current: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.min(Math.max(current / total, 0), 1);
}
