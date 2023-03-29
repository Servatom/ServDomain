import Form from "../components/Form";
import Hero from "../components/Hero";
import Pricing from "../components/Pricing/Pricing";

function Landing() {
  return (
    <div className="w-full h-full min-h-screen flex flex-col text-gray-300 items-center px-40">
      <Hero />
      <Form className="mt-12" />
      <Pricing />
    </div>
  );
}

export default Landing;
