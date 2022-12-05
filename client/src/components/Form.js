import { useState } from "react";

const { default: Input } = require("./common/Input");

const Form = ({ className }) => {
  const [subdomain, setSubdomain] = useState("");
  return (
    <div className="flex flex-col m-4 p-4">
      <form
        className={`flex flex-row w-min mx-auto items-center justify-center ${className}`}
      >
        <Input
          type="text"
          placeholder="john"
          className="text-2xl text-center pr-2 "
          value={subdomain}
          onChange={setSubdomain}
        />
        <span className="text-2xl font-semibold ml-1">.servatom.com</span>
      </form>
      <span className="errorText text-xs font-normal mt-4 text-green-400 mx-auto">
        Subdomain Available
      </span>
    </div>
  );
};

export default Form;
