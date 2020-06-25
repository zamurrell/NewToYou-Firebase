import * as firebase from "firebase";
import "@firebase/auth";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAoNnT8GMQGegGSC35jXt7WhFPnNqwLcuM",
  authDomain: "new-to-you-bb7f6.firebaseapp.com",
  databaseURL: "https://new-to-you-bb7f6.firebaseio.com",
  projectId: "new-to-you-bb7f6",
  storageBucket: "new-to-you-bb7f6.appspot.com",
  messagingSenderId: "275739636289",
  appId: "1:275739636289:web:238d33178b4bb322d54cc0",
  measurementId: "G-QXB2X1683C",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
