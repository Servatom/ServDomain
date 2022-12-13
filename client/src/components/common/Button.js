const Button = ({ to, onClick, children }) => {
  return (
    <div
      className="mt-6 rounded-md shadow cursor-pointer"
      onClick={() => {
        onClick && onClick();
      }}
    >
      <a
        href={to && to}
        className="flex items-center justify-center px-5 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:shadow-outline"
      >
        {children}
      </a>
    </div>
  );
};

export default Button;
