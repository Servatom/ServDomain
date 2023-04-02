import { Link } from "react-router-dom";

const Button = ({
  to = "",
  onClick,
  className,
  children,
  disabled = false,
}) => {
  const bg = disabled
    ? "bg-gray-700 cursor-not-allowed"
    : "bg-indigo-600 hover:bg-indigo-500";
  return (
    <div
      className={"rounded-md shadow cursor-pointer " + className}
      onClick={() => {
        !disabled && onClick && onClick();
      }}
    >
      <Link
        to={to}
        className={`flex items-center justify-center px-5 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out border border-transparent rounded-md focus:outline-none focus:shadow-outline ${bg}`}
      >
        {children}
      </Link>
    </div>
  );
};

export default Button;
