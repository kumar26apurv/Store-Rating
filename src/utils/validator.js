const validateSignup = (data) => {
  const errors = [];

  // validating name ( constraint : min 20, max 60)
  if (!data.name || data.name.length < 20 || data.name.length > 60) {
    errors.push("Name must be between 20 and 60 characters.");
  }

  // validating Address
  if (data.address && data.address.length > 400) {
    errors.push("Address cannot exceed 400 characters.");
  }

  // validating Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push("Invalid email format.");
  }

  // validating password: 8-16 chars, 1 Uppercase, 1 Special Char
  const password = data.password;
  if (!password) {
    errors.push("Password is required.");
  } else {
    if (password.length < 8 || password.length > 16) {
      errors.push("Password must be 8-16 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character.");
    }
  }

  return errors;
};

module.exports = { validateSignup };
