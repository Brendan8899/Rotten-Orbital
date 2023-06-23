import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCTa6ccviGAU1dQWDnmcI4exohFsGHYQ3M",
  authDomain: "rotten-orbital.firebaseapp.com",
  projectId: "rotten-orbital",
  storageBucket: "rotten-orbital.appspot.com",
  messagingSenderId: "725065665779",
  appId: "1:725065665779:web:6bdb0d5311ffd699033b86",
  measurementId: "G-2695DZNVHZ"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const db = getFirestore(app);