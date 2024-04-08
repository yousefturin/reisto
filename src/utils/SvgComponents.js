import React from "react";
import { SvgXml } from "react-native-svg";
import svgData from "../../assets/images/SVG/SvgStorage";

export default function SvgComponent({ svgKey, width, height, fill, stroke, strokeWidth }) {
    const svgMarkup = svgData[svgKey];
    const svgProps = { width, height, fill, stroke, strokeWidth };

    return <SvgXml xml={svgMarkup} {...svgProps} />;
}
