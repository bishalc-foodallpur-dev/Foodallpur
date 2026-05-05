"use client";

import "@google/model-viewer";

export default function Logo3D() {
  return (
    <model-viewer
      src="/models/logo.glb"
      alt="3D Logo"
      auto-rotate
      rotation-per-second="25deg"
      camera-controls={false}
      disable-zoom
      shadow-intensity="1"
      exposure="1.1"
      environment-image="neutral"
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}