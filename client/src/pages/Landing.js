import { Link } from "react-router-dom";
import CheckForm from "../components/CheckForm";
import Hero from "../components/Hero";
import Pricing from "../components/Pricing/Pricing";

function Landing() {
  return (
    <div className="w-full h-full min-h-screen flex flex-col text-gray-300 items-center px-40">
      <Hero />
      <CheckForm className="mt-12" />
      <Pricing />
      <Link
        to={"/tnc"}
        className="text-center mb-8 opacity-80 text-sm underline underline-offset-4"
      >
        Terms and Conditions
      </Link>
    </div>
  );
}

export default Landing;
