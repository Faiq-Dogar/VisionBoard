"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuid } from "uuid";
import {
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Button,
  Input,
} from "@mui/material";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Mail,
  Palette,
  VerifiedUser,
  X,
} from "@mui/icons-material";

export default function HomePage() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const id = uuid();
    console.log("Username:", username);
    console.log("Email:", email);
    router.push(`/board/${id}`);
  };

  return (
    <div className="relative h-screen w-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#f4f7ff] overflow-hidden flex flex-col items-center justify-center text-center px-4">
      {/* Background glowing shapes */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      {/* Foreground content */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        // className="text-7xl md:text-8xl font-black bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-4 leading-tight"
        className="text-6xl font-extrabold text-gray-900 drop-shadow-md"
      >
        VisionBoard
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mt-3 text-xl text-gray-700 max-w-md"
      >
        Create, collaborate, and connect — all on a real-time whiteboard.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        onClick={handleDialogOpen}
        className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-lg rounded-full shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
      >
        Start Whiteboard
      </motion.button>

      {/* Dialog with Framer animation */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop with blur effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={handleDialogClose}
            />

            {/* Dialog container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
                {/* Gradient header background */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 opacity-10" />

                {/* Header */}
                <div className="relative px-6 pt-6 pb-2">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="gap-3 mb-2"
                  >
                    {/* <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <VerifiedUser className="w-5 h-5 text-white" />
                    </div> */}
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Join the Board
                      </h2>
                      <p className="text-sm text-slate-600">
                        Enter your details to start collaborating
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Username field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <VerifiedUser className="w-4 h-4" />
                        Username
                      </label>
                      <div className="relative">
                        <Input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter your username"
                          className="pl-4 pr-4 py-3 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all duration-200"
                        />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: username ? 1 : 0 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Email field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </label>
                      <div className="relative">
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="pl-4 pr-4 py-3 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl transition-all duration-200"
                        />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{
                            scale: email && email.includes("@") ? 1 : 0,
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Features preview */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-slate-50 rounded-xl p-4 mt-6"
                    >
                      <p className="text-xs font-medium text-slate-600 mb-3">
                        What you'll get:
                      </p>
                      <div className="space-y-2">
                        {[
                          // { icon: Palette, text: "Advanced drawing tools" },
                          // { icon: MessageSquare, text: "Real-time chat" },
                          // { icon: Share2, text: "Instant collaboration" },
                          { text: "Advanced drawing tools" },
                          { text: "Real-time chat" },
                          { text: "Instant collaboration" },
                        ].map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="flex items-center gap-2"
                          >
                            {/* <feature.icon className="w-3 h-3 text-indigo-500" /> */}
                            <span className="text-xs text-slate-600">
                              {feature.text}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-3 "
                  >
                    <Button
                      variant="outlined"
                      onClick={handleDialogClose}
                      className="flex-1 py-3 rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!username || !email}
                      className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 !text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed "
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Join Board
                      </motion.div>
                    </Button>
                  </motion.div>
                </div>

                {/* Close button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDialogClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 text-black cursor-pointer"
                >
                  X
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
