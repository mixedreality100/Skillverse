'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import * as React from 'react';

export function GradualSpacing({ text = 'Gradual Spacing' }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="flex space-x-1 justify-center">
      {/* Add Paytone One font import */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Paytone+One&display=swap');
        `}
      </style>

      <AnimatePresence>
        {text.split('').map((char, i) => (
          <motion.p
            ref={ref}
            key={i}
            initial={{ opacity: 0, x: -18 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            exit="hidden"
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="inline-block font-paytone" // Apply Paytone One font
            style={{ fontFamily: "'Paytone One', sans-serif" }} // Ensure font is applied
          >
            {char === ' ' ? <span>&nbsp;</span> : char}
          </motion.p>
        ))}
      </AnimatePresence>
    </div>
  );
}