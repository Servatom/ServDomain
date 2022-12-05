const Input = ({ className, type, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      className={`rounded-lg flex w-auto px-3 py-2 text-xl outline-none font-semibold bg-gray-800 bg-opacity-40 backdrop-blur-md text-gray-300 ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      size={value && value.length > 3 ? value.length : 3}
    />
  );
};

export default Input;
