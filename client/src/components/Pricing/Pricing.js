import PricingCard from "./PricingCard";
import { pricings } from "../../constants/pricing";

const Pricing = () => {
  return (
    <div className="w-full flex flex-row justify-between items-start 2xl:px-64 sm:px-8 mt-32 mb-20">
      {pricings.map((pricing) => (
        <PricingCard key={pricing.id} pricing={pricing} />
      ))}
    </div>
  );
};

export default Pricing;
