import { useEffect, useState } from "react";
import Loader from "./common/Loader";
import axios from "../axios";
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
    text: "Enter value to check availability",
    variant: "neutral",
  });

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer P7nU1_3IJI7pln-6FbyGJKcvL8AKnKMddnpk_Yrl"
    );
    myHeaders.append(
      "Cookie",
      "__cflb=0H28vgHxwvgAQtjUGU56Rb8iNWZVUvXhnxLXpb955W5; __cfruid=b4e4377d9136f48023f72ff821cf994ff007af5d-1679934169"
    );

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://api.cloudflare.com/client/v4/zones/e17de047110e5c93bcb7e83d4a5a10d7/dns_records",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }, []);

  useEffect(() => {
    setIsLoading(false);
    if (subdomain.length === 0) {
      setError({
        text: "Enter value to check availability",
        variant: "neutral",
      });
    } else if (subdomain.length < 3) {
      setError({
        text: "Subdomain must be atleast 3 characters long",
        variant: "error",
      });
    } else {
      setIsLoading(true);
      setError({
        text: "Checking availability",
        variant: "neutral",
      });
      // fetch(`/api/checkSubdomain/${subdomain}`)
      //   .then((res) => res.json())
      //   .then((data) => {
      //     if (data.available) {
      //       setError({
      //         text: "Subdomain is available",
      //         variant: "success",
      //       });
      //     } else {
      //       setError({
      //         text: "Subdomain is not available",
      //         variant: "error",
      //       });
      //     }
      //     setIsLoading(false);
      //   })
      //   .catch((err) => {
      //     setError({
      //       text: "Something went wrong",
      //       variant: "error",
      //     });
      //     setIsLoading(false);
    }
  }, [subdomain]);
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
          enablePlaceholderAnimation={true}
        />
        <span className="text-2xl font-semibold ml-1">.servatom.com</span>
      </form>
      {error && (
        <div className="flex flex-row justify-center items-center text-xs font-normal mt-5 mx-auto">
          {isLoading && (
            <Loader
              size={10}
              color={errorVariants[error.variant]}
              className={`mr-2`}
            />
          )}
          <span className={`errorText ${errorVariants[error.variant]}`}>
            {error.text}
          </span>
        </div>
      )}
    </div>
  );
};

export default Form;
