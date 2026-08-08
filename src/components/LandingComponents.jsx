import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import {
  ArrowUpRight,
  Play,
  TrendingUp,
  Gem,
  Crown,
  Shield,
  Lock,
  Zap,
  Smartphone,
  Tablet,
  Laptop,
  Layers,
  Brain,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Calculator,
  Cpu,
  ChevronDown,
  Gift,
  Menu,
  X,
  Award,
  Users,
  Clock,
  Percent,
  Wallet,
  Briefcase,
  Activity,
} from "lucide-react";
import ReactCountUp from "react-countup";
import CryptoAfrica from "./Common";
import afriTech from "../assets/afritek-logo.jpg";
import bgVideo from "../assets/3dvideo.mp4";

const CountUp = ReactCountUp.default || ReactCountUp;

// ==================== DATA ====================
export const corePillars = [
  {
    id: "growth",
    label: "Growth Strategy",
    icon: TrendingUp,
    desc: "Exponential expansion into high-yield emerging digital markets across the African continent.",
  },
  {
    id: "wealth",
    label: "Wealth Generation",
    icon: Gem,
    desc: "Secure early-stage private equity and capture direct yields from global decentralized technology demand.",
  },
  {
    id: "prestige",
    label: "Tech Prestige",
    icon: Crown,
    desc: "Command authority with a physical device that serves as a status symbol and nodes key.",
  },
  {
    id: "safety",
    label: "Hardware Safety",
    icon: Shield,
    desc: "Enterprise-grade encryption protocols running natively on an insulated, custom-built Secure OS.",
  },
  {
    id: "security",
    label: "Self-Sovereign Security",
    icon: Lock,
    desc: "Decentralized cryptographic storage keeping your digital identity entirely under your own keys.",
  },
];

export const features = [
  {
    title: "Layer-1 Blockchain Core",
    desc: "Secures and manages your private keys natively, completely isolated from standard application memory.",
    icon: Layers,
  },
  {
    title: "Sleek Native Gateway",
    desc: "Access the decentralized ecosystem fluidly via custom-engineered iOS and Android sandboxed apps.",
    icon: Smartphone,
  },
  {
    title: "Web3 Protocol Stack",
    desc: "A custom-built hardware environment tailored for multi-chain asset management and lightning-fast dApps.",
    icon: Zap,
  },
  {
    title: "Neural AI Assistant",
    desc: "Locally-run machine learning models that personalize your digital workflow without uploading data to the cloud.",
    icon: Brain,
  },
];

export const devices = {
  Phones: {
    name: "AfriTek Phone Prime",
    specs: [
      "108MP Cinematic Triple Lens",
      '6.8" AMOLED 120Hz Infinite Screen',
      "Hardware Cryptographic Key Vault",
      "Double-Enclave Secure OS Core",
    ],
    imageText: "SECURE NODE 01",
    icon: Smartphone,
  },
  Tablets: {
    name: "AfriTek Tab Horizon",
    specs: [
      '11" Liquid Retina TrueTone Display',
      "Quad-Array Spatial Audio Chamber",
      "Isolated Offline Sandbox Mode",
      "Machined Aerospace Aluminum Body",
    ],
    imageText: "HORIZON PRO",
    icon: Tablet,
  },
  Laptop: {
    name: "AfriTek Book Titanium",
    specs: [
      "Ultralight Titanium Shell",
      "Next-Gen Computational Engine",
      "Dedicated Web3 Physical Keypad",
      "Biometric Touch ID Encryption Lock",
    ],
    imageText: "TITAN BOOK",
    icon: Laptop,
  },
  IPad: {
    name: "AfriTek Slate Pro",
    specs: [
      "Precision Multi-Touch Surface",
      "Dual Boot Architecture (OS/SecureOS)",
      "Seamless Hot-Wallet Syncing",
      "Multi-Day High-Density Power Cell",
    ],
    imageText: "SLATE CORE",
    icon: Tablet,
  },
};

