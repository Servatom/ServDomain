import { useState } from "react";
import { BiUser } from "react-icons/bi";
import Button from "./common/Button";

const LoginIcon = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const MenuContent = () => {
    if (isLoggedIn)
      return (
        <div className="flex flex-col items-start justify-center w-max text-base">
          <span className="p-2 px-4 border-b border-slate-700 w-full cursor-default font-bold">
            +91 96250 56985
          </span>
          <span className="p-2 px-4 w-full hover:bg-slate-500 hover:bg-opacity-30">
            View Profile
          </span>
          <span className="p-2 px-4 w-full hover:bg-slate-500 hover:bg-opacity-30">
            Logout
          </span>
        </div>
      );
    else
      return (
        <div className="p-3">
          <Button className="w-48 mt-0" to={"/login"}>
            Log In
          </Button>
        </div>
      );
  };

  return (
    <div className="">
      {isMenuOpen && (
        <div
          className="absolute w-screen h-screen"
          onClick={() => {
            setIsMenuOpen(false);
          }}
        ></div>
      )}
      <div className="absolute cursor-pointer right-8 top-8 ">
        <div
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          <BiUser className="text-gray-300 p-2" size={45} />
        </div>
        {isMenuOpen && (
          <div className="absolute top-12 right-0 border-[0.5px] border-gray-900 bg-slate-700 backdrop-blur-md bg-opacity-30 min-w-[80px] text-gray-300">
            <MenuContent />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginIcon;
