import classNames from "classnames";
import { Children, MouseEvent, TouchEvent, useEffect, useRef } from "react";
import Slider from "./Slider";
import Track from "./Track";
import "./styles.less";
import { InputRangeProps, Position, Range, Value } from "./types";
import {
  convertValueIntoRange,
  distanceTo,
  getPercentagesFromValues,
  getPositionFromEvent,
  getPositionsFromValues,
  getRoundedValueFromValueOnTrack,
  getValueOnTrackFromPosition,
  isDefined,
  isMultiValue,
  isWithinRange,
} from "./utils";

export const PREFIX = "rcs-InputRange";

export default function InputRange<T extends Value>(props: InputRangeProps<T>) {
  const {
    onChangeStart,
    onChangeEnd,
    onChange,
    value = 0,
    range,
    renderValueLabel,
    disabled = false,
    step = 1,
    allowTheSameValues = false,
    draggableTrack = true,
  } = props;

  const refStartValue = useRef<Value | null>(null);
  const refNode = useRef<HTMLDivElement>(null);
  const refIsSliderDragging = useRef<boolean>(false);
  const refTrack = useRef<HTMLDivElement>(null);
  const refLastKeyMove = useRef<keyof Range | null>(null);

  const convertedValues = convertValueIntoRange(value, range);

  /**
   *
   * Handle interaction start
   */
  const handleInteractionStart = (e: MouseEvent | TouchEvent) => {
    console.log({ e });
    onChangeStart?.(value as T);
    if (onChangeEnd && !isDefined(refStartValue.current)) {
      refStartValue.current = value;
    }
  };

  /**
   *
   * Handle interaction end
   */
  const handleInteractionEnd = (e: Event) => {
    console.log({ e });
    if (refIsSliderDragging.current) {
      refIsSliderDragging.current = false;
    }

    if (onChangeEnd) {
      if (refStartValue.current !== value) {
        onChangeEnd(value as T);
      }
    }

    refStartValue.current = null;
  };

  /**
   *
   * add and remove "mouseup" listener
   */
  const addMouseUpListener = () => {
    refNode.current?.ownerDocument.addEventListener("mouseup", onMouseUp);
  };
  const removeMouseUpListener = () => {
    refNode.current?.ownerDocument.removeEventListener("mouseup", onMouseUp);
  };

  /**
   *
   * add and remove "touchend" listener
   */

  const addTouchEndListener = () => {
    refNode.current?.ownerDocument.addEventListener("touchend", onTouchEnd);
  };
  const removeTouchEndListener = () => {
    refNode.current?.ownerDocument.removeEventListener("touchend", onTouchEnd);
  };

  /**
   *
   * Handle "mouseup" listener
   */
  const onMouseUp = (e: Event) => {
    handleInteractionEnd(e);
    removeMouseUpListener();
  };

  /**
   *
   * hanlde "touchend" listener
   */

  const onTouchEnd = (e: Event) => {
    handleInteractionEnd(e);
    removeTouchEndListener();
  };

  /**
   *
   * Handle "touchstart": onChangeStart + addTouchendListener -> handleTouchEnd -> onChangeEnd + removeTouchEndListener
   */
  const onTouchStart = (e: TouchEvent) => {
    handleInteractionStart(e);
    addTouchEndListener();
  };

  /**
   *
   * Handle "mousedown": onChangeStart + addMouseUpListener -> handleMouseUp -> onChangeEnd + removeMouseUpListener
   */
  const onMouseDown = (e: MouseEvent) => {
    handleInteractionStart(e);
    addMouseUpListener();
  };

  /**
   * Update the position of the slider
   * @param {string} key position key of "mousedown" point
   * @param {Position} position min and max positions
   */
  const updatePosition = (key: keyof Range, position: Position): void => {
    if (refTrack.current) {
      const positions = getPositionsFromValues(
        convertedValues,
        range,
        refTrack.current.getBoundingClientRect()
      );
      positions[key] = position;
      refLastKeyMove.current = key;
      updatePositions(positions);
    }
  };

  /**
   * Update min max position
   * @param {min: Position, max: Position} positions min max positions
   * @returns
   */
  const updatePositions = (positions: {
    min: Position;
    max: Position;
  }): void => {
    if (!refTrack.current) return;
    const currentValues = {
      min: getValueOnTrackFromPosition(
        positions.min,
        range,
        refTrack.current.getBoundingClientRect()
      ),
      max: getValueOnTrackFromPosition(
        positions.max,
        range,
        refTrack.current.getBoundingClientRect()
      ),
    };

    const roundedValues: Range = {
      min: getRoundedValueFromValueOnTrack(currentValues.min, step),
      max: getRoundedValueFromValueOnTrack(currentValues.max, step),
    };

    updateValues(roundedValues);
  };

  const shouldUpdate = (currentValues: Range) => {
    return isWithinRange(
      currentValues,
      range,
      allowTheSameValues,
      isMultiValue(value)
    );
  };

  /**
   * Update values
   * @param values
   */
  const updateValues = (values: Range): void => {
    if (!shouldUpdate(values)) return;
    onChange?.((isMultiValue(value) ? values : values.max) as T);
  };

  /**
   * Return the position key of "mousedown" position: min or max
   * @param position "mousedown" position
   * @returns
   */
  const getKeyByPosition = (position: Position): keyof Range | null => {
    if (!refNode.current) return null;
    const positions = getPositionsFromValues(
      convertedValues,
      range,
      refNode.current.getBoundingClientRect()
    );

    if (isMultiValue(value)) {
      const distanceToMin = distanceTo(position, positions.min);
      const distanceToMax = distanceTo(position, positions.max);

      if (distanceToMin < distanceToMax) {
        return "min";
      }
    }

    return "max";
  };

  /**
   *
   * Handle track "mousedown"
   */
  const handleTrackMouseDown = (e: MouseEvent | TouchEvent, pos: Position) => {
    if (disabled || !refNode.current) return;
    e.preventDefault();
    const key = getKeyByPosition(pos);
    if (!key) return;

    if (!draggableTrack) {
      updatePosition(key, pos);
    }
  };

  const onSliderDrag = (e: Event, key: keyof Range) => {
    if (disabled || !refTrack.current) return;

    refIsSliderDragging.current = true;
    const position = getPositionFromEvent(
      e,
      refTrack.current.getBoundingClientRect()
    );
    requestAnimationFrame(() => updatePosition(key, position));
  };

  const percentages = getPercentagesFromValues(convertedValues, range);

  const renderSliders = () => {
    const keys: (keyof Range)[] = isMultiValue(value)
      ? (Object.keys(convertedValues) as (keyof Range)[])
      : ["max"];

    return Children.toArray(
      keys.map((key: keyof Range) => {
        const label =
          renderValueLabel?.(convertedValues[key]) || convertedValues[key];
        return (
          <Slider
            onSliderDrag={onSliderDrag}
            type={key}
            percentage={percentages[key]}
          >
            {label}
          </Slider>
        );
      })
    );
  };

  /**
   * Handle track drag
   */

  const handleTrackDrag = (prevEvent: Event, currentEvent: Event) => {
    if (!draggableTrack || disabled || refIsSliderDragging.current) return;
    if (!refTrack.current) return;

    const domRectTrack = refTrack.current.getBoundingClientRect();

    const currentPosition = getPositionFromEvent(currentEvent, domRectTrack);
    const currentValue = getValueOnTrackFromPosition(
      currentPosition,
      range,
      domRectTrack
    );
    const currentRoundedValue = getRoundedValueFromValueOnTrack(
      currentValue,
      step
    );

    const prevPosition = getPositionFromEvent(prevEvent, domRectTrack);
    const prevalue = getValueOnTrackFromPosition(
      prevPosition,
      range,
      domRectTrack
    );
    const prevRoundedValue = getRoundedValueFromValueOnTrack(prevalue, step);

    const offset = currentRoundedValue - prevRoundedValue;

    updateValues({
      min: convertedValues.min + offset,
      max: convertedValues.max + offset,
    });
  };

  useEffect(() => {
    return () => {
      removeMouseUpListener();
      removeTouchEndListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={classNames(`${PREFIX}`, { disabled })}
      ref={refNode}
      {...{ onTouchStart, onMouseDown }}
    >
      <Track
        draggableTrack={draggableTrack}
        percentages={percentages}
        ref={refTrack}
        handleTrackDrag={handleTrackDrag}
        handleTrackMouseDown={handleTrackMouseDown}
      >
        {renderSliders()}
      </Track>
    </div>
  );
}
