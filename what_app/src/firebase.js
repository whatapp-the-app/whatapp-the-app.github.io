import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/analytics'


  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAd1UaiWOZXfYg_Vb_0L3n_VeZCV4JjyLQ",
    authDomain: "what-the-app-73a85.firebaseapp.com",
    databaseURL: "https://what-the-app-73a85.firebaseio.com",
    projectId: "what-the-app-73a85",
    storageBucket: "what-the-app-73a85.appspot.com",
    messagingSenderId: "997468355625",
    appId: "1:997468355625:web:ac77dadcf147fc7f497038",
    measurementId: "G-RMV2RJ41NZ"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  export default firebase