import React from "react";

const ParticleEffects = React.memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 24 }, (_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-particle opacity-70"
          style={{
            left: `${(i * 8) % 100}%`,
            top: `${(i * 15) % 100}%`,
            animationDelay: `${i * 0.5}s`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            backgroundColor:
              i % 3 === 0
                ? "rgb(34, 197, 94)"
                : i % 3 === 1
                ? "rgb(56, 189, 248)"
                : "rgb(251, 191, 36)",
          }}
        />
      ))}
    </div>
  );
});

ParticleEffects.displayName = "ParticleEffects";

export default ParticleEffects;
