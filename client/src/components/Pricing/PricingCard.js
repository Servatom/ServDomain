import Button from "../common/Button";
import Feature from "./Feature";

const PricingCard = ({ pricing }) => {
  return (
    <div class="mb-4 overflow-hidden rounded-lg shadow-lg">
      <div class="px-6 py-8 bg-white dark:bg-gray-800 sm:p-10 sm:pb-6">
        <div class="flex justify-center">
          <span class="inline-flex px-4 py-1 text-sm font-semibold leading-5 tracking-wide uppercase rounded-full dark:text-white">
            {pricing.name} Plan
          </span>
        </div>
        <div class="flex justify-center mt-4 text-5xl font-extrabold leading-none dark:text-white">
          <span class="ml-1 mr-3 text-base font-medium leading-8 text-gray-500 dark:text-gray-400">
            from
          </span>
          ₹{pricing.price}
          <span class="pt-6 ml-1 text-lg font-medium leading-8 text-gray-500 dark:text-gray-400">
            {pricing.frequency === "Monthly" ? "/month" : "/year"}
          </span>
        </div>
      </div>
      <div class="px-6 pt-4 pb-8 bg-white dark:bg-gray-800 sm:p-10 sm:pt-4">
        <ul>
          {pricing.features.map((feature) => (
            <li class="flex items-start justify-start mt-4">
              <Feature>{feature}</Feature>
            </li>
          ))}
        </ul>
        <div class="mt-6">
          <Button to={`/buy?plan=${pricing.name}`}>
            <span>Start {pricing.name} plan</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
