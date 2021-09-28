import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA70LHTnng4gYbwwQpjlwxw4O2Eh8V0oCI",
    authDomain: "twitter-clone-by-lyz.firebaseapp.com",
    projectId: "twitter-clone-by-lyz",
    storageBucket: "twitter-clone-by-lyz.appspot.com",
    messagingSenderId: "527969181886",
    appId: "1:527969181886:web:719931f19f85c1803f7eef",
    measurementId: "G-LFGM5T0R30"
  };
  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const storage = firebase.storage();

  export { 
    db as default,
    storage,
  };
 