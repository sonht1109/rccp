import { Position, Range, Value } from "../types";

export const isDefined = (value: any) => value !== undefined && value !== null;

export const isObject = (value: Value) =>
  value !== null && typeof value === "object";

export const isNumber = (val: any) => typeof val === "number";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function distanceTo(pointA: Position, pointB: Position): number {
  const xDiff = (pointB.x - pointA.x) ** 2;
  const yDiff = (pointB.y - pointA.y) ** 2;

  return Math.sqrt(xDiff + yDiff);
}

export const isMultiValue = (val: Value) => !isNumber(val);

export const isWithinRange = (
  values: Range,
  range: Range,
  allowTheSameValue: boolean,
  isMultiValues: boolean
) => {
  if (isMultiValues) {
    return (
      values.min >= range.min &&
      values.max <= range.max &&
      (allowTheSameValue ? values.min <= values.max : values.min < values.max)
    );
  }

  return values.max <= range.max && values.max >= range.min;
};

export * from "./value-transformer";
