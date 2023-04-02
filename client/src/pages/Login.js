import { useEffect, useRef, useState } from "react";
import Button from "../components/common/Button";
import { IoArrowBackOutline } from "react-icons/io5";
import { useHistory } from "react-router-dom";
import { validateOtp, validatePhoneNumber } from "../config";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(false);

  const otpInputRef = useRef(null);
  const history = useHistory();

  const handlePhoneNumberChange = (e) => {
    if (e.target.value.length <= 10) {
      setPhoneNumber(e.target.value);
    } else {
      setPhoneNumber(e.target.value.slice(0, 10));
    }
  };

  const handleOtpChange = (e) => {
    if (e.target.value.length === 6) {
      setOtp(e.target.value);
    } else {
      setOtp(e.target.value.slice(0, 6));
    }
  };

  const handleSendOtp = () => {
    if (isPhoneValid) {
      const formattedPhoneNumber = "+91" + phoneNumber;

      setOtpSent(true);
      otpInputRef.current.focus();
    } else return;
  };

  const handleVerifyOtp = () => {
    if (!isOtpValid) return;

    // verify otp
  };

  useEffect(() => {
    setIsPhoneValid(validatePhoneNumber(phoneNumber));
  }, [phoneNumber]);

  useEffect(() => {
    setIsOtpValid(validateOtp(otp));
  }, [otp]);

  return (
    <>
      <h1 className="font-semibold text-4xl p-12 text-gray-300 flex flex-row items-center">
        <IoArrowBackOutline
          className="text-gray-300 mr-6 cursor-pointer"
          onClick={() => {
            history.goBack();
          }}
        />
        Login/Signup
      </h1>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-4 items-start w-[40vw] mb-4 rounded-lg text-gray-300 border-[0.5px] border-gray-900 bg-slate-700 backdrop-blur-xl bg-opacity-20 p-8">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-gray-400">Enter Phone Number</label>
            <input
              className={`rounded-lg flex w-auto px-3 py-2 text-xl outline-none font-semibold bg-gray-800 bg-opacity-40 backdrop-blur-md text-gray-300 disabled:text-gray-400 duration-200 disabled:cursor-not-allowed placeholder:text-gray-700`}
              placeholder={"+91 69420 69420"}
              value={phoneNumber}
              onChange={(e) => {
                handlePhoneNumberChange(e);
              }}
              disabled={otpSent}
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label className="text-gray-400">Enter OTP</label>
            <input
              className={`rounded-lg flex w-auto px-3 py-2 text-xl outline-none font-semibold bg-gray-800 bg-opacity-40 backdrop-blur-md text-gray-300 disabled:cursor-not-allowed placeholder:text-gray-700`}
              placeholder={"XXX XXX"}
              value={otp}
              onChange={handleOtpChange}
              ref={otpInputRef}
              disabled={!otpSent}
            />
          </div>
          {!otpSent && (
            <Button
              className={"w-full mt-4"}
              disabled={!isPhoneValid}
              onClick={handleSendOtp}
            >
              Send OTP
            </Button>
          )}
          {otpSent && (
            <Button
              className={"w-full mt-4"}
              disabled={!isOtpValid}
              onClick={handleVerifyOtp}
            >
              {isOtpValid ? "Log in" : "Enter OTP"}
            </Button>
          )}
        </div>
        <div className="mt-2 text-center w-full">
          <span className="text-xs text-gray-400 font-normal ">
            Enter mobile number without country code. We only serve in India
            currently.
          </span>
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </>
  );
};

export default Login;
