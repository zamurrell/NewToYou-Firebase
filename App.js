import { NavigationContainer } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { AppLoading } from "expo";

import AuthContext from "./app/auth/context";
import OfflineNotice from "./app/components/OfflineNotice";
import AppNavigator from "./app/navigation/AppNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import authStorage from "./app/auth/storage";
import { navigationRef } from "./app/navigation/rootNavigation";
import { firebase } from "./app/config/firebaseConfig";

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  // const restoreUser = async () => {
  //   const user = await authStorage.getUser();
  //   if (user) setUser(user);
  // };

  const restoreUser = async () => {
    const usersRef = firebase.firestore().collection("users");
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data();
            setIsReady(true);
            setUser(userData);
          })
          .catch((error) => {
            setIsReady(true);
          });
      } else {
        setIsReady(true);
      }
    });
  };

  if (!isReady) {
    return (
      <AppLoading startAsync={restoreUser} onFinish={() => setIsReady(true)} />
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <OfflineNotice />
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
