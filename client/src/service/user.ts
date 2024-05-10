import axios from "axios";
import config from "./config";

// find why set timeout handler took x time
export async function getUserByUsername(username: string) {
  // console.log("this is being called");
  const res = await axios.get(`${config.HOST}/user/username/${username}`);
  return res.data.length > 0;
}

// rename above and below to check if register etc.
export async function getUserByEmail(email: string) {
  // console.log("this is being called");
  const res = await axios.get(`${config.HOST}/user/email/${email}`);
  return res.data.length > 0;
}

export async function signup(v: Record<string, string>) {
  const res = await axios.post(`${config.HOST}/user`, {
    username: v.username,
    email: v.email,
    password: v.password,
  });
  return res.data.length > 0;
}

export async function getRegisteredUser(email: string) {
  const res = await axios.get(`${config.HOST}/user/email/${email}`);
  return res.data.at(0);
}
