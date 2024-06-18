import { useEffect, useRef } from "react";
import "./styles.less";
import { InputRangeSliderProps } from "./types";

export const PREFIX = "rcs-InputRange";

export default function Slider(props: InputRangeSliderProps) {
  const { type, percentage, onSliderDrag } = props;

  const refNode = useRef<HTMLDivElement>(null);

  const leftByPercentage = percentage * 100 + "%";

  /**
   * add and remove "mousemove" listener
   */
  const addMouseMoveListener = () => {
    refNode.current?.ownerDocument.addEventListener("mousemove", onMouseMove);
  };
  const removeMouseMoveListener = () => {
    refNode.current?.ownerDocument.removeEventListener(
      "mousemove",
      onMouseMove
    );
  };

  /**
   * add and remove "mouseup" listener
   */
  const addMouseUpListener = () => {
    refNode?.current?.ownerDocument?.addEventListener("mouseup", onMouseUp);
  };
  const removeMouseUpListener = () => {
    refNode?.current?.ownerDocument?.removeEventListener("mouseup", onMouseUp);
  };

  /**
   * add and remove "touchmove" listener
   */
  const addTouchMoveListener = () => {
    refNode.current?.ownerDocument.addEventListener("touchmove", onTouchMove);
  };
  const removeTouchMoveListener = () => {
    refNode.current?.ownerDocument.removeEventListener(
      "touchmove",
      onTouchMove
    );
  };

  /**
   * add and remove "touchend" listener
   */
  const addTouchEndListener = () => {
    refNode?.current?.ownerDocument.addEventListener("touchend", onTouchEnd);
  };
  const removeTouchEndListener = () => {
    refNode?.current?.ownerDocument.removeEventListener("touchend", onTouchEnd);
  };

  /**
   * Handle "mouseup"
   */
  const onMouseUp = (): void => {
    removeMouseMoveListener();
    removeMouseUpListener();
  };

  /**
   * Handle "mousemove"
   */
  const onMouseMove = (e: Event): void => {
    onSliderDrag(e, type);
  };

  /**
   * Handle "touchend"
   */
  const onTouchEnd = (): void => {
    removeTouchMoveListener();
    removeTouchEndListener();
  };

  /**
   * Handle "touchmove"
   */
  const onTouchMove = (e: Event): void => {
    onSliderDrag(e, type);
  };

  /**
   * Handle "mousedown"
   */
  const onMouseDown = (): void => {
    addMouseMoveListener();
    addMouseUpListener();
  };

  /**
   * Handle "touchstart"
   */
  const onTouchStart = (): void => {
    addTouchMoveListener();
    addTouchEndListener();
  };

  useEffect(() => {
    return () => {
      removeMouseMoveListener();
      removeMouseUpListener();
      removeTouchMoveListener();
      removeTouchEndListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={refNode}
      className={PREFIX + "__Slider"}
      style={{ left: leftByPercentage }}
    >
      <button
        {...{ onMouseDown, onTouchStart }}
        className={`${PREFIX}__SliderThumb`}
      ></button>
    </div>
  );
}
