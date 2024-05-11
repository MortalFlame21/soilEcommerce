import axios from "axios";
import config from "./config";

type User = {
  id: number;
  username: string;
  email: string;
  dateJoined: Date;
  hash: string;
};

// find why set timeout handler took x time
export async function findUserByUsername(username: string) {
  try {
    const res = await axios.get(`${config.HOST}/user/username/${username}`);
    return res.data.length > 0;
  } catch {
    return false;
  }
}

export async function findUserByEmail(email: string) {
  try {
    const res = await axios.get(`${config.HOST}/user/email/${email}`);
    return res.data.length > 0;
  } catch {
    return false;
  }
}

export async function createUser(v: Record<string, string>) {
  try {
    const res = await axios.post(`${config.HOST}/user`, {
      username: v.username,
      email: v.email,
      password: v.password,
    });
    console.log(res.data);
    return res.data.length == 0; // [] is returned
  } catch (e) {
    return false;
  }
}

export async function getRegisteredUser(
  email: string
): Promise<User | undefined> {
  try {
    const res = await axios.get(`${config.HOST}/user/email/${email}`);
    return res.data.at(0);
  } catch {
    return undefined;
  }
}
