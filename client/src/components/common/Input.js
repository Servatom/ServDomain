import { useEffect, useMemo } from "react";
import { useState } from "react";

const Input = ({
  className,
  type,
  placeholder,
  value,
  onChange,
  enablePlaceholderAnimation = false,
  size,
  ...rest
}) => {
  const [inputSize, setInputSize] = useState(size || 3);
  const [placeholderValue, setPlaceholderValue] = useState(placeholder);

  const placeholderList = [
    "iamsocool",
    "john",
    "noobmaster69",
    "raghav",
    "myfirstdomain",
    "yashvardhan",
  ];
  // check if placeholder animation is enabled and value is absent then animate placeholder
  useEffect(() => {
    if (enablePlaceholderAnimation && !value) {
      let i = 0;
      const interval = setInterval(() => {
        setPlaceholderValue(placeholderList[i]);
        i++;
        if (i === placeholderList.length) i = 0;
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setPlaceholderValue(placeholder);
    }
  }, [placeholder, enablePlaceholderAnimation, value]);

  useEffect(() => {
    if (value) {
      if (value.length > 8) setInputSize(value.length);
      else setInputSize(8);
    } else {
      if (placeholderValue) {
        if (placeholderValue.length > 8) setInputSize(placeholderValue.length);
        else setInputSize(8);
      }
    }
  }, [value, placeholderValue]);

  return (
    <input
      type={type}
      className={`rounded-lg flex w-auto px-3 py-2 text-xl outline-none font-semibold bg-gray-800 bg-opacity-40 backdrop-blur-md text-gray-300 ${className}`}
      placeholder={placeholderValue}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      size={inputSize}
      {...rest}
    />
  );
};

export default Input;
