import React from "react";
import { Img, staticFile } from "remotion";

type Props = {
  src: string;
  borderRadius?: number;
};

/** AI-generated illustration from remotion/public/generated/ */
export const AiIllustration: React.FC<Props> = ({ src, borderRadius = 18 }) => (
  <Img
    src={staticFile(src)}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius,
    }}
  />
);
