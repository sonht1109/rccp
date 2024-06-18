import { useEffect, useRef } from "react";
import "./styles.less";
import { LazyImageProps } from "./types";

export default function LazyImage(props: LazyImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    if (!ref.current) return;
    const refCurrent = ref.current;
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const imgLoader = new Image();
        imgLoader.src = props.src || "";
        imgLoader.onload = () => {
          refCurrent?.setAttribute("src", props.src || "");
          refCurrent?.classList.add("opacity");
        };
        imgLoader.onerror = () => {
          refCurrent?.setAttribute("src", props.placeholderSrc || "");
          refCurrent?.classList.add("opacity");
        };
        observer.current?.disconnect();
      }
    });
    observer.current.observe(refCurrent);

    return () => {
      if (refCurrent && observer.current) observer.current.disconnect();
    };
  }, [props.src, props.placeholderSrc]);

  return <img ref={ref} alt="" {...props} src={props.placeholderSrc} className="rcs-LazyImage" />;
}
