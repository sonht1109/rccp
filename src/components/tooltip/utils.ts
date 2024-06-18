import { CSSProperties } from "react";
import {
  TooltipPlacement,
  TooltipPoint,
  TooltipProps,
  TooltipRect,
} from "./types";

/**
 *
 * @param {TooltipPlacement} p
 * @returns Position class that includes some methods handling position value by placement
 */
export class Position {
  constructor(public current: TooltipPlacement) {}
  negate(): TooltipPlacement {
    if (this.current === "left") return "right";
    if (this.current === "right") return "left";
    if (this.current === "top") return "bottom";
    return "top";
  }
  isHorizontal() {
    return ["left", "right"].includes(this.current);
  }
  isVertical() {
    return ["top", "bottom"].includes(this.current);
  }
}

/**
 *
 * @param
 * @returns Point class that includes some methods handling point value
 */
export class Point {
  constructor(public x: number | null = null, public y: number | null = null) {}
  reset(p: TooltipPoint) {
    this.x = p.x;
    this.y = p.y;
  }
  restrictRect(rect: TooltipRect) {
    if (this.x && this.x < rect.l) this.x = rect.l;
    else if (this.x && this.x > rect.r) this.x = rect.r;
    if (this.y && this.y < rect.t) this.y = rect.t;
    else if (this.y && this.y > rect.b) this.y = rect.b;
  }
}

/**
 *
 * @param {DOMRect} parentRect
 * @param {DOMRect} ttRect
 * @param {TooltipPlacement} placement
 * @param {number} offset
 * @returns tooltip position by handling mouse event
 */
export const getPoint = (
  parentRect: DOMRect,
  ttRect: DOMRect,
  placement: TooltipPlacement,
  offset: number
): TooltipPoint => {
  let recurCount = 0;
  const point = new Point();
  const bodyRect: TooltipRect = {
    t: offset,
    l: offset,
    r: document.body.clientWidth - offset - ttRect.width,
    b: window.innerHeight - offset - ttRect.height,
  };

  return (function recursive(placement: TooltipPlacement) {
    recurCount++;
    const position = new Position(placement);
    switch (position.current) {
      case "top": {
        point.x = parentRect.left + (parentRect.width - ttRect.width) / 2;
        point.y = parentRect.top - ttRect.height - offset;
        break;
      }
      case "bottom": {
        point.x = parentRect.left + (parentRect.width - ttRect.width) / 2;
        point.y = parentRect.bottom + offset;
        break;
      }

      case "left": {
        point.x = parentRect.left - ttRect.width - offset;
        point.y = parentRect.top + (parentRect.height - ttRect.height) / 2;
        break;
      }

      default: {
        point.x = parentRect.right + offset;
        point.y = parentRect.top + (parentRect.height - ttRect.height) / 2;
        break;
      }
    }

    if (recurCount < 3) {
      if (
        (position.isHorizontal() &&
          (point.x < bodyRect.l || point.x > bodyRect.r)) ||
        (position.isVertical() &&
          (point.y < bodyRect.t || point.y > bodyRect.b))
      ) {
        point.reset(recursive(position.negate()));
      }
      point.restrictRect(bodyRect);
    }

    return { x: point.x, y: point.y };
  })(placement);
};

export const getToolTipStyles = (point: TooltipPoint): CSSProperties => {
  return {
    left: `${point.x}px`,
    top: `${point.y}px`,
  };
};

type TooltipStyleProps = Pick<
  TooltipProps,
  "delay" | "offset" | "placement"
> & { show: boolean };

export const getToolTipAnimationStyles = (p: TooltipStyleProps): CSSProperties => {
  const { show, delay = 0, placement = "top" } = p;
  const position = new Position(placement);
  const transformOrigin = position.negate();
  const transformDirection = position.isVertical()
    ? "translateY"
    : "translateX";
  const transformSpace = ["top", "left"].includes(placement) ? 4 : -4;
  return {
    opacity: show ? 1 : 0,
    transform: `${transformDirection}(${show ? 0 : transformSpace}px)`,
    transformOrigin,
    transitionDelay: `${delay}ms`,
  };
};
