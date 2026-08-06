import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import {
  Header,
  HeroSection,
  StatsSection,
  PressMarquee,
  PillarsSection,
  DeviceShowcase,
  InvestmentCalculator,
  FeaturesSection,
  InvestmentCTA,
  FAQSection,
  Footer,
} from "../../components/LandingComponents";

export default function LandingPage() {
  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const [isActive, setIsActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Vision", href: "#about" },
    { name: "Devices", href: "#showcase" },
    { name: "Ecosystem", href: "#technology" },
    { name: "Equity", href: "#investment" },
  ];

  return (
    <div className="relative min-h-screen bg-[#030009] text-zinc-100 font-sans antialiased overflow-x-hidden selection:bg-amber-400 selection:text-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=300;400;500;600;700&family=Space+Grotesk:wght=400;500;600;700&display=swap');
        
        .font-display {
          font-family: 'Space Grotesk', sans-serif;
          letter-spacing: -0.03em;
        }
        .font-body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        .perspective-container {
          perspective: 1500px;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          will-change: transform;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .bg-size-200 {
          background-size: 200% 200%;
        }
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        .floating-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle, rgba(245,158,11,0.3), transparent 70%);
        }
      `}</style>

      {/* Ambient backgrounds with parallax */}
      <motion.div
        className="absolute top-0 left-1/4 w-150 h-150 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full blur-[160px] pointer-events-none"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[25%] right-1/4 w-175 h-175 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-full blur-[200px] pointer-events-none"
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 20, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute bottom-[15%] left-1/3 w-125 h-125 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none"
        animate={{
          x: [0, 20, -10, 0],
          y: [0, -10, 20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="floating-particle"
          style={{
            width: Math.random() * 4 + 2 + "px",
            height: Math.random() * 4 + 2 + "px",
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
          }}
          animate={{
            y: [0, -30 - Math.random() * 40, 0],
            x: [0, (Math.random() - 0.5) * 30, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Header */}
      <Header
        isActive={isActive}
        setIsActive={setIsActive}
        scrolled={scrolled}
        navLinks={navLinks}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Press Marquee */}
      <PressMarquee />

      {/* Pillars Section */}
      <PillarsSection />

      {/* Device Showcase */}
      <DeviceShowcase />

      {/* Investment Calculator */}
      <InvestmentCalculator />

      {/* Features Section */}
      <FeaturesSection />

      {/* Investment CTA */}
      <InvestmentCTA />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
