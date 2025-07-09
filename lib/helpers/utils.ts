export const formatSegment = (segment: string) => {
  return segment
    .replace(/[-_/]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
};
