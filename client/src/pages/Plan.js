import { useParams, Redirect } from "react-router-dom";
import { features, plans } from "../constants/pricing";
import Feature from "../components/Pricing/Feature";
import AddForm from "../components/Plan/AddForm";
import RecordsTable from "../components/Plan/RecordsTable";
import { useContext } from "react";
import AuthContext from "../store/auth-context";

const PlanPage = () => {
  const authCtx = useContext(AuthContext);
  const params = useParams();
  const validPlans = ["personal", "student", "annual"];
  let planTitle = params.plan + " Plan";
  planTitle = planTitle.charAt(0).toUpperCase() + planTitle.slice(1);

  const isPlanValid = validPlans.includes(params.plan);

  if (!isPlanValid) {
    return <Redirect to="/" />;
  } else if (!authCtx.isLoggedIn) {
    return <Redirect to={`/login?redirect=${params.plan}`} />;
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
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col items-start w-full">
            <h1 className="font-bold text-5xl">{planTitle} </h1>
            <span className="font-semibold text-3xl text-gray-600 mt-2">
              @ ₹{plan.price}
              {priceFreq}
            </span>
          </div>
          <div className="flex flex-row justify-between items-center max-w-[1024px] w-full ml-16 mt-8">
            {features[params.plan].map((feature, index) => (
              <div key={index} className="flex flex-row text-xl">
                <Feature>{feature}</Feature>
              </div>
            ))}
          </div>
        </div>
        <AddForm />
        <div className="mt-20 w-full">
          <h1 className="text-xl font-medium text-center">Your Records</h1>
          <RecordsTable />
        </div>
      </div>
    );
  }
};

export default PlanPage;
