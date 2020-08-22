const functions = require('firebase-functions');
const admin = require("firebase-admin");
const express = require("express");
const app = express();
const cors = require('cors');

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://telmee-6635e.firebaseio.com"
});

app.use(cors())

// app.get('/signin', (req, res) => {
// 	admin.firestore().collection('users').get()
// 	.then(result => {
// 		var users = [];
// 		result.forEach(doc => {
// 			users.push(doc.data())
// 		})
// 		return res.send(users);
// 	})
// 	.catch(err => res.send(err))
// })

app.post('/signin', (req, res) => {
	const userRef = admin.firestore().collection('users');
	userRef.where('email', '==', req.body.email).get()
	.then(async result => {
		let user = {};
		if(!result.empty){
			user = Object.assign({}, {
				data: result.docs[0].data(),
				id: result.docs[0].id
			});
		} else {
			console.log('result empty ? ',result.empty)
			var addeduser = await userRef.add({
				email: req.body.email,
				name: req.body.name,
				profilePicture: req.body.profilePicture,
				registeredEvents: [],
				attendedEvents: [],
				posts: [],
				description: ''
			})
			.then(async newuser => {
				user = await Object.assign({}, {id: newuser.id});
			})
			.catch(err => {console.log(err)})
		}
		return res.send(user);
	})
	.catch(err => {console.log(err)})
})

exports.api = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
