// src/components/shared/VideoPlayer.jsx
import React, { forwardRef } from "react";

const VideoPlayer = forwardRef(
  ({ src, className = "", ...props }, ref) => {
    return (
      <video
        ref={ref}
        src={src}
        className={className}
        {...props}
      />
    );
  }
);

export default VideoPlayer;
