import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAYVQnRZZuvcCIjGvNbvspKstLjpXCRhfw",
    authDomain: "cuadernofriki.firebaseapp.com",
    projectId: "cuadernofriki",
    storageBucket: "cuadernofriki.firebasestorage.app",
    messagingSenderId: "1068489135368",
    appId: "1:1068489135368:web:d7dac2089943ec2d3288bd",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

export { db };