import React, {useState, useContext} from 'react';
import Cookies from 'js-cookie';
import './login.css';
import Loader from 'react-loader-spinner';

import firebase from '../firebase/index';
import googleLogo from '../images/googleLogo.png';
import {globalContext} from '../globalContext';

export default function UserLogin(props) {
	const {setCurrentUser, setLoggedIn} = useContext(globalContext);
	const [loading, setLoading] = useState(false)

	function googleLogin() {
		setLoading(true)
		firebase.auth.signInWithPopup(firebase.provider)
			.then(result => {
				setCurrentUser({
					data: {
						name: result.user.displayName,
						profilePicture: result.user.photoURL,
						email: result.user.email
					}
				});
				fetch('https://us-central1-telmee-6635e.cloudfunctions.net/api/signin', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						name: result.user.displayName,
						profilePicture: result.user.photoURL,
						email: result.user.email
					})
				})
					.then(response => response.json())
					.then(ret => {
						// console.log(ret);
						// console.log(ret.data)
						if(ret.id){
							setLoggedIn(true);
							Cookies.set('userID', ret.id);
							if(ret.data){
								setCurrentUser({
									data: ret.data,
									id: ret.id
								})
								props.history.push(`/user/${ret.id}`)
							} else {
								props.history.push(`/user/edit/${ret.id}`)
							}
						}
					})
			})
	}

	return (
		<div className='login-container'>
			<h3>you need to be logged in, in order to register on upcoming events, visit other user's profile and much more </h3>
			{!loading ?
				<div className="google" onClick={googleLogin}>
					<div className="logo"><img alt='' src={googleLogo}/></div>
					<div className="text">Login with google</div>
				</div>
				:
				<div
					style={{
						width: '100%',
						textAlign: 'center'
					}}>
					<Loader
				        type="ThreeDots"
				        color="#ff0033"
				        height={100}
				        width={100}
				        timeout={100000} //100 secs
				    />
				</div>
			}
		</div>
	)
}