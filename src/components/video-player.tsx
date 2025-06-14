"use client";

import React from 'react';

interface VideoPlayerProps {
  videoSrc: string; // e.g., YouTube embed URL
  title?: string;
}

export function VideoPlayer({ videoSrc, title = "Marketing Video" }: VideoPlayerProps) {
  return (
    <div className="w-full max-w-2xl  rounded-lg overflow-hidden shadow-xl border border-border" data-ai-hint="promotional video">
      <video
        width="100%"
        height="100%"
        src={videoSrc}
        title={title}
        autoPlay
        muted
        controls
        loop
        playsInline
        className="rounded-lg"
      ></video>
    </div>
  );
}
