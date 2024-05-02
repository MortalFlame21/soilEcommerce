import { getUser, userExists } from "./user";

function validateLoginIn(v: Record<string, string>) {
  const errors: Record<string, string> = {};

  // .trim() for whitespaces
  if (v.email.trim() && !userExists(v.email)) {
    errors.email = "Email is not registered!";
    return errors;
  }

  const u = getUser(v.email);

  if (!v.email) errors.email = "Enter an email!";
  else if (!v.email.trim()) errors.email = "Enter a email!";

  if (!v.password) errors.password = "Enter a password!";
  else if (v.password !== u?.password)
    errors.password = "Password is incorrect!";

  return errors;
}

export { validateLoginIn };
