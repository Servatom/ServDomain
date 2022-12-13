import { useState } from "react";
const { default: Input } = require("./common/Input");

const Form = ({ className }) => {
  const errorVariants = {
    success: "text-green-400",
    error: "text-red-400",
    neutral: "text-gray-400",
  };
  const [subdomain, setSubdomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    text: "test",
    variant: "neutral",
  });
  return (
    <div className="flex flex-col m-4 p-4">
      <form
        className={`flex flex-row w-min mx-auto items-center justify-center ${className}`}
      >
        <Input
          type="text"
          placeholder="john"
          className="text-2xl text-center pr-2 py-1 placeholder:opacity-30 focus::outline focus:outline-2 focus:outline-gray-600"
          value={subdomain}
          onChange={setSubdomain}
        />
        <span className="text-2xl font-semibold ml-1">.servatom.com</span>
      </form>
      {error && (
        <span
          className={`errorText text-xs font-normal mt-5 ${
            errorVariants[error.variant]
          } mx-auto`}
        >
          {error.text}
        </span>
      )}
    </div>
  );
};

export default Form;
