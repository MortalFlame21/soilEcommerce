import { ReactNode, createContext, useContext, useState } from "react";

import {
  User,
  getUser,
  logoutUser,
  saveLoggedIn,
  getLoggedIn,
} from "../utils/user";

import { emptyCart } from "../utils/cart";

// global user state property, handles easy login and logout
// references used:
// https://ui.dev/react-router-protected-routes-authentication
// https://medium.com/@dennisivy/creating-protected-routes-with-react-router-v6-2c4bbaf7bc1c
// https://www.youtube.com/watch?v=eFPvXGZETiY&ab_channel=CosdenSolutions

type AuthContextProps = {
  user: User | undefined;
  login: (email: string) => void;
  logout: () => void;
};

type Props = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

function useAuth(): AuthContextProps {
  const [user, setUser] = useState<User | undefined>(getLoggedIn());

  const login = (email: string) => {
    saveLoggedIn(email);
    setUser(getUser(email));
  };

  const logout = () => {
    logoutUser();
    setUser(undefined);
    emptyCart(user?.email || "");
  };

  return {
    user,
    login,
    logout,
  };
}

export function AuthProvider({ children }: Props) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function AuthConsumer(): AuthContextProps {
  const auth = useContext(AuthContext);

  if (!auth)
    throw new Error(
      `Error in AuthConsumer, Auth must be undefined, auth ${auth}`
    );

  return auth;
}
