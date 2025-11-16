// src/components/shared/VideoPlayer.jsx
import React, { forwardRef } from "react";

const VideoPlayer = forwardRef(
  ({ src, className = "", ...props }, ref) => {
    return (
      <video
        ref={ref}
        src={src}
        className={className}
        autoPlay={props.autoPlay}
        // muted={props.muted}
        loop={props.loop}
        playsInline
        controls={props.controls}
        {...props}
      />
    );
  }
);

export default VideoPlayer;
