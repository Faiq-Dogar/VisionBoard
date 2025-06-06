"use client";

import { Stage, Layer, Line, Circle } from "react-konva";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import PaletteIcon from "@mui/icons-material/Palette";
import EditIcon from "@mui/icons-material/Edit";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import SquareOutlinedIcon from "@mui/icons-material/CropSquare";
import { Badge, Button, Divider } from "@mui/material";
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

const tools = [
  { id: "pen", icon: EditIcon, label: "Pen" },
  { id: "eraser", icon: CreateOutlinedIcon, label: "Eraser" },
  { id: "circle", icon: CircleOutlinedIcon, label: "Circle" },
  { id: "rectangle", icon: SquareOutlinedIcon, label: "Rectangle" },
];

const WhiteBoardRoom = () => {
  const [lines, setLines] = useState<any[]>([]);
  const [circles, setCircles] = useState<any[]>([]);
  const [circlePos, setCirclePos] = useState({ x: 200, y: 200 });
  const isDrawing = useRef(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [lineColor, setLineColor] = useState<string>("#000");
  const [lineSize, setLineSize] = useState<number>(2);
  const [selectedTool, setSelectedTool] = useState("pen");

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
    const pos = e.target.getStage().getPointerPosition();

    if (selectedTool === "circle") {
      setCircles((prev) => [
        ...prev,
        {
          x: pos.x,
          y: pos.y,
          radius: 30,
          fill: "skyblue",
          stroke: "navy",
          strokeWidth: 2,
        },
      ]);
      return;
    }

    isDrawing.current = true;
    setLines([
      ...lines,
      {
        points: [pos.x, pos.y],
        stroke: lineColor,
        strokeWidth: lineSize,
      },
    ]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current || selectedTool !== "pen") return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    let newLines = lines.slice(0, -1);
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    setLines([...newLines, lastLine]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  if (dimensions.width === 0 || dimensions.height === 0) return null;

  return (
    <>
      <div className="relative h-screen w-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#f4f7ff] overflow-hidden flex flex-col justify-center px-4">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 my-4 ml-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <EditIcon
                className="text-white"
                style={{ fontSize: "1.25rem" }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                VisionBoard
              </h1>
              <p className="text-sm text-slate-600">Collaborative Whiteboard</p>
            </div>
          </motion.div>

          <Badge
            color="success"
            className="bg-emerald-100 text-emerald-700 border-emerald-200"
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
            Live Session
          </Badge>
        </div>
        <Divider />
        <div className="p-4 flex items-center gap-15">
          <div className="flex items-center gap-1 bg-slate-200 rounded-xl p-1">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={selectedTool === tool.id ? "contained" : "text"} // or "contained" / "outlined"
                size="small"
                onClick={() => setSelectedTool(tool.id)}
                className={`gap-2 ${
                  selectedTool === tool.id
                    ? "bg-slate-900 text-white shadow-md"
                    : ""
                }`}
              >
                <tool.icon style={{ fontSize: "1rem" }} />
                <span className="hidden sm:inline ">{tool.label}</span>
              </Button>
            ))}
          </div>
          <div className="item-center flex">
            <label className="text-sm mr-2 font-medium text-black">
              <PaletteIcon
                className="text-slate-600"
                style={{ fontSize: "1rem" }}
              />{" "}
              Color:
            </label>
            {lineColorOptions.map((color) => (
              <input
                key={color.name}
                type="color"
                value={color.value}
                className="cursor-pointer w-7 h-5 border-none px-1"
                onChange={(e) => setLineColor(e.target.value)}
              />
            ))}
          </div>
          <div className="item-center flex">
            <label className="mr-2 font-medium text-black text-sm">
              Size:{" "}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              onChange={(e) => setLineSize(Number(e.target.value))}
              className="w-30"
            />
            <span className="text-black ml-4 text-sm">{lineSize}px</span>
          </div>
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
                  stroke={line.stroke}
                  strokeWidth={line.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation="source-over"
                />
              ))}

              {/* Example Circle (commented) */}
              {circles.map((circle, i) => (
                <Circle
                  key={i}
                  {...circle}
                  draggable
                  onDragEnd={(e) =>
                    setCircles((prev) =>
                      prev.map((c, index) =>
                        index === i
                          ? { ...c, x: e.target.x(), y: e.target.y() }
                          : c
                      )
                    )
                  }
                />
              ))}
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
