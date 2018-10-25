export const checkEmailValidity = value =>
  value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? undefined : "Invalid email address";

export const checkPhoneValidity = value =>
  value && /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/i.test(value) ? undefined : "Invalid phone";
