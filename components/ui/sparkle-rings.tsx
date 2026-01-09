import React from "react";

const SparkleRings = React.memo(() => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={`ring-${i}`}
          className="absolute border border-emerald-400/20 rounded-full animate-pulse-glow"
          style={{
            left: `${10 + i * 8}%`,
            top: `${15 + ((i * 13) % 70)}%`,
            width: `${40 + (i % 4) * 16}px`,
            height: `${40 + (i % 4) * 16}px`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
});

SparkleRings.displayName = "SparkleRings";

export default SparkleRings;