export const faqs = [
  {
    question: "How does the custom hardware block security breaches?",
    answer:
      "AfriTek devices contain an isolated physical chip known as the Secure Enclave. This chip runs completely parallel to the main operating system, processing biometric validation, private keys, and encrypted conversations entirely locally.",
  },
  {
    question: "What legal rights do I receive as an equity shareholder?",
    answer:
      "When you participate in our fractional seed rounds, you receive officially registered, tokenized corporate equity shares. This entitles you to dividend distributions, voting rights on critical ecosystem updates, and capital appreciation.",
  },
  {
    question: "What is the capital requirement to start investing?",
    answer:
      "To ensure absolute accessibility, our seed round starts at just $100 (approximately ₦100,000). Your allocation is immediately locked and verified via certified financial custodians.",
  },
];

export const partners = [
  "TechCabal",
  "Disrupt Africa",
  "Techpoint",
  "Ventures Africa",
  "Nairametrics",
  "Stears Business",
];
export const doublePartners = [...partners, ...partners];

// ==================== ANIMATED COUNTER ====================
export const AnimatedCounter = ({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
}) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <span ref={ref}>
      {inView && (
        <CountUp
          start={0}
          end={value}
          duration={duration}
          suffix={suffix}
          prefix={prefix}
          separator=","
        />
      )}
    </span>
  );
};

