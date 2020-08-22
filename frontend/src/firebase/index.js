import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

firebase.initializeApp({
  apiKey: "AIzaSyClg8Iepkq3Dq-MtYgfYLZrBU2mcW3v8us",
  authDomain: "telmee-6635e.firebaseapp.com",
  databaseURL: "https://telmee-6635e.firebaseio.com",
  projectId: "telmee-6635e",
  storageBucket: "telmee-6635e.appspot.com",
  messagingSenderId: "815728072032",
  appId: "1:815728072032:web:e8481de595ffb2af7eba05",
  measurementId: "G-F46ZNW3V40"
});

let db = firebase.firestore();

let storage = firebase.storage();

let auth = firebase.auth();
let provider = new firebase.auth.GoogleAuthProvider();

export default {
	firebase, db, storage, auth, provider
}