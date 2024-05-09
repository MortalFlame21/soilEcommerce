import axios from "axios";
import config from "./config";

// find why set timeout handler took x time
export async function getUserByUsername(username: string) {
  // console.log("this is being called");
  const res = await axios.get(`${config.HOST}/user/${username}`);
  return res.data.length > 0;
}
