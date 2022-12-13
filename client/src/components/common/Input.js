import { useEffect } from "react";
import { useState } from "react";

const Input = ({
  className,
  type,
  placeholder,
  value,
  onChange,
  enablePlaceholderAnimation = false,
}) => {
  const [inputSize, setInputSize] = useState(3);
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
    }
  }, []);

  useEffect(() => {
    if (value) {
      setInputSize(value.length);
    } else {
      if (placeholderValue) setInputSize(placeholderValue.length);
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
    />
  );
};

export default Input;
