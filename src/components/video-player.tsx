"use client";

import React from 'react';

interface VideoPlayerProps {
  videoSrc: string; // e.g., YouTube embed URL
  title?: string;
}

export function VideoPlayer({ videoSrc, title = "Marketing Video" }: VideoPlayerProps) {
  return (
    <div className="w-full max-w-2xl aspect-video rounded-lg overflow-hidden shadow-xl border border-border" data-ai-hint="promotional video">
      <iframe
        width="100%"
        height="100%"
        src={videoSrc}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="rounded-lg"
        loading="lazy"
      ></iframe>
    </div>
  );
}
