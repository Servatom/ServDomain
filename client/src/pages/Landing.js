import { Link } from "react-router-dom";
import CheckForm from "../components/CheckForm";
import Hero from "../components/Hero";
import Pricing from "../components/Pricing/Pricing";

function Landing() {
  return (
    <div className="w-full h-full min-h-screen flex flex-col text-gray-300 items-center px-40">
      <Hero />
      <CheckForm className="mt-12" />
      <span className="p-6 rounded-lg backdrop-blur-md bg-gray-500 bg-opacity-10 mt-8">
        <span className="font-semibold text-purple-400">✨ COMING SOON: </span>
        Subdomain{" "}
        <span className="underline underline-offset-4 decoration-purple-400">
          marketplace!
        </span>{" "}
        List your domain for subdomain rentals.
      </span>
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
