import * as firebase from "firebase";
import { useContext } from "react";
// Optionally import the services that you want to use
//import "firebase/auth";
import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";

import AuthContext from "../auth/context";

class FirebaseSDK {
  constructor() {
    if (!firebase.apps.length) {
      //avoid re-initializing
      firebase.initializeApp({
        apiKey: "AIzaSyAoNnT8GMQGegGSC35jXt7WhFPnNqwLcuM",
        authDomain: "new-to-you-bb7f6.firebaseapp.com",
        databaseURL: "https://new-to-you-bb7f6.firebaseio.com",
        projectId: "new-to-you-bb7f6",
        storageBucket: "new-to-you-bb7f6.appspot.com",
        messagingSenderId: "275739636289",
        appId: "1:275739636289:web:238d33178b4bb322d54cc0",
        measurementId: "G-QXB2X1683C",
      });
    }
  }
  // login = async (user, success_callback, failed_callback) => {
  //   await firebase
  //     .auth()
  //     .signInWithEmailAndPassword(user.email, user.password)
  //     .then(success_callback, failed_callback);
  // };
  login = async (user, success_callback, failed_callback) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback);
  };
}
const firebaseSDK = new FirebaseSDK();
export default firebaseSDK;
