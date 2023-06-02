import { useEffect, useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import axios from "../../axios";
import { isIPV4Address } from "ip-address-validator";

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

  const errorVariants = {
    success: "text-green-400",
    error: "text-red-400",
    neutral: "text-gray-400",
  };

  const [errors, setErrors] = useState({
    name: {
      text: "Check availability",
      variant: "neutral",
    },
    content: {
      text:
        entryType === "cname"
          ? "Enter a valid Domain"
          : "Enter a valid IPv4 address",
      variant: "neutral",
    },
  });
  const [isLoading, setIsLoading] = useState({
    name: false,
    content: false,
  });

  useEffect(() => {
    if (entryType === "cname") {
      setOptionColour({
        cname: "text-gray-300",
        arecord: "text-gray-500",
      });
      setContentPlaceholder("www.example.com");
      setMaxContentLength(70);
      setErrors((prevSate) => {
        return {
          ...prevSate,
          content: {
            text: "Enter a valid Domain",
            variant: "neutral",
          },
        };
      });
    } else {
      setOptionColour({
        cname: "text-gray-500",
        arecord: "text-gray-300",
      });
      setContentPlaceholder("69.42.0.69");
      setMaxContentLength(15);
      setErrors((prevSate) => {
        return {
          ...prevSate,
          content: {
            text: "Enter a valid IPv4 address",
            variant: "neutral",
          },
        };
      });
    }
  }, [entryType]);

  //checking if subdomain is available
  useEffect(() => {
    setIsLoading({
      ...isLoading,
      name: false,
    });
    if (subdomain.length === 0) {
      setErrors((prevSate) => {
        return {
          ...prevSate,
          name: {
            text: "Check availability",
            variant: "neutral",
          },
        };
      });
    } else if (subdomain.length < 3) {
      setErrors((prevSate) => {
        return {
          ...prevSate,
          name: {
            text: "Subdomain must be atleast 3 characters long",
            variant: "neutral",
          },
        };
      });
    } else {
      setIsLoading({
        ...isLoading,
        name: true,
      });
      setErrors((prevSate) => {
        return {
          ...prevSate,
          name: {
            text: "Checking availability",
            variant: "neutral",
          },
        };
      });
      const timeoutId = setTimeout(() => {
        if (subdomain.length >= 3) {
          axios
            .get(`/subdomain/check?subdomain=${subdomain}`)
            .then((res) => {
              if (res.data.available) {
                setErrors((prevSate) => {
                  return {
                    ...prevSate,
                    name: {
                      text: "Subdomain is available",
                      variant: "success",
                    },
                  };
                });
              } else {
                setErrors((prevSate) => {
                  return {
                    ...prevSate,
                    name: {
                      text: "Subdomain is not available",
                      variant: "error",
                    },
                  };
                });
              }
              setIsLoading({
                ...isLoading,
                name: false,
              });
            })
            .catch((err) => {
              setErrors((prevSate) => {
                return {
                  ...prevSate,
                  name: {
                    text: "Something went wrong",
                    variant: "error",
                  },
                };
              });
              setIsLoading({
                ...isLoading,
                name: false,
              });
            });
        }
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [subdomain]);

  //checking if content is valid
  useEffect(() => {
    setIsLoading({
      ...isLoading,
      content: false,
    });

    if (content.length === 0) {
      if (entryType === "arecord") {
        setErrors((prevSate) => {
          return {
            ...prevSate,
            content: {
              text: "Enter a valid IPv4 address",
              variant: "neutral",
            },
          };
        });
      }

      return;
    }

    if (entryType === "arecord") {
      if (isIPV4Address(content)) {
        setErrors((prevSate) => {
          return {
            ...prevSate,
            content: {
              text: "Valid IPv4 Address",
              variant: "success",
            },
          };
        });
      } else {
        setErrors((prevSate) => {
          return {
            ...prevSate,
            content: {
              text: "Invalid IPv4 Address",
              variant: "error",
            },
          };
        });
      }
    }
  }, [content]);

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
      <div className="flex flex-row gap-12 mt-12 items-start">
        <div className="flex flex-col justify-start items-start w-min">
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
          <span
            className={`errorText text-xs my-3 ${
              errorVariants[errors.name.variant]
            }`}
          >
            {errors.name.text}
          </span>
        </div>
        <div className="flex flex-col justify-start items-start w-min min-w-[150px]">
          <label htmlFor="content" className="text-sm mb-2">
            Content
          </label>
          <Input
            id="content"
            type="text"
            placeholder={contentPlaceholder}
            className="text-2xl text-center pr-2 py-1 placeholder:opacity-30 focus::outline focus:outline-2 focus:outline-gray-600 min-w-full"
            value={content}
            onChange={setContent}
            maxLength={maxContentLength}
          />
          <span
            className={`errorText text-xs my-3 ${
              errorVariants[errors.content.variant]
            } `}
          >
            {errors.content.text}
          </span>
        </div>

        <Button className={"mt-6"}>
          <span className="text-lg">Add</span>
        </Button>
      </div>
    </div>
  );
};

export default AddForm;
