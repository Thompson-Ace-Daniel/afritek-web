import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Gem, Coins, Bitcoin, Cpu, Shield, Globe, Zap, Award } from "lucide-react";

export default function CryptoAfrica() {
  const containerRef = useRef(null);

  // Node positions forming an African continent shape
  const nodes = [
    { x: 140, y: 40, icon: Bitcoin, label: "BTC" },
    { x: 180, y: 60, icon: Gem, label: "GEM" },
    { x: 225, y: 105, icon: Coins, label: "COIN" },
    { x: 250, y: 170, icon: Cpu, label: "CPU" },
    { x: 235, y: 240, icon: Gem, label: "GEM" },
    { x: 205, y: 315, icon: Coins, label: "COIN" },
    { x: 175, y: 410, icon: Shield, label: "SHIELD" },
    { x: 120, y: 360, icon: Gem, label: "GEM" },
    { x: 90, y: 280, icon: Coins, label: "COIN" },
    { x: 70, y: 210, icon: Bitcoin, label: "BTC" },
    { x: 60, y: 140, icon: Globe, label: "GLOBE" },
    { x: 90, y: 70, icon: Coins, label: "COIN" },
  ];

  // Floating assets
  const floatingAssets = [
    { icon: Bitcoin, x: "left-2", y: "top-14", delay: 0 },
    { icon: Coins, x: "right-2", y: "top-36", delay: 0.5 },
    { icon: Gem, x: "left-6", y: "bottom-14", delay: 1 },
    { icon: Shield, x: "right-6", y: "bottom-20", delay: 1.5 },
    { icon: Zap, x: "left-12", y: "top-44", delay: 0.8 },
    { icon: Award, x: "right-10", y: "bottom-36", delay: 1.2 },
  ];

  return (
    <div className="relative w-full max-w-[440px] h-[520px] mx-auto flex items-center justify-center select-none overflow-hidden font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600&family=Space+Grotesk:wght@600;700&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* Ambient Glow */}
      <div
        className="absolute w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(245,158,11,0.15), transparent 70%)",
          filter: "blur(80px)",
          transform: "translateZ(0)",
          top: "20%",
          left: "15%",
        }}
      />

      {/* Africa Map SVG Silhouette */}
      <svg
        viewBox="0 0 300 500"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        style={{ transform: "translateZ(0)" }}
      >
        <path
          d="M150,40 C80,50 40,100 30,160 C20,220 10,280 25,340 C40,400 80,440 130,460 C180,480 220,460 250,420 C280,380 290,320 285,260 C280,200 260,140 220,100 C190,70 170,45 150,40Z"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2"
          strokeDasharray="8 6"
          opacity="0.6"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="100"
            dur="20s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M150,40 C80,50 40,100 30,160 C20,220 10,280 25,340 C40,400 80,440 130,460 C180,480 220,460 250,420 C280,380 290,320 285,260 C280,200 260,140 220,100 C190,70 170,45 150,40Z"
          fill="rgba(245,158,11,0.03)"
        />
        {/* Africa inner details */}
        <circle cx="130" cy="180" r="15" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 5" opacity="0.3" />
        <circle cx="180" cy="280" r="20" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 5" opacity="0.3" />
        <circle cx="140" cy="350" r="12" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 5" opacity="0.3" />
        <circle cx="210" cy="180" r="10" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 5" opacity="0.3" />
        <circle cx="100" cy="300" r="14" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 5" opacity="0.3" />
      </svg>

      {/* Network Connection Lines */}
      <svg
        viewBox="0 0 300 500"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ transform: "translateZ(0)" }}
      >
        <defs>
          <linearGradient id="goldLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {nodes.map((node, index) => {
          const next = nodes[(index + 1) % nodes.length];
          return (
            <motion.line
              key={`line-${index}`}
              x1={node.x}
              y1={node.y}
              x2={next.x}
              y2={next.y}
              stroke="url(#goldLineGrad)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{
                duration: 3 + (index % 2),
                repeat: Infinity,
                delay: index * 0.12,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>

      {/* Network Nodes with 3D Bouncing */}
      {nodes.map((node, index) => {
        const Icon = node.icon;
        return (
          <motion.div
            key={`node-${index}`}
            className="absolute z-10"
            style={{
              left: node.x,
              top: node.y,
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3 + (index % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.08,
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-900 via-black to-zinc-950 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-black/80 hover:border-amber-400 transition-all duration-300">
              <Icon className="w-4 h-4 text-amber-400" />
            </div>
          </motion.div>
        );
      })}

      {/* Floating 3D Assets */}
      {floatingAssets.map((asset, index) => {
        const Icon = asset.icon;
        const positionClass = `${asset.x} ${asset.y}`;
        return (
          <motion.div
            key={`asset-${index}`}
            className={`absolute z-20 ${positionClass}`}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              ease: "easeInOut",
              delay: asset.delay,
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[2px] shadow-xl shadow-amber-500/20">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Icon className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Central 3D Metallic Badge */}
      <motion.div
        className="relative z-30"
        animate={{
          y: [0, -6, 0],
          rotateX: [0, 2, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="text-center px-8 py-6 rounded-2xl bg-gradient-to-b from-zinc-900/95 via-black/95 to-zinc-950/95 border border-amber-500/30 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-400/60 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-400/60 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-400/60 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-400/60 rounded-br-xl" />

          {/* Glow ring behind text */}
          <div className="absolute inset-0 rounded-2xl bg-amber-500/5 blur-xl pointer-events-none" />

          <h2 className="text-3xl font-display font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 drop-shadow-lg">
            AFRITEK
          </h2>

          <p className="text-[10px] font-display font-semibold tracking-[0.25em] text-zinc-300 uppercase mt-1">
            TECHNOLOGIES
          </p>

          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto my-2.5" />

          <p className="text-[8px] font-body font-medium tracking-[0.2em] text-zinc-400 uppercase">
            INNOVATE • CONNECT • EMPOWER
          </p>

          {/* Small crypto symbols */}
          <div className="flex justify-center gap-3 mt-3">
            <span className="text-amber-400/60 text-xs">✦</span>
            <span className="text-amber-400/60 text-xs">◆</span>
            <span className="text-amber-400/60 text-xs">✦</span>
          </div>
        </div>
      </motion.div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-amber-400/30 pointer-events-none"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 20, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}  