// ==================== HEADER ====================
export const Header = ({ isActive, setIsActive, scrolled, navLinks }) => {
  return (
    <motion.header
      className={`fixed w-full top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/6 transition-all duration-500 ${
        scrolled ? "shadow-2xl shadow-black/50" : ""
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 lg:px-16 py-5 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className=" text-black rounded-lg border-3 w-fit h-fit border-amber-400">
            <img src={afriTech} alt="" className="w-12 h-10 rounded-md" />
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
              AfriTek
            </span>
          </div>
        </motion.div>

        {/* Hamburger Button */}
        <motion.button
          onClick={() => setIsActive(!isActive)}
          className="md:hidden fixed top-5 right-5 z-100 flex items-center justify-center w-11 h-11 rounded-full bg-zinc-900 hover:bg-amber-400 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {isActive ? (
              <motion.div
                key="close"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 180, scale: 0 }}
                transition={{ duration: 0.25 }}
              >
                <X className="text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: -180, scale: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Menu className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isActive && (
            <>
              <motion.div
                onClick={() => setIsActive(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-80"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="fixed top-0 right-0 w-72 h-screen bg-zinc-950 border-l border-zinc-800 z-90 flex flex-col pt-28 px-8 gap-4"
              >
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsActive(false)}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-4 text-lg font-medium text-white hover:bg-amber-400 hover:text-black transition-all duration-300"
                  >
                    {link.name}
                    <motion.span whileHover={{ x: 5 }} className="text-xl">
                      →
                    </motion.span>
                  </motion.a>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-semibold text-zinc-400">
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.name}
            </motion.a>
          ))}
        </nav>

        {/* Acquire Shares Button - Fixed nested <a> issue */}
        <motion.div
          className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-white font-bold px-6 py-3 rounded-xl border border-amber-500/20 shadow-lg shadow-amber-500/5 transition-all text-xs tracking-wider uppercase cursor-pointer"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/login" className="flex gap-3">
            Acquire Shares <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
};

// ==================== HERO SECTION ====================
export const HeroSection = () => {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden py-24">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#030009]/30 via-[#030009]/80 to-[#030009]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#030009_95%)]" />
      </div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <motion.div
          className="lg:col-span-7 space-y-8 text-center lg:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="inline-flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full backdrop-blur-md"
            animate={{
              boxShadow: [
                "0 0 0px rgba(245,158,11,0)",
                "0 0 20px rgba(245,158,11,0.1)",
                "0 0 0px rgba(245,158,11,0)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-amber-400"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-amber-300 font-display">
              Seed Stage Allocation Active
            </span>
          </motion.div>
          <motion.h1
            className="font-display text-4xl sm:text-6xl lg:text-[76px] font-bold leading-[1.05] tracking-tight text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Sovereign hardware. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">
              Built for Web3.
            </span>
          </motion.h1>
          <motion.p
            className="font-body text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We are engineering Africa's premier blockchain-native physical
            ecosystem. Build capital, preserve decentralized keys, and claim
            global corporate shares from our early seed round.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {/* Commit Capital - Fixed nested <a> issue */}
            <motion.div
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl shadow-xl shadow-amber-500/10 transition-all text-sm tracking-wider uppercase text-center flex items-center justify-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/login" className="flex gap-3">
                Acquire Shares <ArrowUpRight className="w-4 h-4 stroke-[3px]" />
              </Link>
            </motion.div>
            <motion.a
              href="#showcase"
              className="px-8 py-4 bg-zinc-900/40 hover:bg-zinc-900/80 text-white font-bold rounded-xl border border-white/8 transition-all text-sm tracking-wider uppercase text-center flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-4 h-4 fill-white text-white" /> View System
              Hardware
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-5 flex justify-center"
          initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.6, type: "spring" }}
        >
          <CryptoAfrica />
        </motion.div>
      </div>
    </section>
  );
};

// ==================== STATS SECTION ====================
export const StatsSection = () => {
  return (
    <section className="relative overflow-hidden py-16 border-y border-white/6 bg-slate-950/30">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-3xl sm:text-4xl font-display font-bold text-amber-400">
              <AnimatedCounter value={5000} suffix="+" duration={2.5} />
            </div>
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-body mt-1">
              Active Nodes
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="text-3xl sm:text-4xl font-display font-bold text-amber-400">
              <AnimatedCounter value={124} suffix="+" duration={2.5} />
            </div>
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-body mt-1">
              Countries
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-3xl sm:text-4xl font-display font-bold text-amber-400">
              <AnimatedCounter value={250} suffix="M+" duration={2.5} />
            </div>
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-body mt-1">
              Network Value
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <div className="text-3xl sm:text-4xl font-display font-bold text-amber-400">
              <AnimatedCounter value={99.9} suffix="%" duration={2.5} />
            </div>
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-body mt-1">
              Uptime
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ==================== PRESS MARQUEE ====================
export const PressMarquee = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950/40 border-y border-white/6 py-10">
      <div className="text-center mb-6">
        <motion.span
          className="text-[10px] uppercase font-bold tracking-[0.3em] text-zinc-500 font-display inline-block"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Global Press Distribution Coverage
        </motion.span>
      </div>

      <div className="w-full relative overflow-hidden flex items-center">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030009] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030009] to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-24 whitespace-nowrap w-max"
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          {doublePartners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center gap-4 text-zinc-400 font-display font-semibold tracking-[0.15em] text-sm uppercase"
            >
              <div className="w-2 h-2 rounded-full bg-amber-500/40" />
              <span>{partner}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ==================== PILLARS SECTION ====================
export const PillarsSection = () => {
  const [activePillar, setActivePillar] = useState("growth");

  return (
    <section id="about" className="py-32 container mx-auto px-6 lg:px-16">
      <motion.div
        className="text-center max-w-3xl mx-auto mb-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-xs uppercase font-bold text-amber-500 tracking-[0.3em] font-display">
          ARCHITECTURAL BACKBONE
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mt-3">
          Sovereignty Built on Steel & Silicon
        </h2>
        <p className="font-body text-zinc-400 text-base sm:text-lg mt-4 font-light leading-relaxed">
          We assemble concrete digital defenses and hardware modules ensuring
          absolute liquidity alignment and institutional capital growth.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-5 flex flex-col gap-3">
          {corePillars.map((pillar) => (
            <motion.button
              key={pillar.id}
              onClick={() => setActivePillar(pillar.id)}
              className={`flex items-center gap-5 p-5 rounded-2xl text-left border transition-all ${
                activePillar === pillar.id
                  ? "bg-amber-500/[0.08] border-amber-500/30 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                  : "bg-zinc-900/10 border-white/[0.04] text-zinc-400 hover:bg-zinc-900/30"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`p-2.5 rounded-xl border transition-colors ${
                  activePillar === pillar.id
                    ? "bg-amber-500 text-black border-amber-400"
                    : "bg-zinc-950 text-zinc-500 border-white/[0.05]"
                }`}
              >
                <pillar.icon className="w-5 h-5" />
              </div>
              <span className="font-display font-medium text-sm tracking-wide">
                {pillar.label}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="lg:col-span-7 bg-zinc-900/10 border border-white/[0.04] rounded-[32px] p-8 lg:p-12 min-h-[340px] flex items-center relative overflow-hidden backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)]">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/[0.02] rounded-full blur-3xl pointer-events-none" />
          <AnimatePresence mode="wait">
            {corePillars.map(
              (pillar) =>
                pillar.id === activePillar && (
                  <motion.div
                    key={pillar.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6"
                  >
                    <motion.div
                      className="inline-flex p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                    >
                      <pillar.icon className="w-8 h-8" />
                    </motion.div>
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
                      {pillar.label}
                    </h3>
                    <p className="font-body text-zinc-400 text-sm sm:text-base leading-relaxed font-light max-w-xl">
                      {pillar.desc}
                    </p>
                  </motion.div>
                ),
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// ==================== DEVICE SHOWCASE ====================
export const DeviceShowcase = () => {
  const [activeTab, setActiveTab] = useState("Phones");
  const deviceKeys = Object.keys(devices);
  const currentDevice = devices[activeTab];
  const DeviceIcon = currentDevice.icon;

  return (
    <section
      id="showcase"
      className="py-32 border-t border-white/[0.06] bg-gradient-to-b from-transparent to-slate-950/40 relative"
    >
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs uppercase font-bold text-amber-500 tracking-[0.3em] font-display">
                PREMIUM HARDWARE
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-white">
                The Fleet of Sovereignty
              </h2>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-2 p-1.5 bg-zinc-950/60 border border-white/[0.05] rounded-2xl max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {deviceKeys.map((key) => {
                const Icon = devices[key].icon;
                return (
                  <motion.button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                      activeTab === key
                        ? "bg-white/[0.06] text-amber-400 shadow-sm border border-white/[0.05]"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {key}
                  </motion.button>
                );
              })}
            </motion.div>

            <motion.div
              className="space-y-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-display font-bold text-2xl text-white">
                {currentDevice.name}
              </h3>
              <ul className="space-y-3">
                {currentDevice.specs.map((spec, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center gap-3 text-sm text-zinc-400 font-body font-light"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    {spec}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            className="lg:col-span-7 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <div className="relative w-full max-w-md aspect-[4/5] bg-gradient-to-b from-zinc-900/40 to-zinc-950/40 rounded-[40px] border border-white/[0.08] p-6 shadow-2xl flex flex-col justify-between overflow-hidden backdrop-blur-xl group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/[0.03] rounded-full blur-3xl group-hover:bg-amber-500/[0.05] transition-colors duration-500" />

              <div className="flex justify-between items-center border-b border-white/[0.04] pb-4 z-10">
                <div className="flex items-center gap-2">
                  <DeviceIcon className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-display">
                    {currentDevice.imageText}
                  </span>
                </div>
                <span className="text-[9px] uppercase tracking-widest text-zinc-600 bg-white/[0.02] px-2 py-0.5 rounded-full border border-white/[0.04]">
                  SECURE OS READY
                </span>
              </div>

              <div className="my-auto flex flex-col items-center justify-center p-8 relative">
                <motion.div
                  key={activeTab}
                  initial={{ scale: 0.9, opacity: 0, rotateY: -15 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-48 h-64 bg-gradient-to-tr from-zinc-950 to-zinc-900 border border-white/[0.08] rounded-2xl flex flex-col items-center justify-center gap-4 relative shadow-2xl shadow-black preserve-3d"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.01] to-amber-500/[0.03] rounded-2xl pointer-events-none" />
                  <DeviceIcon className="w-12 h-12 text-amber-500/80 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse" />
                  <div className="w-24 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </motion.div>
              </div>

              <div className="border-t border-white/[0.04] pt-4 flex justify-between items-center text-[10px] font-display text-zinc-500 uppercase tracking-widest z-10">
                <span>SYSTEM DISKS: ENCRYPTED</span>
                <motion.span
                  className="text-emerald-500 font-semibold flex items-center gap-1"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  ONLINE
                </motion.span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ==================== FEATURES SECTION ====================
export const FeaturesSection = () => {
  return (
    <section
      id="technology"
      className="py-32 bg-slate-950/20 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-10 h-100 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-16">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs uppercase font-bold text-amber-500 tracking-[0.3em] font-display">
            ECOSYSTEM MECHANICS
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mt-3">
            Uncompromising Integration
          </h2>
          <p className="font-body text-zinc-400 text-base sm:text-lg mt-4 font-light leading-relaxed">
            Every physical engineering layout works dynamically across nodes.
            Hover over any system block below to unveil its operational
            mechanics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-zinc-900/10 border border-white/4 rounded-4xl p-8 h-135 relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)] backdrop-blur-md">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-size:16px_16px pointer-events-none" />
            <AfricaNodeMap />
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feat, i) => (
              <FeatureCard
                key={i}
                title={feat.title}
                desc={feat.desc}
                icon={feat.icon}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ==================== INVESTMENT CALCULATOR ====================
export const InvestmentCalculator = () => {
  const [investment, setInvestment] = useState(1000000);
  const sharePrice = 100;
  const units = Math.floor(investment / sharePrice);
  const estimatedYield = (units * 20).toFixed(2);

  return (
    <section
      id="investment"
      className="py-32 border-t border-white/[0.06] relative"
    >
      <div className="container mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <motion.div
          className="lg:col-span-5 space-y-8"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-amber-500 tracking-[0.3em] font-display">
              EQUITY CAPITAL PORTAL
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white">
              Secure Your Fractional Allocation
            </h2>
          </div>
          <p className="font-body text-zinc-400 text-base font-light leading-relaxed">
            Participate instantly in our tokenized seed framework. Your capital
            injection maps directly to asset deployment pipelines overseen by
            accredited tier-1 financial custody partners.
          </p>

          <div className="space-y-3 bg-zinc-900/10 border border-white/[0.04] p-6 rounded-2xl backdrop-blur-md">
            <div className="flex justify-between text-xs tracking-wider uppercase font-display font-semibold">
              <span className="text-zinc-400">Seed Round Pool</span>
              <span className="text-amber-400">74.2% Allocated</span>
            </div>
            <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-white/[0.05]">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
                initial={{ width: "0%" }}
                whileInView={{ width: "74.2%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 font-medium">
              <span>Hardcap: $2.5M USD</span>
              <span>Remaining: $645,000</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-b from-zinc-900/40 to-zinc-950/60 border border-white/[0.08] rounded-[32px] p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            <div className="flex items-center gap-3 border-b border-white/[0.05] pb-6 mb-8">
              <div className="bg-amber-500/10 text-amber-400 p-2.5 rounded-xl border border-amber-500/20">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-white">
                  Allocation Pricing Matrix
                </h4>
                <p className="text-[11px] text-zinc-500 font-body">
                  Real-time valuation parameters linked to Seed phase units.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs tracking-wider uppercase font-display font-semibold">
                  <span className="text-zinc-400">Commitment Volume</span>
                  <motion.span
                    className="text-amber-400 text-sm font-bold"
                    key={investment}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    ${investment.toLocaleString()} USD
                  </motion.span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="50000"
                  step="100"
                  value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-zinc-950 rounded-lg cursor-pointer border border-white/[0.05]"
                />
                <div className="flex justify-between text-[9px] uppercase tracking-widest text-zinc-600 font-semibold font-display">
                  <span>Min: $100</span>
                  <span>Max: $50,000</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <motion.div
                  className="bg-zinc-950/60 border border-white/[0.04] p-5 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]"
                  whileHover={{
                    scale: 1.02,
                    borderColor: "rgba(245,158,11,0.2)",
                  }}
                >
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-display font-medium block mb-1">
                    Tokenized Corporate Shares
                  </span>
                  <div className="text-xl font-display font-bold text-white flex items-baseline gap-1.5">
                    <span>{units}</span>
                    <span className="text-xs font-normal text-zinc-500">
                      Equity Units
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-zinc-950/60 border border-white/[0.04] p-5 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]"
                  whileHover={{
                    scale: 1.02,
                    borderColor: "rgba(245,158,11,0.2)",
                  }}
                >
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-display font-medium block mb-1">
                    Projected Annual Node Yield
                  </span>
                  <div className="text-xl font-display font-bold text-amber-400 flex items-baseline gap-1.5">
                    <span>${estimatedYield}</span>
                    <span className="text-xs font-normal text-zinc-500">
                      USD / Yr
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Lock Asset Allocation - Fixed nested <a> issue */}
              <motion.button
                className="w-full py-4 mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold font-display text-xs tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 40px rgba(245,158,11,0.3)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to="/login" className="flex gap-3">
                  <Gift className="w-4 h-4" /> Lock Asset Allocation
                </Link>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ==================== INVESTMENT CTA ====================
export const InvestmentCTA = () => {
  return (
    <motion.section
      className="border-t border-white/6 py-20 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent" />
      <div className="container mx-auto px-6 lg:px-16 relative">
        <div className="max-w-4xl">
          <motion.h1
            className="text-gray-400 font-semibold text-2xl md:text-3xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Invest In The Future
          </motion.h1>
          <motion.h1
            className="max-w-3xl font-black mb-10 mt-5 text-2xl md:text-3xl text-white"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            AfriTekbile Equity Crowd Funding Campaign
          </motion.h1>
          <motion.p
            className="md:text-xl text-md text-gray-400 w-full flex"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Be part of a revolution! The AfriTekbile Blockchain Smartphone is
            redefining the mobile industry with cutting-edge blockchain
            security, AI-driven features, and a vision for digital
            transformation across Africa. Our crowdfunding model allows anyone
            to invest with a small amount and gain a stake in Africa's leading
            smartphone innovation.
          </motion.p>
          {/* Invest Now - Fixed nested <a> issue */}
          <Link
            to="/login"
            className="inline-flex items-center gap-3 inset-0 cursor-pointer active:scale-[0.9] bg-gradient-to-br from-amber-300 px-5 rounded-md text-black font-display text-xl font-medium py-3 mt-5 to-amber-500 hover:shadow-lg hover:shadow-amber-500/30 transition-all"
          >
            Invest Now
            <ArrowUpRight />
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

// ==================== FAQ SECTION ====================
export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-32 border-t border-white/[0.06] relative">
      <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs uppercase font-bold text-amber-500 tracking-[0.3em] font-display">
            INFORMATION HUB
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mt-3">
            System FAQs & Protocols
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                className="bg-zinc-900/10 border border-white/[0.04] rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ borderColor: "rgba(245,158,11,0.15)" }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 text-left flex justify-between items-center gap-6"
                >
                  <span className="font-display font-bold text-base sm:text-lg text-white">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown
                      className={`w-5 h-5 ${isOpen ? "text-amber-500" : "text-zinc-400"}`}
                    />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-white/[0.02] text-sm sm:text-base text-zinc-400 font-body font-light leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ==================== FOOTER ====================
export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/6 py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-30" />
      <div className="container mx-auto px-6 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <div className=" text-black rounded-lg border-3 w-fit h-fit border-amber-400">
              <img src={afriTech} alt="" className="w-12 h-10 rounded-md" />
            </div>
            <span className="font-display font-bold text-xl tracking-wider text-white">
              AfriTek
            </span>
          </div>
          <p className="font-body text-xs text-zinc-500 leading-relaxed font-light">
            Engineering structural digital sovereignty across key ecosystems.
            Designing secure hardware architecture natively for Africa.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h4 className="font-display font-bold text-xs text-zinc-300 uppercase tracking-[0.2em] mb-5">
            Ecosystem
          </h4>
          <ul className="space-y-3 font-body text-xs text-zinc-500">
            <li>
              <a
                href="#showcase"
                className="hover:text-white transition-colors"
              >
                AfriTek Phone Prime
              </a>
            </li>
            <li>
              <a
                href="#showcase"
                className="hover:text-white transition-colors"
              >
                AfriTek Titanium Laptop
              </a>
            </li>
            <li>
              <a
                href="#showcase"
                className="hover:text-white transition-colors"
              >
                AfriTek Tab Horizon
              </a>
            </li>
            <li>
              <a
                href="#technology"
                className="hover:text-white transition-colors"
              >
                Blockchain Native Storage
              </a>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h4 className="font-display font-bold text-xs text-zinc-300 uppercase tracking-[0.2em] mb-5">
            Support
          </h4>
          <ul className="space-y-3 font-body text-xs text-zinc-500">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Engineering Documentation
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Corporate Escrow Terms
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                FAQ Registry
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Privacy Principles
              </a>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h4 className="font-display font-bold text-xs text-zinc-300 uppercase tracking-[0.2em] mb-5">
            Contact
          </h4>
          <ul className="space-y-3.5 font-body text-xs text-zinc-500">
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-500" /> core@AfriTektech.com
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-500" /> +234 (0) 800-AfriTek
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-amber-500" /> Tech Enclave, Lagos,
              Nigeria
            </li>
          </ul>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 lg:px-16 mt-20 pt-8 border-t border-white/6 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600 font-body">
        <p>
          © {new Date().getFullYear()} AfriTekbile Technologies Ltd. System
          execution confirmed.
        </p>
        <div className="flex gap-6 font-semibold uppercase tracking-wider text-[10px] font-display">
          <a href="#" className="hover:text-white transition-colors">
            Third-Party Audit Protocol
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Escrow Guarantee
          </a>
        </div>
      </div>
    </footer>
  );
};

// ==================== AFRICA NODE MAP ====================
export const AfricaNodeMap = () => {
  const nodes = [
    { id: "lagos", x: 120, y: 240, label: "Lagos Hub" },
    { id: "cairo", x: 230, y: 80, label: "Cairo Node" },
    { id: "casablanca", x: 100, y: 80, label: "Casablanca" },
    { id: "nairobi", x: 250, y: 260, label: "Nairobi Hub" },
    { id: "joburg", x: 185, y: 410, label: "Joburg Node" },
    { id: "dakar", x: 40, y: 180, label: "Dakar Node" },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-between relative py-6">
      <motion.div
        className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent pointer-events-none z-10"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />

      <div className="text-center z-10 space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-500/80 font-display">
          Sovereign Ledger
        </span>
        <h3 className="font-display font-bold text-lg text-white">
          Consolidated Africa Node
        </h3>
      </div>

      <div className="w-full max-w-70 aspect-4/5 relative my-auto">
        <svg
          viewBox="0 0 320 450"
          className="w-full h-full drop-shadow-[0_0_20px_rgba(245,158,11,0.15)]"
        >
          <defs>
            <linearGradient id="africaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <motion.polygon
            points="100,80 230,80 240,100 285,210 250,290 185,410 145,330 120,240 40,180 80,100"
            className="stroke-amber-500/30 stroke-2 fill-url(#africaGrad)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />

          <g>
            {[
              { x1: 100, y1: 80, x2: 120, y2: 240 },
              { x1: 230, y1: 80, x2: 120, y2: 240 },
              { x1: 250, y1: 260, x2: 120, y2: 240 },
              { x1: 185, y1: 410, x2: 120, y2: 240 },
              { x1: 40, y1: 180, x2: 120, y2: 240 },
              { x1: 285, y1: 210, x2: 250, y2: 260 },
              { x1: 250, y1: 260, x2: 185, y2: 410 },
            ].map((line, i) => (
              <motion.line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                className="stroke-amber-500/10 stroke-[1px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              />
            ))}
          </g>

          {nodes.map((node) => (
            <g key={node.id}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={12}
                className="fill-transparent stroke-amber-500/30"
                animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{
                  duration: 2.5 + Math.random() * 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={4.5}
                className="fill-amber-400 stroke-black stroke-[1.5px]"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </g>
          ))}
        </svg>
      </div>

      <div className="w-full flex justify-between items-center px-4 border-t border-white/[0.04] pt-4 text-[10px] text-zinc-500 font-display uppercase tracking-widest z-10">
        <span>Nodes online: 4,090</span>
        <motion.span
          className="text-amber-500 font-bold flex items-center gap-1"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
          Network Synced
        </motion.span>
      </div>
    </div>
  );
};

// ==================== FEATURE CARD ====================
export const FeatureCard = ({ title, desc, icon: Icon, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="w-full h-[260px] perspective-container cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isHovered ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="absolute inset-0 bg-zinc-900/10 border border-white/[0.04] p-8 rounded-[24px] flex flex-col justify-between backface-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)] backdrop-blur-md">
          <div className="w-12 h-12 rounded-2xl bg-black border border-white/[0.05] flex items-center justify-center text-amber-500">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-amber-500/60 uppercase tracking-widest font-display font-semibold block mb-2">
              MODULE ID_{String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display font-bold text-xl text-white leading-snug">
              {title}
            </h3>
          </div>
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-black border border-amber-500/30 p-8 rounded-[24px] flex flex-col justify-center backface-hidden shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/[0.05] pb-3">
              <Icon className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] uppercase tracking-widest font-display font-bold text-zinc-400">
                Specs Registry
              </span>
            </div>
            <p className="font-body text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
              {desc}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
