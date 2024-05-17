import { User, addUser, userExists, deleteUser } from "./user";

// success
function editExistingUser(v: Record<string, string>) {
  deleteUser(v.email); // temp delete user, definetely change this when using db
  addUser({
    username: v.username,
    email: v.email,
    password: v.password,
    date: new Date(v.date),
  });
}

function validateUsername(v: Record<string, string>, u: User) {
  // no changes don't bother, might be a problem l8r on idk
  if (v.username == u.username) return "";
  else if (!v.username) return "Enter a username!";
  else if (v.username.length < 5)
    return "Username must be \u2265 5 characters in length";
  return "";
}
function validateEmail(v: Record<string, string>, u: User) {
  if (v.email == u.email) return "";
  else if (!v.email) return "Enter a email!";
  else if (!/\S+@\S+\.\S+/.test(v.email)) return "Enter a valid email address!";
  else if (userExists(v.email)) return "Email already taken!";

  return "";
}

function validatePassword(v: Record<string, string>, u: User) {
  const exp = new RegExp(
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+-={};':,.<>?/|\\\"])"
  );

  if (v.password == u.password) return "";
  else if (!v.password) return "Enter a password!";
  else if (v.password.length < 10)
    return "Password must be \u2265 10 characters in length";
  else if (!exp.test(v.password)) return "!"; // output jsx

  return "";
}

function validateConfirmPassword(v: Record<string, string>, u: User) {
  const hasChangedPswd = v.password != u.password;

  if (!hasChangedPswd) return "";
  else if (!v.cPassword && hasChangedPswd) return "Confirm your password!";
  else if (v.password !== v.cPassword && hasChangedPswd)
    return "Passwords must be the same!";
  return "";
}

function validateEdit(v: Record<string, string>, u: User | undefined) {
  const errors: Record<string, string> = {};

  if (u === undefined)
    throw new Error("User is undefined when editing profile");

  if (validateUsername(v, u)) errors.username = validateUsername(v, u);
  if (validateEmail(v, u)) errors.email = validateEmail(v, u);

  // fix below
  // validate new password and confirm
  // validate the old password
  if (validatePassword(v, u)) errors.password = validatePassword(v, u);
  if (validateConfirmPassword(v, u))
    errors.cPassword = validateConfirmPassword(v, u);

  return errors;
}

function checkIfEdited(v: Record<string, string>, u: User | undefined) {
  if (v.username != u?.username) return true;
  if (v.email != u?.email) return true;
  if (v.newPassword) return true;
  return false;
}

export { editExistingUser, validateEdit, checkIfEdited };
