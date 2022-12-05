import bgFlare from "./assets/media/flare_light.avif";
import Form from "./components/Form";
import Hero from "./components/Hero";

function App() {
  return (
    <div className="w-full h-full min-h-screen flex flex-col text-gray-300 items-center px-40">
      <Hero />
      <Form className="mt-12" />
    </div>
  );
}

export default App;
