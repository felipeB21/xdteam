import React from "react";

const LoadingIcon: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    width={width}
    height={height}
  >
    <circle
      cx="50"
      cy="50"
      fill="none"
      stroke="#fff"
      strokeWidth="10"
      r="35"
      strokeDasharray="164.93361431346415 56.97787143782138"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        repeatCount="indefinite"
        dur="1s"
        keyTimes="0;1"
        values="0 50 50;360 50 50"
      ></animateTransform>
    </circle>
  </svg>
);

export default LoadingIcon;
