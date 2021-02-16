import React, {useState, useEffect, useContext} from 'react';
import {globalContext} from '../../globalContext';
import firebase from '../../firebase/index';

import { v1 as uuidv1 } from 'uuid';
import Loader from 'react-loader-spinner';
import Cookies from 'js-cookie';

export default function RegisterEvent(props) {
	const [event, setEvent] = useState({})
	const [user, setUser] = useState({})
	const {currentUser} = useContext(globalContext);
	const [loading, setLoading] = useState(false);
	const [loading2, setLoading2] = useState(false);
	const [error, setError] = useState("")
	const eventid = props.history.location.pathname.split('register/')[1];

	useEffect(() => {
		window.scrollTo(0,0)
		if(!props.location.query){
			props.history.goBack()
		} else {
			setEvent(props.location.query)
		}
	}, [])

	const handleSubmit = (e) => {
		setLoading2(true)
		e.preventDefault();
		try{
			firebase.db.collection('events').doc(eventid).update({
				registeredUsers: firebase.firebase.firestore.FieldValue.arrayUnion(user)
			}).then(res => {
				var registeredEvents = Cookies.get("telmee-registered-events");
				if(registeredEvents){
					Cookies.set("telmee-registered-events",[...registeredEvents, eventid]);
				} else {
					Cookies.set("telmee-registered-events",[eventid]);
				}
				props.history.push({
					pathname: `/event/${eventid}`,
					query: 'registered'
				})
			})
		} catch(err) {
			setError("unknown error occured during submission. Please try registering again")
		}
	}
	
	return(
		<div className="register-for-event-container">
			<div className="register-for-event-title"></div>
			<div className="register-for-event-body">
				<h1 className='create-event-box'>{event.name}</h1>
				<ErrorPopup error={error} setError={setError} />
				{event.formTemplate ?
					<div className='register-form-div'>
						<form onSubmit={handleSubmit}>
							{event.formTemplate.map((val, ind) => {
								if(val.type == 'options'){
									return (
										<div key={ind} className='register-form-sub-div'>
											<p className='register-form-label'>{val.name}</p>
											<select 
												required={val.required}
												onChange={(e) => {
													var obj = Object.assign({}, user)
													obj[val.name] = e.target.value
													setUser(obj)
												}}
												className='register-form-input'
												>
												<option></option>
												{val.options.map((opt, index) => <option key={index}>{opt}</option>)}
											</select>
										</div>
									)
								} else {
									if(val.type == 'note'){
										var str = '';
										val.name.split(" ").forEach(val => {
											if(val.includes("https://")){
												var temp = `<a href="${val}">${val}</a>`;
												str = str.concat(temp)
											} else { str = str.concat(val + " ")}
										})
										return (
											<div key={ind} className='register-form-sub-div'>
												<p className="register-form-note" dangerouslySetInnerHTML={{__html: str}}></p>
											</div>
										)
									} else {
										if(val.type == "file"){
											return (
												<div key={ind} className='register-form-sub-div'>
													<p className='register-form-label'>{val.name}</p>
													<input
														type={val.type}
														required={val.required}
														placeholder={val.name}
														onChange={async (e) => {
															setLoading(true);
															let imageNameArr = e.target.files[0].name.split(".");
															let imageName = imageNameArr[imageNameArr.length - 1];
															let random_id = uuidv1();
															await firebase.storage.ref(`/user-files/${random_id}.${imageName}`).put(e.target.files[0])
															console.log("uploaded")
															
															await firebase.storage.ref(`/user-files/${random_id}.${imageName}`).getDownloadURL()
															.then(url => {
																var obj = Object.assign({}, user)
																obj[val.name] = url;
																console.log(url)
																setUser(obj);
																setLoading(false);
															})
														}}
														className='register-form-input'
														/>
												</div>
											)	
										} else {
											// for type number and text
											return (
												<div key={ind} className='register-form-sub-div'>
													<p className='register-form-label'>{val.name}</p>
													<input
														required={val.required}
														type={val.type}
														placeholder={val.name}
														onChange={(e) => {
															var obj = Object.assign({}, user)
															obj[val.name] = e.target.value
															setUser(obj)
														}}
														className='register-form-input'
														/>
												</div>
											)
										}
									}
								}
							})}
							{event.organizingCommittee.id == "Kg0Dm9H4l3dUeZPj3ZAS" ?
								<div style={{display: 'flex', alignItems: 'center', textAlign: 'left', width: '90%', margin: '10px auto'}}>
									<input type="checkbox" required  />
									<p>I AGREE TO COMPLETE THE WORKSHOP AND RECEIVE THE CERTIFICATE AFTER COMPLETION OF MY PROJECT</p>
								</div>
								:
								null
							}
							{loading ?
								<Loader
									type="ThreeDots"
									color="#55887C"
									height={100}
									width={100}
									timeout={1000000} //10 secs
								/>
								:
								null
							}
							<button
								disabled={loading || loading2}
								className='register-form-submit'
								type="submit">submit</button>
							{loading2 ?
								<Loader
									type="TailSpin"
									color="#55887C"
									height={70}
									width={70}
									timeout={1000000} //10 secs
								/>
								:
								null
							}
						</form>
					</div>
					:
					null
				}
			</div>
		</div>
	)
}

const ErrorPopup = ({error, setError}) => {
	return(
		<div>
			{error !== "" ?
				<div className="main-popup">
					<p>{error}</p>
					<button onClick={() => {setError(""); window.location.reload()}}>OK</button>
				</div>
				:
				null
			}
		</div>
	)
}