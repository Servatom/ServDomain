import { IoArrowBackOutline } from "react-icons/io5";
import { useHistory } from "react-router-dom";
import { Terms } from "../constants/tnc";

const TermsAndConditions = () => {
  const history = useHistory();
  return (
    <div className="flex flex-col items-start">
      <h1 className="font-semibold text-3xl p-12 text-gray-300 flex flex-row items-center">
        <IoArrowBackOutline
          className="text-gray-300 mr-6 cursor-pointer"
          onClick={() => {
            history.goBack();
          }}
        />
        Terms and Conditions
      </h1>
      <ol className="list-decimal list-inside px-12 mx-12">
        {Terms.map((term, index) => {
          return (
            <li
              key={index}
              className="text-gray-300 text-lg px-4 py-2 list-item -indent-6"
            >
              {term}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default TermsAndConditions;
