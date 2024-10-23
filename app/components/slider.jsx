import React, { useState, useEffect, useRef } from "react";

const PriceRangeSlider = ({ min, max, value, onChange, className }) => {
  const [minValue, setMinValue] = useState(value[0]);
  const [maxValue, setMaxValue] = useState(value[1]);
  const minThumbRef = useRef(null);
  const maxThumbRef = useRef(null);
  const rangeRef = useRef(null);

  useEffect(() => {
    setMinValue(value[0]);
    setMaxValue(value[1]);
  }, [value]);

  const getPercent = (value) => {
    return Math.round(((value - min) / (max - min)) * 100);
  };

  useEffect(() => {
    if (maxThumbRef.current) {
      const minPercent = getPercent(minValue);
      const maxPercent = getPercent(maxValue);

      if (rangeRef.current) {
        rangeRef.current.style.left = `${minPercent}%`;
        rangeRef.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minValue, maxValue]);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - 1);
    setMinValue(value);
    onChange([value, maxValue]);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minValue + 1);
    setMaxValue(value);
    onChange([minValue, value]);
  };

  const formatPrice = (price) => {
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className={`flex flex-col space-y-6 w-full ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-white text-lg font-semibold">
          {formatPrice(minValue)}
        </span>
        <span className="text-white text-lg font-semibold">
          {formatPrice(maxValue)}
        </span>
      </div>

      <div className="relative w-full h-2">
        <div className="absolute w-full h-2 bg-gray-700 rounded-full" />
        <div
          ref={rangeRef}
          className="absolute h-2 bg-green-600 rounded-full"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={minValue}
          step={10000}
          ref={minThumbRef}
          onChange={handleMinChange}
          className="absolute w-full h-2 appearance-none pointer-events-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-green-600 [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-green-600 [&::-moz-range-thumb]:shadow-lg"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxValue}
          step={10000}
          ref={maxThumbRef}
          onChange={handleMaxChange}
          className="absolute w-full h-2 appearance-none pointer-events-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-green-600 [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-green-600 [&::-moz-range-thumb]:shadow-lg"
        />
      </div>
    </div>
  );
};

export default PriceRangeSlider;
