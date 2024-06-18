import { ImgHTMLAttributes } from "react";

export interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  placeholderSrc: string;
}