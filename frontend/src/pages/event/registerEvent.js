import React, {useState, useEffect, useContext} from 'react';
import {globalContext} from '../../globalContext';
import firebase from '../../firebase/index';
import Loader from 'react-loader-spinner';

export default function RegisterEvent(props) {
	const [event, setEvent] = useState({})
	const [user, setUser] = useState({})
	const {currentUser} = useContext(globalContext);
	const [loading, setLoading] = useState(false);
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
		e.preventDefault();
		firebase.db.collection('events').doc(eventid).update({
			registeredUsers: firebase.firebase.firestore.FieldValue.arrayUnion({
				...user,
				id: currentUser.id
			})
		}).then(res => {
			firebase.db.collection('users').doc(currentUser.id).update({
				registeredEvents: firebase.firebase.firestore.FieldValue.arrayUnion(eventid)
			})
			.then(rsp => {
				props.history.push({
					pathname: `/event/${eventid}`,
					query: 'registered'
				})
			})
		})
	}
	
	return(
		<div>
			<h1 className='create-event-box'>Registeration Form</h1>
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
											{val.options.map((opt, index) => <option>{opt}</option>)}
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
														await firebase.storage.ref(`/user-files/${val.name}-${currentUser.id}.${imageName}`).put(e.target.files[0])
														console.log("uploaded")
														
														await firebase.storage.ref(`/user-files/${val.name}-${currentUser.id}.${imageName}`).getDownloadURL()
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
								color="#ff0033"
								height={100}
								width={100}
								timeout={10000} //10 secs
							/>
							:
							null
						}
						<button
							disabled={loading}
							className='register-form-submit'
							type="submit">submit</button>
					</form>
				</div>
				:
				null
			}
		</div>
	)
}