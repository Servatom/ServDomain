import styles from "../../assets/css/Loader.module.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loader = ({ color, size = 20, className }) => {
  return (
    <div className={`${color} ${className}`}>
      <AiOutlineLoading3Quarters
        size={size}
        className={` ${styles["loader"]}`}
      />
    </div>
  );
};

export default Loader;
