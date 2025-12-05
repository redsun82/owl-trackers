import { BUBBLE_DIAMETER } from "./compoundItemHelpers";

export class BubblePosition {
  origin: { x: number; y: number };
  bounds: { width: number; height: number };
  totalBarHeight: number;
  aboveToken: boolean;
  currentRowXOffset = 0;
  currentRowMaxHeight = 0;
  cumulativeYOffset = 0;

  constructor(
    origin: { x: number; y: number },
    bounds: { width: number; height: number },
    totalBarHeight: number,
    aboveToken: boolean = false,
  ) {
    this.origin = origin;
    this.bounds = bounds;
    this.totalBarHeight = totalBarHeight;
    this.aboveToken = aboveToken;
  }

  getNew(sizeScale: number = 1): { x: number; y: number } {
    const scaledDiameter = BUBBLE_DIAMETER * sizeScale;
    const spacing = 2;

    if (this.currentRowXOffset + scaledDiameter + spacing > this.bounds.width) {
      this.cumulativeYOffset += this.currentRowMaxHeight + spacing;
      this.currentRowXOffset = 0;
      this.currentRowMaxHeight = 0;
    }

    if (scaledDiameter > this.currentRowMaxHeight) {
      this.currentRowMaxHeight = scaledDiameter;
    }

    // Above token: grow downward (+1), Below token: grow upward (-1)
    const yDirection = this.aboveToken ? 1 : -1;

    const position = {
      x:
        this.origin.x +
        spacing -
        this.bounds.width / 2 +
        this.currentRowXOffset +
        scaledDiameter / 2,
      y:
        this.origin.y +
        this.bounds.height / 2 -
        (this.aboveToken ? 0 : this.totalBarHeight) +
        yDirection * (spacing + scaledDiameter / 2 + this.cumulativeYOffset)
    };

    this.currentRowXOffset += scaledDiameter + spacing;
    return position;
  }
}
