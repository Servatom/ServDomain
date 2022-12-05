import PricingCard from "./PricingCard";

const Pricing = () => {
  return (
    <div className="w-full flex flex-row justify-between items-start 2xl:px-64 sm:px-8 mt-32 mb-20">
      <PricingCard />
      <PricingCard />
      <PricingCard />
    </div>
  );
};

export default Pricing;
