import React, { useState, useEffect } from 'react';

/**
 * Animated Counter Component
 * Smoothly counts up from 0 to the target value.
 * 
 * @param {number} end - The target number to count to.
 * @param {number} duration - The total duration of the animation in ms (default 2000).
 * @param {string} suffix - An optional string to append to the number (e.g., '+', '%').
 * @param {string} prefix - An optional string to prepend.
 */
const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      // Use easeOutQuart for a fast start and smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - Math.min(progress / duration, 1), 4);
      
      const currentCount = Math.floor(easeOutQuart * end);
      
      setCount(currentCount);

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure it hits the exact end value
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedCounter;
