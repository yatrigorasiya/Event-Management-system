import { createContext, useContext, useEffect } from "react";
import { useState } from "react";

export const Authcontext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(null);

  const authoriztiontoken = token;

  //store token functionality:-
  const storetokenInLs = (storetoken) => {
    setToken(storetoken);

    return localStorage.setItem("token", storetoken);
  };

  //logout functionality:-

  let isloggin = !!token;

  const Logoutuser = () => {
    setToken("");
    setUser("");
    setRole(null);

    return localStorage.removeItem("token");
  };

  //user data get currently login:-

  const userAuthentication = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/api/auth/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authoriztiontoken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("userData", data.userdata);
        setUser(data.userdata);
        setRole(data.userdata.role);
        setIsLoading(false);
      } else {
        console.log("erro featching");
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error featching user data");
    }
  };

  useEffect(() => {
    if (token) {
      userAuthentication();
    }
  }, [token]);
  return (
    <Authcontext.Provider
      value={{
        storetokenInLs,
        Logoutuser,
        isloggin,
        user,
        role,
        userAuthentication,
      }}
    >
      {children}
    </Authcontext.Provider>
  );
};

export const useAuth = () => {
  const authcontextvalue = useContext(Authcontext);
  if (!authcontextvalue) {
    throw new Error("useAuth user outside");
  }
  return authcontextvalue;
};
