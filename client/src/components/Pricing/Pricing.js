import PricingCard from "./PricingCard";
import { pricings } from "../../constants/pricing";

const Pricing = () => {
  return (
    <div className="w-full grid grid-cols-3 gap-8 justify-around max-w-screen-xl items-start mt-32 mb-20">
      {pricings.map((pricing) => (
        <PricingCard key={pricing.id} pricing={pricing} />
      ))}
    </div>
  );
};

export default Pricing;
