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
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    success: false,
    error: ''
  })
  
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  
  // google sign-in
  const handleGoogleSignIn = () => {
    firebase.auth().signInWithPopup(googleProvider)
      .then(result => {
        // The signed-in user info.
        const { displayName, photoURL, email } = result.user;
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

  // fb sign in
  const handleFbSignIn = () => {
    firebase.auth().signInWithPopup(fbProvider)
      .then((result) => {
        const user = result.user;
        console.log('fb user after sign in', user);
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        // ...
      });
  }

  // sign out
  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          success: false,
          error: ''
        }
        setUser(signedOutUser);
      })
      .catch(err => {
        // an error happened
        console.log(err)
      })
  }

  // to valid input fields & update user state
  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const passwordLength = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value)
      isFieldValid = passwordLength && passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  //password authentication with firebase
  const handleSubmit = (e) => {
    // create User With Email And Password
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
          const newUserInfo = { ...user };
          newUserInfo.success = true;
          newUserInfo.error = '';
          setUser(newUserInfo);
          updateUserName(user.name);
        })
        .catch((error) => {
          const errorMessage = error.message;
          const newUserInfo = { ...user };
          newUserInfo.error = errorMessage;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }

    // sign In With Email And Password
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
          const newUserInfo = { ...user };
          newUserInfo.success = true;
          newUserInfo.error = '';
          setUser(newUserInfo);
          console.log('sign in user info', userCredential.user);
        })
        .catch((error) => {
          const errorMessage = error.message;
          const newUserInfo = { ...user };
          newUserInfo.error = errorMessage;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    e.preventDefault();
  }

  // Update a user's profile to firebase
  const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then(function () {
      console.log('user name updated successfully.');
    }).catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button>
          : <button onClick={handleGoogleSignIn}>Google Sign In</button>
      }
      <br/><br/>
      <button onClick={handleFbSignIn}>Sign in using Facebook</button>
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
      <div style={{ border: '2px solid purple', width: '50%', margin: '20px auto', padding: '20px' }}>
        <h2>Our own authentication</h2>
        <input type="checkbox" name="newUser" onChange={() => setNewUser(!newUser)} id="" />
        <label htmlFor="newUser">New user sign up</label>
        <br /><br />
        <form onSubmit={handleSubmit}>
          {newUser && <input name='name' onBlur={handleBlur} type="text" placeholder='your name' />}
          <br /><br />
          <input type="text" name='email' onBlur={handleBlur} placeholder='Your email' required />
          <br /> <br />
          <input type="password" name="password" onBlur={handleBlur} id="" placeholder='Your password' required />
          <br /> <br />
          <input type="submit" value={newUser ? 'Sign up' : 'Sign in'} />
        </form>
        <p style={{ color: 'red' }}>{user.error}</p>
        {
          user.success && <p style={{ color: 'green' }}>User {newUser ? 'created' : 'logged in'} successfully.</p>
        }
      </div>
    </div>
  );
}

export default App;
