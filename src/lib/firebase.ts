import firebase from "firebase/app";
import { getFirestore } from "firebase/firestore";
import "firebase/auth";
import { firebaseConfig } from "../config";

if (!firebase.apps.length) {
  const app = firebase.initializeApp(firebaseConfig);
  const database = getFirestore(app);
}

export default firebase;
