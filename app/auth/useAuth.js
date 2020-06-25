import { useContext } from "react";
import jwtDecode from "jwt-decode";

import AuthContext from "./context";
import authStorage from "./storage";
import { firebase } from "../config/firebaseConfig";

export default useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logIn = (authToken) => {
    const user = jwtDecode(authToken);
    setUser(user);
    authStorage.storeToken(authToken);
  };

  const logOut = () => {
    setUser(null);
    firebase
      .auth()
      .signOut()
      .then(function () {
        console.log("Sign out successful");
      })
      .catch(function (error) {
        console.log("Sign out failed");
      });
    authStorage.removeToken();
  };

  return { user, logIn, logOut };
};
