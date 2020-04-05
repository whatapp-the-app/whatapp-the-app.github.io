import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/analytics'


  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDxeTIq_1J_XJ5poYoXK9nuxiRxTFnrC9I",
    authDomain: "what-app-77240.firebaseapp.com",
    databaseURL: "https://what-app-77240.firebaseio.com",
    projectId: "what-app-77240",
    storageBucket: "what-app-77240.appspot.com",
    messagingSenderId: "67822593873",
    appId: "1:67822593873:web:4aaf3452ac221c6a04d570",
    measurementId: "G-QHM3RGZVZZ"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  export default firebase