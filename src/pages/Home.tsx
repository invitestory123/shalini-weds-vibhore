import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import Lenis from "lenis";

import IntroGate from "../sections/IntroGate";
import Hero from "../sections/Hero";
import InviteMessage from "../sections/InviteMessage";
import Couple from "../sections/Couple";
import Events from "../sections/Events";
import Venue from "../sections/Venue";
import Footer from "../sections/Footer";
import Petals from "../components/Petals";
import ScrollProgress from "../components/ScrollProgress";
import { wedding } from "../config";

type Stage = "closed" | "opening" | "open";

export default function Home() {
  const [stage, setStage] = useState<Stage>("closed");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.65;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  // Buttery smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    let id = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  // Lock scroll until the doors have fully opened
  useEffect(() => {
    document.body.style.overflow = stage === "open" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [stage]);

  return (
    <main className="relative min-h-svh bg-[#0c0a24]">
      {/* Background BGM Audio */}
      <audio
        ref={audioRef}
        src="./assets/bgm.mp3"
        loop
        preload="auto"
      />

      {/* Floating Audio Toggle Button */}
      {stage === "open" && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          onClick={toggleMusic}
          aria-label={isPlaying ? "Mute music" : "Play music"}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[#e2c88f]/40 bg-[#0c0a24]/85 text-[#f6e2ae] shadow-[0_6px_24px_rgba(0,0,0,0.6)] backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
        >
          {isPlaying ? (
            <Volume2 size={20} className="text-[#e2c88f] animate-pulse" />
          ) : (
            <VolumeX size={20} className="text-[#f5eee2]/50" />
          )}
        </motion.button>
      )}

      <ScrollProgress />
      {/* content gently settles into place as the doors part */}
      <motion.div
        initial={{ scale: 1.07 }}
        animate={{ scale: stage === "closed" ? 1.07 : 1 }}
        transition={{ duration: 1.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <Hero />
        <InviteMessage />
        <Couple />
        {wedding.sections?.events !== false && <Events />}
        {wedding.sections?.venue !== false && <Venue />}
        <Footer />
      </motion.div>

      {stage === "open" && <Petals count={14} />}

      <AnimatePresence>
        {stage !== "open" && (
          <IntroGate
            onOpening={() => {
              setStage("opening");
              startMusic();
            }}
            onOpened={() => setStage("open")}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
