import { useEffect, useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

const AddForm = () => {
  const [entryType, setEntryType] = useState("cname");
  const [subdomain, setSubdomain] = useState("");
  const [content, setContent] = useState("");
  const [contentPlaceholder, setContentPlaceholder] =
    useState("www.example.com");
  const [maxContentLength, setMaxContentLength] = useState(70);
  const [optionColour, setOptionColour] = useState({
    cname: "text-gray-300",
    arecord: "text-gray-500",
  });
  useEffect(() => {
    if (entryType === "cname") {
      setOptionColour({
        cname: "text-gray-300",
        arecord: "text-gray-500",
      });
      setContentPlaceholder("www.example.com");
      setMaxContentLength(70);
    } else {
      setOptionColour({
        cname: "text-gray-500",
        arecord: "text-gray-300",
      });
      setContentPlaceholder("17.5.7.3");
      setMaxContentLength(15);
    }
  }, [entryType]);
  return (
    <div className="p-4 mx-auto flex flex-col items-center mt-12 max-w-[100vw-80px]">
      <div className="flex flex-row gap-12 text-xl">
        <div>
          <input
            type="radio"
            id="cname"
            name="entry_type"
            value={"cname"}
            className="appearance-none"
            checked={entryType === "cname"}
            onChange={(e) => setEntryType(e.target.value)}
          />
          <label
            htmlFor="cname"
            className={`font-semibold ${optionColour.cname} cursor-pointer`}
          >
            CNAME
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="arecord"
            name="entry_type"
            value={"arecord"}
            className="appearance-none"
            checked={entryType === "arecord"}
            onChange={(e) => setEntryType(e.target.value)}
          />
          <label
            htmlFor="arecord"
            className={`font-semibold ${optionColour.arecord} cursor-pointer`}
          >
            A RECORD
          </label>
        </div>
      </div>
      <div className="flex flex-row gap-12 mt-8 items-end">
        <div className="flex flex-col justify-start items-start">
          <label htmlFor="subdomain" className="text-sm mb-2">
            Subdomain
          </label>
          <Input
            id="subdomain"
            type="text"
            placeholder="noobmaster69"
            className="text-2xl text-center pr-2 py-1 placeholder:opacity-30 focus::outline focus:outline-2 focus:outline-gray-600"
            value={subdomain}
            onChange={setSubdomain}
            maxLength={24}
          />
        </div>
        <div className="flex flex-col justify-start items-start">
          <label htmlFor="content" className="text-sm mb-2">
            Content
          </label>
          <Input
            id="content"
            type="text"
            placeholder={contentPlaceholder}
            className="text-2xl text-center pr-2 py-1 placeholder:opacity-30 focus::outline focus:outline-2 focus:outline-gray-600"
            value={content}
            onChange={setContent}
            maxLength={maxContentLength}
          />
        </div>

        <Button className={"mt-0 "}>
          <span className="text-lg">Add</span>
        </Button>
      </div>
    </div>
  );
};

export default AddForm;
