import { useEffect, useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import axios from "../../axios";
import { isIPV4Address } from "ip-address-validator";
import customToast from "../common/CustomToast";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";
import { ImSpinner8 } from "react-icons/im";
import { isValidHostname } from "../../utils";

const AddForm = ({ plan }) => {
  const [entryType, setEntryType] = useState("CNAME");
  const [subdomain, setSubdomain] = useState("");
  const [content, setContent] = useState("");
  const [contentPlaceholder, setContentPlaceholder] =
    useState("www.example.com");
  const [actionLoading, setActionLoading] = useState(false);
  const [maxContentLength, setMaxContentLength] = useState(70);
  const [optionColour, setOptionColour] = useState({
    CNAME: "text-gray-300",
    A: "text-gray-500",
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
        entryType === "CNAME"
          ? "Enter a valid Domain"
          : "Enter a valid IPv4 address",
      variant: "neutral",
    },
  });
  const [isLoading, setIsLoading] = useState({
    name: false,
    content: false,
  });

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (entryType === "CNAME") {
      setOptionColour({
        CNAME: "text-gray-300",
        A: "text-gray-500",
      });
      setContentPlaceholder("www.example.com");
      setMaxContentLength(70);
      setErrors((prevSate) => {
        return {
          ...prevSate,
          content: {
            text: "Enter a valid hostname",
            variant: "neutral",
          },
        };
      });
    } else {
      setOptionColour({
        CNAME: "text-gray-500",
        A: "text-gray-300",
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
      if (entryType === "A") {
        setErrors((prevSate) => {
          return {
            ...prevSate,
            content: {
              text: "Enter a valid IPv4 address",
              variant: "neutral",
            },
          };
        });
      } else {
        setErrors((prevSate) => {
          return {
            ...prevSate,
            content: {
              text: "Enter a valid hostname",
              variant: "neutral",
            },
          };
        });
      }

      return;
    }

    if (entryType === "A") {
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
    } else {
      if (isValidHostname(content)) {
        setErrors((prevSate) => {
          return {
            ...prevSate,
            content: {
              text: "Valid hostname",
              variant: "success",
            },
          };
        });
      } else {
        setErrors((prevSate) => {
          return {
            ...prevSate,
            content: {
              text: "Invalid hostname",
              variant: "error",
            },
          };
        });
      }
    }
  }, [content]);

  const addRecordHandler = () => {
    if (
      errors.name.variant === "success" &&
      errors.content.variant === "success"
    ) {
      setActionLoading(true);

      const data = {
        name: subdomain,
        content: content,
        type: entryType,
        plan: plan,
      };
      axios
        .post("/subdomain", data, {
          headers: {
            Authorization: `Bearer ${authCtx.user.token}`,
          },
        })
        .then((res) => {
          console.log(res);
          setActionLoading(false);
          if (res.data.success) {
            customToast("Record added successfully");
            setSubdomain("");
            setContent("");
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            customToast("Something went wrong");
          }
        })
        .catch((err) => {
          setActionLoading(false);
          console.log(err);
          customToast("Something went wrong");
        });
    } else {
      customToast("Enter valid details");
    }
  };

  return (
    <div className="p-4 mx-auto flex flex-col items-center mt-12 max-w-[100vw-80px]">
      <div className="flex flex-row gap-12 text-xl">
        <div>
          <input
            type="radio"
            id="CNAME"
            name="entry_type"
            value={"CNAME"}
            className="appearance-none"
            checked={entryType === "CNAME"}
            onChange={(e) => setEntryType(e.target.value)}
          />
          <label
            htmlFor="CNAME"
            className={`font-semibold ${optionColour.CNAME} cursor-pointer`}
          >
            CNAME
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="A"
            name="entry_type"
            value={"A"}
            className="appearance-none"
            checked={entryType === "A"}
            onChange={(e) => setEntryType(e.target.value)}
          />
          <label
            htmlFor="A"
            className={`font-semibold ${optionColour.A} cursor-pointer`}
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
            className={`errorText text-xs my-3 w-max ${
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

        <Button className={"mt-6"} onClick={addRecordHandler}>
          {actionLoading && (
            <div className="animate-spin mr-3">
              <ImSpinner8 />
            </div>
          )}
          <span className="text-lg">Add</span>
        </Button>
      </div>
    </div>
  );
};

export default AddForm;
