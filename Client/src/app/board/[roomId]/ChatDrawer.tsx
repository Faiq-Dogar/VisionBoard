"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface Message {
  id: number;
  user: string;
  content: string;
  timestamp: Date;
  avatar: string;
}

interface ChatDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function ChatDrawer({ isOpen, setIsOpen }: ChatDrawerProps) {
  const [dimensions, setDimensions] = useState({ height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        height: window.innerHeight - 150,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // const storedMessages = localStorage.getItem("chatMessages");
    // if (storedMessages) {
    //   try {
    //     const parsed = JSON.parse(storedMessages);
    //     const parsedMessages = parsed.map((msg: any) => ({
    //       ...msg,
    //       timestamp: new Date(msg.timestamp), // convert back to Date object
    //     }));
    //     setMessages(parsedMessages);
    //   } catch (err) {
    //     console.error("Error loading chat messages from localStorage", err);
    //   }
    // }

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // const clearChat = () => {
  //   setMessages([]);
  //   localStorage.removeItem("chatMessages");
  // };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: "Alice",
      content: "Hey there! Welcome to the whiteboard session.",
      timestamp: new Date(Date.now() - 300000),
      avatar: "",
    },
    {
      id: 2,
      user: "Bob",
      content: "Great! Let's start brainstorming some ideas.",
      timestamp: new Date(Date.now() - 240000),
      avatar: "",
    },
    {
      id: 3,
      user: "Charlie",
      content: "I'll start by drawing the main concept.",
      timestamp: new Date(Date.now() - 180000),
      avatar: "",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // useEffect(() => {
  //   localStorage.setItem("chatMessages", JSON.stringify(messages));
  // }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      user: "You",
      content: newMessage,
      timestamp: new Date(),
      avatar: "",
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) =>
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(timestamp);

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        width: isOpen ? 320 : 60,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      }}
      className="bg-white border-l border-slate-200 flex flex-col shadow-lg relative"
      style={{ height: dimensions.height }}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-slate-50 to-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <ChatIcon
                    className="text-indigo-600 "
                    style={{ fontSize: "1.25rem" }}
                  />
                  <h2 className="font-semibold text-slate-900">Team Chat</h2>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {messages.length} messages •{" "}
                  {Math.floor(Math.random() * 5) + 2} online
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-slate-200 transition-colors"
              >
                <ExpandMoreIcon className="text-slate-500" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50/30">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                      {message.user.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-slate-900">
                          {message.user}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-slate-100">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <SendIcon style={{ fontSize: "1.125rem" }} />
                </motion.button>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Press Enter to send,
                {/* Shift+Enter for new line */}
                Or click send button
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="closed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full flex flex-col items-center justify-start pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ChatIcon style={{ fontSize: "1.25rem", cursor: "pointer" }} />
            </motion.button>

            {/* Notification badge */}
            {messages.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
              >
                {messages.length > 99 ? "99+" : messages.length}
              </motion.div>
            )}

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              className="mt-4"
            >
              <ExpandLessIcon className="text-slate-400" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
