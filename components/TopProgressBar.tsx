"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function TopProgressBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 450);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
      <AnimatePresence initial={false}>
        {visible && (
          <motion.div
            key={pathname}
            className="h-0.5 w-full bg-gradient-to-r from-emerald-400 via-emerald-600 to-emerald-400"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ transformOrigin: "0% 50%" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
