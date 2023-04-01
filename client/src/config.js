export const validatePhoneNumber = (phoneNumber) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phoneNumber);
};

export const validateOtp = (otp) => {
  const regex = /^[0-9]{6}$/;
  return regex.test(otp);
};
