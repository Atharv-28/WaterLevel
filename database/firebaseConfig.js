import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDWCu-Q7mGU1_EBe7cBB_yb0508f5bEHhY",
    authDomain: "waterlevel-d67a3.firebaseapp.com",
    databaseURL: "https://waterlevel-d67a3-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "waterlevel-d67a3",
    storageBucket: "waterlevel-d67a3.appspot.com",
    messagingSenderId: "499911597704",
    appId: "1:499911597704:web:3acc708fd73747ee5dc93d",
    measurementId: "G-XZ1DJXJ22Y"
  };
  



const firebaseApp = initializeApp(firebaseConfig);

export default {firebaseApp};