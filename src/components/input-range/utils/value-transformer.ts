import { MouseEvent, TouchEvent } from "react";
import { clamp, isMultiValue } from ".";
import { Position, Range, Value } from "../types";

/**
 * Convert a point in Track into a percentage value
 * @param {Position} position position of mousedown
 * @param {DOMRect} clientRect DOMRect of InputRange
 * @returns percentage
 */
export function getPercentageFromPosition(
  position: Position,
  clientRect: DOMRect
): number {
  return position.x / clientRect.width || 0;
}

/**
 * Convert a position into a value on the Track
 * @param {Position} pos
 * @param {Range} range min and max value of range
 * @param {DOMRect} domRect DOMRect of InputRange
 * @returns value in Track
 */
export const getValueOnTrackFromPosition = (
  pos: Position,
  range: Range,
  domRect: DOMRect
): number => {
  const sizePercentage = getPercentageFromPosition(pos, domRect);
  const valueDiff = range.max - range.min;
  return range.min + valueDiff * sizePercentage;
};

/**
 * Convert a float value on Track into a round value
 * @param {number} value float value on Track
 * @param {number} step
 * @returns round value from step and float value
 */
export function getRoundedValueFromValueOnTrack(
  value: number,
  step: number
): number {
  return Math.round(value / step) * step;
}

/**
 * If a value is single, convert it into object
 * @param value
 * @param isMultiValue
 * @returns value converted into a range
 */
export function convertValueIntoRange(value: Value, range: Range): Range {
  return isMultiValue(value)
    ? { ...(value as Range) }
    : { min: range.min, max: value as number };
}

/**
 * Convert a value in Track into a percentage value
 * @param {number} value
 * @param {Range} range
 * @returns {number}
 */
export const getPercentageFromValue = (value: number, range: Range): number => {
  const clampValue = clamp(value, range.min, range.max);
  const valueDiff = range.max - range.min;
  return (clampValue - range.min) / valueDiff || 0;
};

/**
 * Convert a value in Track into a Position on Track
 * @param value
 * @param range
 * @param domRect
 * @returns
 */
export function getPositionFromValue(
  value: number,
  range: Range,
  domRect: DOMRect
): Position {
  const valuePercentage = getPercentageFromValue(value, range);
  const positionValue = valuePercentage * domRect.width;

  return {
    x: positionValue,
    y: 0,
  };
}

/**
 * Convert the "mousedown" value in Track into 2 Position (min, max)
 * @param {Range} valuesPosition
 * @param {Range} range
 * @param {DOMRect} domRect
 * @returns
 */
export const getPositionsFromValues = (
  values: Range,
  range: Range,
  domRect: DOMRect
): { min: Position; max: Position } => {
  return {
    min: getPositionFromValue(values.min, range, domRect),
    max: getPositionFromValue(values.max, range, domRect),
  };
};

/**
 * Convert the current min and max values into percentages
 * @param {Range} values
 * @param {Range} range
 * @returns {Range} percentages of min and max positions
 */
export const getPercentagesFromValues = (
  values: Range,
  range: Range
): Range => {
  return {
    min: getPercentageFromValue(values.min, range),
    max: getPercentageFromValue(values.max, range),
  };
};

/**
 * Convert an event into a position
 * @param {Event} event
 * @param {DOMRect} domRect
 * @returns {Position} position
 */
export function getPositionFromEvent(event: Event, domRect: DOMRect): Position {
  const length = domRect.width;
  const { clientX } =
    "touches" in event
      ? (event as unknown as TouchEvent).touches[0]
      : (event as unknown as MouseEvent);

  return {
    x: clamp(clientX - domRect.left, 0, length),
    y: 0,
  };
}