import { toast } from "react-hot-toast";

const customToast = (label = "") =>
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-fit w-full bg-gray-300 justify-center font-semibold p-4 shadow-lg rounded-md pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      {label}
    </div>
  ));

export default customToast;
