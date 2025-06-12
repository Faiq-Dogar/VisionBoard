"use client";

import {
  Stage,
  Layer,
  Line,
  Circle,
  Rect,
  Transformer,
  Image,
  Text as KonvaText,
} from "react-konva";
import Konva from "konva";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import PaletteIcon from "@mui/icons-material/Palette";
import EditIcon from "@mui/icons-material/Edit";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import SquareOutlinedIcon from "@mui/icons-material/CropSquare";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import TextFormatOutlinedIcon from "@mui/icons-material/TextFormatOutlined";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import PeopleIcon from "@mui/icons-material/People";
import MouseIcon from "@mui/icons-material/Mouse";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Popover,
  Select,
  MenuItem,
  IconButton,
  FormControl,
} from "@mui/material";
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
  { id: "image", icon: ImageOutlinedIcon, label: "Image" },
  { id: "text", icon: TextFormatOutlinedIcon, label: "Text" },
];

const fontFamilies = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Impact",
];

const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];

interface ImageObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement;
  rotation?: number;
}

interface TextObject {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  width?: number;
  height?: number;
  rotation?: number;
  fontStyle?: string;
  align?: string;
  textDecoration?: string;
}

const WhiteBoardRoom = () => {
  const [lines, setLines] = useState<any[]>([]);
  const [circles, setCircles] = useState<any[]>([]);
  const [rectangles, setRectangles] = useState<any[]>([]);
  const [images, setImages] = useState<ImageObject[]>([]);
  const [texts, setTexts] = useState<TextObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [textEditVisible, setTextEditVisible] = useState<boolean>(false);
  const [currentTextValue, setCurrentTextValue] = useState<string>("");
  const [textAnchorEl, setTextAnchorEl] = useState<HTMLElement | null>(null);
  const [textColor, setTextColor] = useState<string>("#000000");
  const [fontSize, setFontSize] = useState<number>(24);
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderlined, setIsUnderlined] = useState<boolean>(false);

  const isDrawing = useRef(false);
  const transformerRef = useRef<any>(null);
  const stageRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textNodeRef = useRef<any>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [lineColor, setLineColor] = useState<string>("#000");
  const [shapeBgColor, setShapeBgColor] = useState<string>("skyblue");
  const [shapeBorderColor, setShapeBorderColor] = useState<string>("navy");
  const [shapeRadius, setShapeRadius] = useState<number>(30);
  const [shapeHeight, setShapeHeight] = useState<number>(30);
  const [lineSize, setLineSize] = useState<number>(2);
  const [selectedTool, setSelectedTool] = useState("pen");
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [connectedUsers] = useState([
    {
      id: "1",
      name: "You",
      color: "#10b981",
    },
    {
      id: "2",
      name: "Aneeqa",
      color: "#3c81f8",
    },
    {
      id: "3",
      name: "Rafay",
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

  // Handle double click on text to edit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && textEditVisible) {
        setTextEditVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [textEditVisible]);

  // Focus text area when editing starts
  useEffect(() => {
    if (textEditVisible && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [textEditVisible]);

  const generateId = () => `shape_${Date.now()}_${Math.random()}`;

  const handleStageClick = (e: any) => {
    if (textEditVisible) {
      setTextEditVisible(false);
      updateTextAfterEdit();
    }

    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      setSelectedType(null);
      return;
    }
  };

  const handleMouseDown = (e: any) => {
    if (selectedTool === "select") {
      handleStageClick(e);
      return;
    }

    if (selectedTool === "image") {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
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

      setSelectedId(id);
      setSelectedType("circle");
      setSelectedTool("select");
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

      setSelectedId(id);
      setSelectedType("rectangle");
      setSelectedTool("select");
      return;
    }

    if (selectedTool === "text") {
      const id = generateId();
      const newText: TextObject = {
        id,
        x: pos.x,
        y: pos.y,
        text: "Double-click to edit",
        fontSize,
        fontFamily,
        fill: textColor,
        fontStyle: getFontStyle(),
        textDecoration: isUnderlined ? "underline" : "",
        align: "left",
      };
      setTexts((prev) => [...prev, newText]);
      setSelectedId(id);
      setSelectedType("text");
      setSelectedTool("select");
      return;
    }

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
      } else if (type === "image") {
        setImages((prev) => prev.filter((image) => image.id !== id));
      } else if (type === "text") {
        setTexts((prev) => prev.filter((text) => text.id !== id));
      }
      return;
    }

    setSelectedId(id);
    setSelectedType(type);

    if (type === "text") {
      const selectedText = texts.find((t) => t.id === id);
      if (selectedText) {
        setTextColor(selectedText.fill);
        setFontSize(selectedText.fontSize);
        setFontFamily(selectedText.fontFamily);
        setIsBold(selectedText.fontStyle?.includes("bold") || false);
        setIsItalic(selectedText.fontStyle?.includes("italic") || false);
        setIsUnderlined(selectedText.textDecoration === "underline");
      }
    }
  };

  const handleTextDblClick = (e: any, id: string) => {
    // Prevent stage click handler
    e.cancelBubble = true;

    const text = texts.find((t) => t.id === id);
    if (!text) return;

    // Get position of text for the editor
    const textNode = e.target;
    const stage = textNode.getStage();
    const position = textNode.absolutePosition();

    // Set the text editor position and content
    setCurrentTextValue(text.text);
    setTextEditVisible(true);
    textNodeRef.current = textNode;

    // Position the text editor
    if (textAreaRef.current) {
      const areaPosition = {
        x: position.x,
        y: position.y,
      };

      textAreaRef.current.style.position = "absolute";
      textAreaRef.current.style.top = `${areaPosition.y}px`;
      textAreaRef.current.style.left = `${areaPosition.x}px`;
      textAreaRef.current.style.width = `${Math.max(
        textNode.width() * textNode.scaleX(),
        100
      )}px`;
      textAreaRef.current.style.height = `${Math.max(
        textNode.height() * textNode.scaleY(),
        50
      )}px`;
      textAreaRef.current.style.fontSize = `${text.fontSize}px`;
      textAreaRef.current.style.fontFamily = text.fontFamily;
      textAreaRef.current.style.color = text.fill;
      textAreaRef.current.style.fontWeight = text.fontStyle?.includes("bold")
        ? "bold"
        : "normal";
      textAreaRef.current.style.fontStyle = text.fontStyle?.includes("italic")
        ? "italic"
        : "normal";
      textAreaRef.current.style.textDecoration = text.textDecoration || "none";
    }
  };

  const updateTextAfterEdit = () => {
    if (!selectedId) return;

    setTexts((prev) =>
      prev.map((t) =>
        t.id === selectedId
          ? {
              ...t,
              text: currentTextValue,
              fill: textColor,
              fontSize,
              fontFamily,
              fontStyle: getFontStyle(),
              textDecoration: isUnderlined ? "underline" : "",
            }
          : t
      )
    );
  };

  const getFontStyle = () => {
    let style = "";
    if (isBold) style += "bold ";
    if (isItalic) style += "italic";
    return style.trim();
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
    } else if (type === "image") {
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? {
                ...img,
                x: newAttrs.x,
                y: newAttrs.y,
                width: Math.max(newAttrs.width * newAttrs.scaleX, 5),
                height: Math.max(newAttrs.height * newAttrs.scaleY, 5),
                rotation: newAttrs.rotation,
                scaleX: 1,
                scaleY: 1,
              }
            : img
        )
      );
    } else if (type === "text") {
      setTexts((prev) =>
        prev.map((txt) =>
          txt.id === id
            ? {
                ...txt,
                x: newAttrs.x,
                y: newAttrs.y,
                width: Math.max(newAttrs.width * newAttrs.scaleX, 5),
                height: Math.max(newAttrs.height * newAttrs.scaleY, 5),
                rotation: newAttrs.rotation,
                scaleX: 1,
                scaleY: 1,
              }
            : txt
        )
      );
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) return;

      const img = new window.Image();
      img.src = event.target.result as string;
      img.onload = () => {
        const id = generateId();
        const aspectRatio = img.width / img.height;

        // Calculate position to center the image
        const stageWidth = dimensions.width;
        const stageHeight = dimensions.height;

        // Set a maximum size for the image (50% of the smaller dimension)
        const maxWidth = stageWidth * 0.5;
        const maxHeight = stageHeight * 0.5;

        let width, height;
        if (img.width > maxWidth || img.height > maxHeight) {
          if (aspectRatio > 1) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
          } else {
            height = maxHeight;
            width = maxHeight * aspectRatio;
          }
        } else {
          width = img.width;
          height = img.height;
        }

        const x = (stageWidth - width) / 2;
        const y = (stageHeight - height) / 2;

        const newImage: ImageObject = {
          id,
          x,
          y,
          width,
          height,
          image: img,
        };

        setImages((prev) => [...prev, newImage]);
        setSelectedId(id);
        setSelectedType("image");
        setSelectedTool("select");
        setIsUploading(false);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
    };
    reader.readAsDataURL(file);
  };

  if (dimensions.width === 0 || dimensions.height === 0) return null;

  const handleDownload = () => {
    if (!stageRef.current) return;

    const stage = stageRef.current;
    const layer = stage.getLayers()[0];

    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: stage.width(),
      height: stage.height(),
      fill: "white",
      listening: false,
    });

    layer.add(background);
    background.moveToBottom();
    layer.draw();

    const uri = stage.toDataURL({
      mimeType: "image/jpeg",
      quality: 1.0,
      pixelRatio: 2,
    });

    background.destroy();
    layer.draw();

    const link = document.createElement("a");
    link.download = "whiteboard.jpeg";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTextFormatting = (event: React.MouseEvent<HTMLElement>) => {
    setTextAnchorEl(event.currentTarget);
  };

  const handleCloseTextFormatting = () => {
    setTextAnchorEl(null);
    updateTextAfterEdit();
  };
  return (
    <>
      <div className="relative h-screen w-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#f4f7ff] overflow-hidden flex flex-col justify-center px-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
        {textEditVisible && (
          <textarea
            ref={textAreaRef}
            value={currentTextValue}
            onChange={(e) => setCurrentTextValue(e.target.value)}
            style={{
              position: "absolute",
              top: "10%",
              zIndex: 1000,
              border: "1px solid #0066ff",
              padding: "5px",
              margin: 0,
              overflow: "hidden",
              background: "rgba(255,255,255,0.8)",
              outline: "none",
              resize: "both",
              color: "black",
            }}
          />
        )}
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
                    if (tool.id === "image") {
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    } else {
                      setSelectedTool(tool.id);
                      if (tool.id !== "select") {
                        setSelectedId(null);
                        setSelectedType(null);
                      }
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
                  {tool.id === "image" && isUploading && (
                    <span className="animate-pulse ml-1">•</span>
                  )}{" "}
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
              ) : selectedTool === "text" ||
                (selectedType === "text" && selectedId) ? (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleTextFormatting}
                    className="flex items-center gap-1"
                  >
                    <TextFormatOutlinedIcon style={{ fontSize: "1rem" }} />
                    Text Format
                  </Button>
                  <Popover
                    open={Boolean(textAnchorEl)}
                    anchorEl={textAnchorEl}
                    onClose={handleCloseTextFormatting}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <div className="p-4 w-80">
                      <h3 className="text-lg font-medium mb-3">
                        Text Formatting
                      </h3>

                      <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">
                          Color
                        </label>
                        <div className="flex gap-2">
                          {lineColorOptions.map((color) => (
                            <div
                              key={color.name}
                              className={`w-6 h-6 rounded-full cursor-pointer border ${
                                textColor === color.value
                                  ? "border-black border-2"
                                  : "border-gray-300"
                              }`}
                              style={{ backgroundColor: color.value }}
                              onClick={() => setTextColor(color.value)}
                            />
                          ))}
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-6 h-6 cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Font Size
                          </label>
                          <FormControl fullWidth size="small">
                            <Select
                              value={fontSize}
                              onChange={(e) =>
                                setFontSize(Number(e.target.value))
                              }
                            >
                              {fontSizes.map((size) => (
                                <MenuItem key={size} value={size}>
                                  {size}px
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Font Family
                          </label>
                          <FormControl fullWidth size="small">
                            <Select
                              value={fontFamily}
                              onChange={(e) =>
                                setFontFamily(e.target.value as string)
                              }
                            >
                              {fontFamilies.map((font) => (
                                <MenuItem
                                  key={font}
                                  value={font}
                                  style={{ fontFamily: font }}
                                >
                                  {font}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>

                      <div className="flex justify-center gap-2 mb-3">
                        <IconButton
                          color={isBold ? "primary" : "default"}
                          onClick={() => setIsBold(!isBold)}
                          size="small"
                        >
                          <FormatBoldIcon />
                        </IconButton>
                        <IconButton
                          color={isItalic ? "primary" : "default"}
                          onClick={() => setIsItalic(!isItalic)}
                          size="small"
                        >
                          <FormatItalicIcon />
                        </IconButton>
                        <IconButton
                          color={isUnderlined ? "primary" : "default"}
                          onClick={() => setIsUnderlined(!isUnderlined)}
                          size="small"
                        >
                          <FormatUnderlinedIcon />
                        </IconButton>
                      </div>

                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleCloseTextFormatting}
                      >
                        Apply Formatting
                      </Button>
                    </div>
                  </Popover>
                </>
              ) : null}
            </div>

            {/* Size Controls */}
            <div className="item-center flex">
              {selectedTool !== "select" && (
                <>
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
                </>
              )}

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
                {selectedType === "text" && " (Double-click to edit)"}
              </div>
            )}
            <Button
              variant="outlined"
              size="small"
              className="gap-2"
              onClick={handleDownload}
            >
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

              {images.map((img) => (
                <Image
                  key={img.id}
                  id={img.id}
                  x={img.x}
                  y={img.y}
                  width={img.width}
                  height={img.height}
                  image={img.image}
                  rotation={img.rotation || 0}
                  draggable={selectedTool === "select"}
                  onClick={() => handleShapeClick(img.id, "image")}
                  onDragEnd={(e) => {
                    setImages((prev) =>
                      prev.map((i) =>
                        i.id === img.id
                          ? { ...i, x: e.target.x(), y: e.target.y() }
                          : i
                      )
                    );
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    handleTransform(img.id, "image", {
                      x: node.x(),
                      y: node.y(),
                      width: img.width,
                      height: img.height,
                      rotation: node.rotation(),
                      scaleX: node.scaleX(),
                      scaleY: node.scaleY(),
                    });
                  }}
                  stroke={selectedId === img.id ? "#0066ff" : undefined}
                  strokeWidth={selectedId === img.id ? 2 : 0}
                  strokeEnabled={selectedId === img.id}
                />
              ))}

              {/* Text Elements */}
              {texts.map((text) => (
                <KonvaText
                  key={text.id}
                  id={text.id}
                  x={text.x}
                  y={text.y}
                  text={text.text}
                  fontSize={text.fontSize}
                  fontFamily={text.fontFamily}
                  fill={text.fill}
                  width={text.width}
                  height={text.height}
                  rotation={text.rotation || 0}
                  draggable={selectedTool === "select"}
                  fontStyle={text.fontStyle}
                  textDecoration={text.textDecoration}
                  align={text.align}
                  onClick={() => handleShapeClick(text.id, "text")}
                  onDblClick={(e) => handleTextDblClick(e, text.id)}
                  onDragEnd={(e) => {
                    setTexts((prev) =>
                      prev.map((t) =>
                        t.id === text.id
                          ? { ...t, x: e.target.x(), y: e.target.y() }
                          : t
                      )
                    );
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    handleTransform(text.id, "text", {
                      x: node.x(),
                      y: node.y(),
                      width: node.width() * node.scaleX(),
                      height: node.height() * node.scaleY(),
                      rotation: node.rotation(),
                      scaleX: 1,
                      scaleY: 1,
                    });
                  }}
                  stroke={selectedId === text.id ? "#0066ff" : undefined}
                  strokeWidth={selectedId === text.id ? 1 : 0}
                  strokeEnabled={selectedId === text.id}
                  padding={5}
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

//Rounded corners
//Text
//Share room link
//If someone transforms an element for the forst time, It's working perfectly. But from furtheron, the scaling is not working properly.
