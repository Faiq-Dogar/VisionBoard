"use client";
import dynamic from "next/dynamic";

// Dynamically import the Whiteboard component with SSR disabled
const Whiteboard = dynamic(() => import("./WhiteBoardRoom"), { ssr: false });

export default function BoardPage() {
  return <Whiteboard />;
}
