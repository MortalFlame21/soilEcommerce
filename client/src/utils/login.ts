import { getRegisteredUser } from "../service/user";
import bcrypt from "bcryptjs";

async function validateLoginIn(v: Record<string, string>) {
  const errors: Record<string, string> = {};

  let user;
  try {
    user = await getRegisteredUser(v.email);
  } catch {
    errors.email = "Something went wrong when retrieving by email.";
  }

  if (!v.email) errors.email = "Enter an email!";
  else if (!v.email.trim()) errors.email = "Enter a email!";
  else if (!user) errors.email = "Email is not registered!";
  // else errors.email = "pass?";

  if (!v.password) errors.password = "Enter a password!";
  else if (user && (await checkUserPassword(v!.password, user?.hash)))
    errors.password = "Password is incorrect!";
  // else errors.password = "pass?";

  return errors;
}

async function checkUserPassword(password: string, hash: string) {
  try {
    const valid = await bcrypt.compare(password, hash);
    if (!valid) return "fail";
    return "";
  } catch {
    return "fail";
  }
}

export { validateLoginIn };
