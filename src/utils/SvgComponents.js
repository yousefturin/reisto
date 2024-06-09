/*
 * Copyright (C) 2024 Yusef Rayyan
 *
 * This file is part of REISTO.
 *
 * REISTO is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * REISTO is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with REISTO. If not, see <https://www.gnu.org/licenses/>.
 */




import React from "react";
import { SvgXml } from "react-native-svg";
import svgData from "../../assets/images/SVG/SvgStorage";

/**
 * Renders an SVG component based on the provided parameters.
 *
 * @param {Object} props - The props object containing the following properties:
 * @param {string} props.svgKey - The key to identify the SVG markup in the svgData object.
 * @param {number} props.width - The width of the SVG component.
 * @param {number} props.height - The height of the SVG component.
 * @param {string} props.fill - The fill color of the SVG component.
 * @param {string} props.stroke - The stroke color of the SVG component.
 * @param {number} props.strokeWidth - The stroke width of the SVG component.
 * @returns {JSX.Element} - The rendered SVG component.
 */
export default function SvgComponent({ svgKey, width, height, fill, stroke, strokeWidth }) {
    const svgMarkup = svgData[svgKey];
    const svgProps = { width, height, fill, stroke, strokeWidth };

    return <SvgXml xml={svgMarkup} {...svgProps} />;
}
