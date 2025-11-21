import React from 'react';

interface ImagePlaceholderProps {
  width: number;
  height: number;
  title?: string;
  className?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  width,
  height,
  title = "Project Image",
  className = ""
}) => {
  return (
    <div
      className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 ${className}`}
      style={{ width, height }}
    >
      <div className="text-center p-4">
        <svg
          className="w-12 h-12 mx-auto mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" strokeWidth="2"/>
        </svg>
        <div className="text-xs text-gray-500">{title}</div>
      </div>
    </div>
  );
};

export default ImagePlaceholder;