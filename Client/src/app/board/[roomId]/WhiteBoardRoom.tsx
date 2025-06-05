"use client";

import { Stage, Layer, Line, Circle } from "react-konva";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import PaletteIcon from "@mui/icons-material/Palette";
import { Divider } from "@mui/material";
import ChatDrawer from "./ChatDrawer";
const lineColorOptions = [
  { name: "black", value: "#000000" },
  { name: "red", value: "#ee4444" },
  { name: "orange", value: "#f1a00a" },
  { name: "green", value: "#14b781" },
  { name: "blue", value: "#3c81f8" },
  { name: "indigo", value: "#6167ec" },
  { name: "pink", value: "#ea489d" },
];

const WhiteBoardRoom = () => {
  const [lines, setLines] = useState<any[]>([]);
  const [circlePos, setCirclePos] = useState({ x: 200, y: 200 });
  const isDrawing = useRef(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [lineColor, setLineColor] = useState<string>("#000");
  const [lineSize, setLineSize] = useState<number>(2);

  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: window.innerWidth - 350,
        height: window.innerHeight - 150,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    const newLines = lines.slice(0, -1).concat(lastLine);
    setLines(newLines);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  if (dimensions.width === 0 || dimensions.height === 0) return null;

  return (
    <>
      <div className="relative h-screen w-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#f4f7ff] overflow-hidden flex flex-col justify-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          // className="text-7xl md:text-8xl font-black bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-4 leading-tight"
          className="text-6xl font-extrabold text-gray-900 drop-shadow-md text-center my-3"
        >
          VisionBoard
        </motion.h1>
        <Divider />
        <div className="p-4">
          <label className="mr-2 font-medium text-black">Choose Color:</label>
          {lineColorOptions.map((color) => (
            <input
              key={color.name}
              type="color"
              value={color.value}
              className="cursor-pointer w-7 h-5 border-none px-1"
              onChange={(e) => setLineColor(e.target.value)}
            />
          ))}
          <label className="mr-2 font-medium text-black ml-7">
            Select Size:{" "}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            onChange={(e) => setLineSize(Number(e.target.value))}
          />
          <span className="text-black ml-4">{lineSize}px</span>
        </div>
        <Divider />
        <div className="flex h-screen">
          {/* Left: Drawing Canvas */}
          <Stage
            width={dimensions.width}
            height={dimensions.height}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
          >
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={lineColor}
                  strokeWidth={lineSize}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation="source-over"
                />
              ))}

              {/* Example Circle (commented) */}
              {/* <Circle
        x={circlePos.x}
        y={circlePos.y}
        radius={30}
        fill="skyblue"
        stroke="navy"
        strokeWidth={2}
        draggable
        onDragEnd={(e) =>
          setCirclePos({ x: e.target.x(), y: e.target.y() })
        }
      /> */}
            </Layer>
          </Stage>

          {/* Right: Chat Drawer */}
          <ChatDrawer />
        </div>
      </div>
    </>
  );
};

export default WhiteBoardRoom;
