import './App.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// Add the Firebase products that you want to use
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

// Initialize Firebase
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })

  // google sign-in
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const handleGoogleSignIn = () => {
    firebase.auth()
      .signInWithPopup(googleProvider)
      .then(result => {
        // The signed-in user info.
        const {displayName, photoURL, email} = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        };
        setUser(signedInUser);
      })
      .catch(err => {
        // Handle Errors here.
        console.log(err);
        console.log(err.message);
      })
  }

  // sign out
  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: ''
        }
        setUser(signedOutUser);
      })
      .catch(err => {
        // an error happened
        console.log(err)
      })
  }

  const handleBlur = (e) => {
    console.log(e.target.name, e.target.value);
  }

  const handleSubmit = () => {

  }

  return (
    <div className="App">
      { 
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button>
        : <button onClick={handleGoogleSignIn}>Google Sign In</button>
      }
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      <h2>Our own authentication</h2>
      <form onSubmit={handleSubmit} style={{border: '2px solid purple'}}>
        <input type="text" name='email' onBlur={handleBlur} placeholder='Your email' required/>
        <br/> <br/>
        <input type="password" name="password" onBlur={handleBlur} id="" placeholder='Your password' required/>
        <br/> <br/>
        <input type="submit" value="Submit"/>
      </form>
      
    </div>
  );
}

export default App;
