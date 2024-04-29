import { addUser, userExists } from "./user";

// success
function signupUser(v: Record<string, string>) {
  addUser({
    username: v.username,
    email: v.email,
    password: v.password,
    date: new Date(),
  });
}

// validate
function validateUsername(v: Record<string, string>): string {
  if (!v.username) return "Enter a username!";
  else if (!v.username.trim()) return "Enter a username!";
  else if (v.username.length < 5)
    return "Username must be \u2265 5 characters in length";
  return "";
}

function validateEmail(v: Record<string, string>): string {
  if (!v.email) return "Enter a email!";
  else if (!/\S+@\S+\.\S+/.test(v.email)) return "Enter a valid email address!";
  else if (userExists(v.email)) return "Email already taken!";

  return "";
}

function validatePassword(v: Record<string, string>): string {
  // https://security.harvard.edu/use-strong-passwords
  // CHANGE SPECIAL CHARACTER SECTION FOR MALICIOUS USE FOR CHARACTERS ;<>\{}[]+=?&,:'"`
  // TODO: DONT ALLOW FOR WHITESPACES BETWEEN THE PASSWORD STRING
  const exp = new RegExp(
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+-={};':,.<>?/|\\\"])"
  );

  if (!v.password) return "Enter a password!";
  else if (v.password.length < 10)
    return "Password must be \u2265 10 characters in length";
  else if (!exp.test(v.password)) return "!"; // gonna output jsx
  return "";
}

function validateConfirmPassword(v: Record<string, string>): string {
  if (!v.cPassword) return "Confirm your password!";
  else if (v.password !== v.cPassword) return "Passwords must be the same";
  return "";
}

function validateSignUp(v: Record<string, string>) {
  const errors: Record<string, string> = {};

  if (validateUsername(v)) errors.username = validateUsername(v);
  if (validateEmail(v)) errors.email = validateEmail(v);
  if (validatePassword(v)) errors.password = validatePassword(v);
  if (validateConfirmPassword(v)) errors.cPassword = validateConfirmPassword(v);

  return errors;
}

export { signupUser, validateSignUp };
