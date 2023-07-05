import { IoArrowBackOutline } from "react-icons/io5";
import { useHistory } from "react-router-dom";

const Support = () => {
  const history = useHistory();
  return (
    <div className="flex flex-col items-start p-12 text-gray-300">
      <h1 className="font-semibold text-3xl flex flex-row items-center">
        <IoArrowBackOutline
          className="text-gray-300 mr-6 cursor-pointer"
          onClick={() => {
            history.goBack();
          }}
        />
        Support
      </h1>
      <p className="p-4">
        For any queries or support, you can write us at{" "}
        <a
          href="mailto:yash22arora@gmail.com"
          className="underline underline-offset-2 text-pink-500"
        >
          this email.
        </a>{" "}
      </p>
    </div>
  );
};

export default Support;
