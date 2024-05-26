
export interface FilterColor {
  r: number,
  g: number,
  b: number,
}

export interface ApplyBitmapFilterOptions{
  targetCanvas: HTMLCanvasElement,
  originalCanvas: HTMLCanvasElement,
  imageData: ImageData,
  contrastBaseValues: number[],
  dither: boolean,
  palette: string[],
}

export interface DitherFilterOptions {
  imageData: ImageData,
  contrastBaseValues: number[],
  dither: boolean,
  colors: FilterColor[],
}

export interface GeneratePatternOptions {
  baseValues: [number[], number[], number[]],
  orderPatterns: [number[], number[], number[]],
}
