import { useParams, Redirect } from "react-router-dom";
import { features, plans } from "../constants/pricing";
import Feature from "../components/Pricing/Feature";
import AddForm from "../components/Plan/AddForm";

const PlanPage = () => {
  const params = useParams();
  const validPlans = ["personal", "student", "annual"];
  let planTitle = params.plan + " Plan";
  planTitle = planTitle.charAt(0).toUpperCase() + planTitle.slice(1);

  const isPlanValid = validPlans.includes(params.plan);

  if (!isPlanValid) {
    return <Redirect to="/" />;
  } else {
    let plan = plans.find((plan) => plan.name.toLowerCase() === params.plan);
    let priceFreq =
      plan.frequency === "Daily"
        ? "/day"
        : plan.frequency === "Monthly"
        ? "/month"
        : "/year";
    return (
      <div className="p-16 text-gray-300">
        <h1 className="font-bold text-5xl">
          {planTitle}{" "}
          <span className="font-semibold text-3xl text-gray-600 ml-4">
            {" "}
            @ ₹{plan.price}
            {priceFreq}
          </span>
        </h1>
        <div className="flex flex-row justify-between items-center mt-20 max-w-[1024px] w-full mx-auto ">
          {features[params.plan].map((feature, index) => (
            <div key={index} className="flex flex-row text-xl">
              <Feature>{feature}</Feature>
            </div>
          ))}
        </div>
        <AddForm />
      </div>
    );
  }
};

export default PlanPage;
