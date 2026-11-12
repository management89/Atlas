// Firebase settings for Avenues Student Hub.
//
// 1. In the Firebase console, open Project settings → General → Your apps → Web app,
//    and copy the values from the firebaseConfig snippet into FIREBASE_CONFIG below.
//    These values are meant to be public. Your security rules (firestore.rules) protect the data.
window.FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// 2. After you sign in to the site once, it shows your user ID. Paste it here
//    (and into firestore.rules) so the site knows you are the president.
window.OWNER_UID = "";
