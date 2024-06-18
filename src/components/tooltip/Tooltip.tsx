import React, { FC, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TooltipLabelProps, TooltipPoint, TooltipProps } from "./types";
import { getPoint, getToolTipAnimationStyles, getToolTipStyles } from "./utils";
import "./styles.less";

const PREFIX = "rcs-Tooltip";

export default function Tooltip(props: TooltipProps) {
  const {
    children,
    label,
    offset = 4,
    placement = "top",
    disabled = false,
  } = props;

  const [show, toggle] = useState<boolean>(false);

  const refPoint = useRef<TooltipPoint>({ x: null, y: null });
  const refTt = useRef<HTMLSpanElement>(null);

  const onMouseEnter = (e: Event) => {
    toggle(true);
    e.target?.addEventListener("mouseleave", onMouseLeave);

    if (e.currentTarget && refPoint.current) {
      const ttRect = refTt.current?.getBoundingClientRect();
      if (ttRect) {
        refPoint.current = getPoint(
          (e.currentTarget as HTMLElement).getBoundingClientRect(),
          ttRect,
          placement,
          offset
        );
      }
    }
  };

  const onMouseLeave = (e: Event) => {
    toggle(false);
    e.currentTarget?.removeEventListener("mouseleave", onMouseLeave);
  };

  return (
    <>
      {disabled ? children : React.cloneElement(children, { onMouseEnter })}
      {!disabled &&
        createPortal(
          <span
            className={PREFIX}
            ref={refTt}
            style={getToolTipStyles(refPoint.current)}
          >
            <div
              className={`${PREFIX}__Animation`}
              style={getToolTipAnimationStyles({
                ...props,
                show,
              })}
            >
              {label}
            </div>
          </span>,
          document.body
        )}
    </>
  );
}

const Label: FC<TooltipLabelProps> = ({ children }) => {
  return <span className={`${PREFIX}__Label`}>{children}</span>;
};

Tooltip.Label = Label;
