

export function getStarCount(rating: number): number {
  if (rating >= 1 && rating <= 2) return 1;
  if (rating >= 3 && rating <= 4) return 2;
  if (rating >= 5 && rating <= 6) return 3;
  if (rating >= 7 && rating <= 8) return 4;
  if (rating >= 9 && rating <= 10) return 5;
  return 0;
}
