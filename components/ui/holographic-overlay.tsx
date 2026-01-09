import React from "react";

const HolographicOverlay = React.memo(() => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full opacity-60 animate-pulse-glow"
          style={{
            left: `${20 + i * 10}%`,
            top: `${30 + Math.sin(i) * 20}%`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
});

HolographicOverlay.displayName = "HolographicOverlay";

export default HolographicOverlay;
