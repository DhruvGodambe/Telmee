import React, {useState, useEffect, useContext} from 'react';
import {globalContext} from '../../globalContext';
import firebase from '../../firebase/index';

export default function RegisterEvent(props) {
	const [event, setEvent] = useState({})
	const [user, setUser] = useState({})
	const {currentUser} = useContext(globalContext);
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
			registeredUsers: [
				...event.registeredUsers, 
				{
					...user,
					id: currentUser.id
				}
			]
		}).then(res => {
			firebase.db.collection('users').doc(currentUser.id).update({
				registeredEvents: [...currentUser.data.registeredEvents, eventid]
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
									<div className='register-form-sub-div'>
										<p className='register-form-label'>{val.name}</p>
										<select 
											required
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
								return (
									<div className='register-form-sub-div'>
										<p className='register-form-label'>{val.name}</p>
										<input
											required
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
						})}
						<button className='register-form-submit' type="submit">submit</button>
					</form>
				</div>
				:
				null
			}
		</div>
	)
}