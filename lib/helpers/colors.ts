export const convertHexToRGB = (
  hex: string
): { r: number; g: number; b: number } => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
};

export const getContrastColor = (hexColor: string) => {
  const { r, g, b } = convertHexToRGB(hexColor);

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  return luminance > 128 ? 'black' : 'white';
};
