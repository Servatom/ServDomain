import PricingCard from "./PricingCard";
import { plans } from "../../constants/pricing";

const Pricing = () => {
  return (
    <div className="w-full md:max-w-2xl lg:max-w-6xl max-w-xs grid md:grid-cols-2 grid-cols-1 xl:grid-cols-3 gap-8 justify-around items-center mt-28 mb-20 mx-auto">
      {plans.map((pricing) => (
        <PricingCard key={pricing.id} pricing={pricing} />
      ))}
    </div>
  );
};

export default Pricing;
