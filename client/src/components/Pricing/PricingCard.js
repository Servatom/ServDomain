import { useHistory } from "react-router-dom";
import Button from "../common/Button";
import Feature from "./Feature";

const PricingCard = ({ pricing }) => {
  const history = useHistory();
  let pricingFreq = "/day";
  switch (pricing.frequency) {
    case "Daily":
      pricingFreq = "/day";
      break;
    case "Monthly":
      pricingFreq = "/month";
      break;
    case "Yearly":
      pricingFreq = "/year";
      break;
    default:
      pricingFreq = "/day";
  }
  return (
    <div className="mb-4 overflow-hidden rounded-lg shadow-lg bg-gray-800 bg-opacity-40 backdrop-blur-lg max-w-md">
      <div className="px-6 py-8  sm:p-10 sm:pb-6">
        <div className="flex justify-center">
          <span className="inline-flex px-4 py-1 text-sm font-semibold leading-5 tracking-wide uppercase rounded-full dark:text-white">
            {pricing.name} Plan
          </span>
        </div>
        <div className="flex justify-center mt-4 text-5xl font-extrabold leading-none dark:text-white">
          <span className="ml-1 mr-3 text-base font-medium leading-8 text-gray-500 dark:text-gray-400">
            from
          </span>
          ₹{pricing.price}
          <span className="pt-6 ml-1 text-lg font-medium leading-8 text-gray-500 dark:text-gray-400">
            {pricingFreq}
          </span>
        </div>
      </div>
      <div className="px-6 pt-4 pb-8  sm:p-10 sm:pt-4">
        <ul>
          {pricing.features.map((feature, index) => (
            <li className="flex items-start justify-start mt-4" key={index}>
              <Feature>{feature}</Feature>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Button
            onClick={() => {
              history.push(`/${pricing.name.toLowerCase()}`);
            }}
          >
            <span>Start {pricing.name} plan</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
