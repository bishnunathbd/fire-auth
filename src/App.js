import './App.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// Add the Firebase products that you want to use
import "firebase/auth";
import firebaseConfig from './firebase.config';

// Initialize Firebase
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  // google sign-in
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const handleGoogleSignIn = () => {
    firebase.auth()
      .signInWithPopup(googleProvider)
      .then(result => {
        const {displayName, photoURL, email} = result.user;
        console.log(displayName, email, photoURL);
      })
  }


  return (
    <div className="App">
      <button onClick={handleGoogleSignIn}>Google Sign In</button>
    </div>
  );
}

export default App;
