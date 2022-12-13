const Feature = ({ children }) => {
  return (
    <>
      <div className="flex-shrink-0">
        <svg
          className="w-6 h-6 text-green-500"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <p className="ml-3 text-base leading-6 text-gray-700 dark:text-gray-200">
        {children}
      </p>
    </>
  );
};

export default Feature;
