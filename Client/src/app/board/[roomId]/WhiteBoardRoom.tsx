"use client";

import { Stage, Layer, Line, Circle, Rect, Transformer } from "react-konva";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import PaletteIcon from "@mui/icons-material/Palette";
import EditIcon from "@mui/icons-material/Edit";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import SquareOutlinedIcon from "@mui/icons-material/CropSquare";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import PeopleIcon from "@mui/icons-material/People";
import MouseIcon from "@mui/icons-material/Mouse";
import { Avatar, Badge, Button, Divider } from "@mui/material";
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
  { id: "select", icon: MouseIcon, label: "Select" },
  { id: "pen", icon: EditIcon, label: "Pen" },
  { id: "eraser", icon: ClearOutlinedIcon, label: "Eraser" },
  { id: "circle", icon: CircleOutlinedIcon, label: "Circle" },
  { id: "rectangle", icon: SquareOutlinedIcon, label: "Rectangle" },
];

const WhiteBoardRoom = () => {
  const [lines, setLines] = useState<any[]>([]);
  const [circles, setCircles] = useState<any[]>([]);
  const [rectangles, setRectangles] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const isDrawing = useRef(false);
  const transformerRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [lineColor, setLineColor] = useState<string>("#000");
  const [shapeBgColor, setShapeBgColor] = useState<string>("skyblue");
  const [shapeBorderColor, setShapeBorderColor] = useState<string>("navy");
  const [shapeRadius, setShapeRadius] = useState<number>(30);
  const [shapeHeight, setShapeHeight] = useState<number>(30);
  const [lineSize, setLineSize] = useState<number>(2);
  const [selectedTool, setSelectedTool] = useState("pen");
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const [connectedUsers] = useState([
    {
      id: "1",
      name: "You",
      color: "#10b981",
    },
    {
      id: "2",
      name: "Sarah",
      color: "#3c81f8",
    },
    {
      id: "3",
      name: "Mike",
      color: "#ef4444",
    },
  ]);

  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: isOpen ? window.innerWidth - 350 : window.innerWidth - 70,
        height: window.innerHeight - 150,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [isOpen]);

  useEffect(() => {
    setLineSize(2);
    setShapeRadius(30);
    setShapeHeight(30);
  }, [selectedTool]);

  // Update transformer when selection changes
  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const stage = transformerRef.current.getStage();
      const selectedNode = stage.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);

  const generateId = () => `shape_${Date.now()}_${Math.random()}`;

  const handleStageClick = (e: any) => {
    // If clicking on stage (not on a shape)
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      setSelectedType(null);
      return;
    }
  };

  const handleMouseDown = (e: any) => {
    // If we're in select mode, don't create new shapes
    if (selectedTool === "select") {
      handleStageClick(e);
      return;
    }

    const pos = e.target.getStage().getPointerPosition();

    if (selectedTool === "circle") {
      const id = generateId();
      const newCircle = {
        id,
        x: pos.x,
        y: pos.y,
        radius: shapeRadius,
        fill: shapeBgColor,
        stroke: shapeBorderColor,
        strokeWidth: lineSize,
      };
      setCircles((prev) => [...prev, newCircle]);

      // Auto-select the newly created circle
      setSelectedId(id);
      setSelectedType("circle");
      setSelectedTool("select"); // Switch to select tool after creating
      return;
    }

    if (selectedTool === "rectangle") {
      const id = generateId();
      const newRect = {
        id,
        x: pos.x,
        y: pos.y,
        width: shapeRadius * 2,
        height: shapeHeight * 2,
        fill: shapeBgColor,
        stroke: shapeBorderColor,
        strokeWidth: lineSize,
      };
      setRectangles((prev) => [...prev, newRect]);

      // Auto-select the newly created rectangle
      setSelectedId(id);
      setSelectedType("rectangle");
      setSelectedTool("select"); // Switch to select tool after creating
      return;
    }

    // Handle pen and eraser tools
    if (selectedTool === "pen" || selectedTool === "eraser") {
      isDrawing.current = true;
      setLines([
        ...lines,
        {
          points: [pos.x, pos.y],
          stroke: selectedTool === "eraser" ? "#000000" : lineColor,
          strokeWidth: lineSize + (selectedTool === "eraser" ? 5 : 0),
          globalCompositeOperation:
            selectedTool === "eraser" ? "destination-out" : "source-over",
        },
      ]);
    }
  };

  const handleMouseMove = (e: any) => {
    if (
      !isDrawing.current ||
      (selectedTool !== "pen" && selectedTool !== "eraser")
    )
      return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    const newLines = lines.slice(0, -1);
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    setLines([...newLines, lastLine]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleShapeClick = (id: string, type: string) => {
    if (selectedTool === "eraser") {
      if (type === "circle") {
        setCircles((prev) => prev.filter((circle) => circle.id !== id));
      } else if (type === "rectangle") {
        setRectangles((prev) => prev.filter((rect) => rect.id !== id));
      }
      return;
    }

    // Select the shape
    setSelectedId(id);
    setSelectedType(type);
  };

  const handleTransform = (id: string, type: string, newAttrs: any) => {
    if (type === "circle") {
      setCircles((prev) =>
        prev.map((circle) =>
          circle.id === id
            ? {
                ...circle,
                x: newAttrs.x,
                y: newAttrs.y,
                radius: Math.max(newAttrs.radius * newAttrs.scaleX, 5),
                scaleX: 1,
                scaleY: 1,
              }
            : circle
        )
      );
    } else if (type === "rectangle") {
      setRectangles((prev) =>
        prev.map((rect) =>
          rect.id === id
            ? {
                ...rect,
                x: newAttrs.x,
                y: newAttrs.y,
                width: Math.max(newAttrs.width * newAttrs.scaleX, 5),
                height: Math.max(newAttrs.height * newAttrs.scaleY, 5),
                scaleX: 1,
                scaleY: 1,
              }
            : rect
        )
      );
    }
  };

  if (dimensions.width === 0 || dimensions.height === 0) return null;

  return (
    <>
      <div className="relative h-screen w-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#f4f7ff] overflow-hidden flex flex-col justify-center px-4">
        {/* Header */}
        <div className="flex items-center gap-4 justify-between">
          <div className="flex items-center">
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
                <p className="text-sm text-slate-600">
                  Collaborative Whiteboard
                </p>
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

          <div className="flex items-center gap-4">
            {/* Connected Users */}
            <div className="flex items-center gap-2">
              <PeopleIcon
                className="text-slate-500"
                style={{ fontSize: "1rem" }}
              />
              <span className="text-sm text-slate-600">
                {connectedUsers.length} online
              </span>
            </div>
            <div className="flex -space-x-2">
              {connectedUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative"
                >
                  <Avatar sx={{ bgcolor: user.color, width: 30, height: 30 }}>
                    {user.name.slice(0, 1)}
                  </Avatar>
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full"
                    style={{ backgroundColor: user.color }}
                  />
                </motion.div>
              ))}
            </div>

            <Button variant="outlined" size="small" className="gap-2">
              <ShareIcon style={{ fontSize: "1rem" }} />
              Share
            </Button>
          </div>
        </div>

        <Divider />

        {/* Toolbar */}
        <div className="p-4 flex items-center gap-15 justify-between">
          <div className="flex items-center gap-6">
            {/* Tools */}
            <div className="flex items-center gap-1 bg-slate-200 rounded-xl p-1">
              {tools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? "contained" : "text"}
                  size="small"
                  onClick={() => {
                    setSelectedTool(tool.id);
                    if (tool.id !== "select") {
                      setSelectedId(null);
                      setSelectedType(null);
                    }
                  }}
                  className={`gap-2 ${
                    selectedTool === tool.id
                      ? "bg-slate-900 text-white shadow-md"
                      : ""
                  }`}
                >
                  <tool.icon style={{ fontSize: "1rem" }} />
                  <span className="hidden sm:inline">{tool.label}</span>
                </Button>
              ))}
            </div>

            {/* Color Controls */}
            <div className="item-center flex">
              {selectedTool === "pen" ? (
                <>
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
                      className="cursor-pointer w-7 h-5 px-1 rounded-3xl outline-none ring-0 focus:outline-none focus:ring-0"
                      onChange={(e) => setLineColor(e.target.value)}
                    />
                  ))}
                </>
              ) : selectedTool === "circle" || selectedTool === "rectangle" ? (
                <>
                  <label className="text-sm mr-2 font-medium text-black">
                    <PaletteIcon
                      className="text-slate-600"
                      style={{ fontSize: "1rem" }}
                    />{" "}
                    Fill:
                  </label>
                  <input
                    type="color"
                    value={shapeBgColor}
                    className="cursor-pointer w-7 h-5 border-none px-1 mr-2"
                    onChange={(e) => setShapeBgColor(e.target.value)}
                  />
                  <label className="text-sm mr-2 font-medium text-black">
                    Border:
                  </label>
                  <input
                    type="color"
                    value={shapeBorderColor}
                    className="cursor-pointer w-7 h-5 border-none px-1"
                    onChange={(e) => setShapeBorderColor(e.target.value)}
                  />
                </>
              ) : null}
            </div>

            {/* Size Controls */}
            <div className="item-center flex">
              <label className="mr-2 font-medium text-black text-sm">
                Size:{" "}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={lineSize}
                onChange={(e) => setLineSize(Number(e.target.value))}
                className="w-30"
              />
              <span className="text-black ml-4 text-sm">{lineSize}px</span>

              {selectedTool === "circle" && (
                <>
                  <label className="mx-2 font-medium text-black text-sm">
                    Radius:{" "}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={shapeRadius}
                    onChange={(e) => setShapeRadius(Number(e.target.value))}
                    className="w-30"
                  />
                  <span className="text-black ml-4 text-sm">
                    {shapeRadius}px
                  </span>
                </>
              )}

              {selectedTool === "rectangle" && (
                <>
                  <label className="mx-2 font-medium text-black text-sm">
                    Width:{" "}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    value={shapeRadius}
                    onChange={(e) => setShapeRadius(Number(e.target.value))}
                    className="w-30"
                  />
                  <span className="text-black ml-4 text-sm">
                    {shapeRadius}px
                  </span>
                  <label className="mx-2 font-medium text-black text-sm">
                    Height:{" "}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    value={shapeHeight}
                    onChange={(e) => setShapeHeight(Number(e.target.value))}
                    className="w-30"
                  />
                  <span className="text-black ml-4 text-sm">
                    {shapeHeight}px
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedId && (
              <div className="text-sm text-slate-600 bg-blue-100 px-3 py-1 rounded-lg">
                {selectedType} selected - Use handles to resize
              </div>
            )}
            <Button variant="outlined" size="small" className="gap-2">
              <DownloadIcon style={{ fontSize: "1rem" }} />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        <Divider />

        {/* Canvas */}
        <div className="flex h-screen">
          <Stage
            ref={stageRef}
            width={dimensions.width}
            height={dimensions.height}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onClick={handleStageClick}
            className={
              selectedTool === "select" ? "cursor-default" : "cursor-crosshair"
            }
          >
            <Layer>
              {/* Lines */}
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.stroke}
                  strokeWidth={line.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation={
                    line.globalCompositeOperation || "source-over"
                  }
                />
              ))}

              {/* Circles */}
              {circles.map((circle) => (
                <Circle
                  key={circle.id}
                  id={circle.id}
                  {...circle}
                  draggable={selectedTool === "select"}
                  onClick={() => handleShapeClick(circle.id, "circle")}
                  onDragEnd={(e) => {
                    setCircles((prev) =>
                      prev.map((c) =>
                        c.id === circle.id
                          ? { ...c, x: e.target.x(), y: e.target.y() }
                          : c
                      )
                    );
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    handleTransform(circle.id, "circle", {
                      x: node.x(),
                      y: node.y(),
                      radius: circle.radius,
                      scaleX: node.scaleX(),
                      scaleY: node.scaleY(),
                    });
                  }}
                  stroke={selectedId === circle.id ? "#0066ff" : circle.stroke}
                  strokeWidth={
                    selectedId === circle.id
                      ? circle.strokeWidth + 2
                      : circle.strokeWidth
                  }
                />
              ))}

              {/* Rectangles */}
              {rectangles.map((rect) => (
                <Rect
                  key={rect.id}
                  id={rect.id}
                  {...rect}
                  draggable={selectedTool === "select"}
                  onClick={() => handleShapeClick(rect.id, "rectangle")}
                  onDragEnd={(e) => {
                    setRectangles((prev) =>
                      prev.map((r) =>
                        r.id === rect.id
                          ? { ...r, x: e.target.x(), y: e.target.y() }
                          : r
                      )
                    );
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    handleTransform(rect.id, "rectangle", {
                      x: node.x(),
                      y: node.y(),
                      width: rect.width,
                      height: rect.height,
                      scaleX: node.scaleX(),
                      scaleY: node.scaleY(),
                    });
                  }}
                  stroke={selectedId === rect.id ? "#0066ff" : rect.stroke}
                  strokeWidth={
                    selectedId === rect.id
                      ? rect.strokeWidth + 2
                      : rect.strokeWidth
                  }
                />
              ))}

              {/* Transformer */}
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  // Limit resize
                  if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox;
                  }
                  return newBox;
                }}
                enabledAnchors={[
                  "top-left",
                  "top-center",
                  "top-right",
                  "middle-right",
                  "middle-left",
                  "bottom-left",
                  "bottom-center",
                  "bottom-right",
                ]}
              />
            </Layer>
          </Stage>

          {/* Chat Drawer */}
          <ChatDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
    </>
  );
};

export default WhiteBoardRoom;
