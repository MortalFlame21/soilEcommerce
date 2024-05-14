// Everything related to storing and grabbing user/users

import { emptyCart } from "./cart";

const USER_LIST_KEY = "__USERS";
const USER_KEY = "__USER";

export type User = {
  id: number;
  username: string;
  email: string;
  hash: string;
  date_joined: Date;
};

// we store users in an object for constant time user access
// we will be assuming that UserList could be used and will need some checking, thus try-catch blocks
// we will assume that User in UserList will be of right type
export type UserList = { [key: string]: User };

export function getUserList(): UserList {
  // using this as return could be an invalid object value
  try {
    return JSON.parse(localStorage.getItem(USER_LIST_KEY) || "{}");
  } catch {
    return {};
  }
}

// NOTE: use User?.[field] when using the fields as User could be null
export function getUser(email: string): User | undefined {
  // using this as UserList in localStorage might be different type
  try {
    return getUserList()[email] || undefined;
  } catch {
    return undefined;
  }
}

export function addUser(u: User) {
  const storedUsers = getUserList();
  const newUsers = { ...storedUsers, [u.email]: u };
  localStorage.setItem(USER_LIST_KEY, JSON.stringify(newUsers));
}

export function userExists(email: string): boolean {
  return !!getUser(email);
}

export async function saveLoggedIn(user: User): Promise<void> {
  sessionStorage.clear(); // remove other possibly added key/values
  sessionStorage.setItem(USER_KEY, JSON.stringify(user || {}));
}

export function getLoggedIn(): User | undefined {
  // we will assume that if stored and is object type it has right properties
  return JSON.parse(sessionStorage.getItem(USER_KEY) || "null"); // using null here JSON value cannot be undefined
}

export function logoutUser(): void {
  sessionStorage.removeItem(USER_KEY);
}

export function deleteUser(email: string): void {
  // todo:
  // delete user diet plan
  const users = getUserList();
  delete users[email];
  emptyCart(email);
  localStorage.setItem(USER_LIST_KEY, JSON.stringify(users));
}

// refactoring
// use async functions?

// {"t@t.com":{"username":"username","email":"t@t.com","password":"pswdWORK1!"},"t@t.co":{"username":"username","email":"t@t.co","password":"passWORD1!_"},"k@k.k":{"username":"my name is my name","email":"k@k.k","password":"pswdWORK1!"},"test":{"username":"test","email":"test","password":"test"},"lol@lol.com":{"username":"loluser","email":"lol@lol.com","password":"passWORD1!_"}}
