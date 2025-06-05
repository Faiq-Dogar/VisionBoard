"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "@mui/icons-material";

export default function ChatDrawer() {
  const [dimensions, setDimensions] = useState({ height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        height: window.innerHeight - 150,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const [messages, setMessages] = useState([
    // Example initial message
    {
      id: 1,
      user: "Alice",
      content: "Hey there!",
      timestamp: new Date(),
      avatar: "",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: "You",
        content: newMessage,
        timestamp: new Date(),
        avatar: "",
      },
    ]);
    setNewMessage("");
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
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80 }}
      className="w-80 bg-white border-l border-slate-200 flex flex-col"
      style={{ height: dimensions.height }}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <h2 className="font-semibold text-slate-900">Team Chat</h2>
        <p className="text-sm text-slate-500 mt-1">
          {messages.length} messages
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <img
                src={message.avatar || "/placeholder.svg"}
                alt={message.user}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-slate-900">
                    {message.user}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {message.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm"
          />
          <button
            onClick={handleSendMessage}
            className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
