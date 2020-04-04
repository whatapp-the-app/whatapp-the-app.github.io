import React from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './firebase'
import LandingPage from './components/LandingPage'

function googleLogin(){
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(result => {
    const user = result.user;
    console.log(user)
    alert("hello "+user.displayName);
  })
}

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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <LandingPage></LandingPage>
        <button onClick={googleLogin}>Log in with gmail</button>
        <button onClick={addRecord}>add record</button>
        <button onClick={getRecords}>get record</button>
      </header>
    </div>
  );
}

export default App;
