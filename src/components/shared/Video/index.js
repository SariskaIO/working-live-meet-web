import React, { useEffect, useRef } from "react";

const Video = (props) => {
  const { track, isPipEnabled, isPresenter } = props;
  const videoElementRef = useRef(null);
  useEffect(() => {
    track?.attach(videoElementRef.current);
  }, [track]);

  if (!track) {
    return null;
  }

  return (
    <video
      playsInline="1"
      autoPlay="1"
      ref={videoElementRef}
      style={{
        left: "-1px",
        top: "-1px",
        position: props.position || "absolute",
        width: isPipEnabled ? 0 : "calc(100% + 2px)",
        display: isPipEnabled ? "none": "initial",
        height: props.height || "calc(100% + 2px)",
        objectFit: "contain",
        borderRadius: "8px",
      //  transform: isPipEnabled ? 'rotateY(180deg)' : isPresenter ? 'initial' : `scaleX(-1)`

         transform: isPresenter ? 'initial' : `scaleX(-1)`,
      }}
    />
  );
};

export default Video;
