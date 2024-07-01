"use client";
import React, { useState } from 'react';

const InteractiveComponent = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`w-48 h-48 flex justify-center items-center cursor-pointer transition-colors duration-300 ${
        isHovered ? 'bg-blue-300' : 'bg-gray-300'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? 'Hovered!' : 'Hover over me!'}
    </div>
  );
};

export { InteractiveComponent };
