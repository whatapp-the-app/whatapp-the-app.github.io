import React from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './firebase'
import LandingPage from './components/LandingPage'

function getRecords(){
  firebase
    .firestore().collection('communicators')
    .onSnapshot((snapshot)=>{
      const records = snapshot.docs.map((doc)=>({
        id: doc.id,
        ...doc.data()
      }))
      console.log(records)
    })
}

function googleLogin(){
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(result => {
    const user = result.user;
    localStorage.setItem("user",user);
    console.log(user)
    alert("hello "+user.displayName);
  })
}

function addRecord(){
  firebase.firestore().collection('communicators').add({
    name: "skype",
    url: "www.skype.com",
    videos: 2,
    files: false,
    people: 2
  })
}

function App() {

  return (
          <>
          <LandingPage/>
        {/*<button onClick={googleLogin}>Log in with gmail</button>
        <button onClick={addRecord}>add record</button>
  <button onClick={getRecords}>get record</button>*/}
          </>
  );
}

export default App;
