export function getBackgroundColor(hour: number): string {
  if (hour >= 6 && hour < 12) return 'lightyellow';
  if (hour >= 12 && hour < 17) return 'lightblue';
  if (hour >= 17 && hour < 21) return 'lightorange';
  return 'darkgray';
}
