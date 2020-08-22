import React, { useState } from 'react';
import './editUser.css';
import firebase from '../../firebase/index';

export default function EditUser(props) {
	const [contact, setContact] = useState('');

	function handleSubmit(e) {
		e.preventDefault();
		const userid = window.location.href.split('/edit/')[1];
		firebase.db.collection('users').doc(userid).update({
			contact,
			attendedEvents: [],
			registeredEvents: []
		}).then(result => {
			props.history.push(`/user/${userid}`)
		})
	}

	return(
		<div className='edit-user'>
			<h2>enter contact number</h2>
			<form className='edit-user-form' onSubmit={handleSubmit}>
			
				<div style={{textAlign: 'left'}}>
					<label className='update-event-label'>contact number</label>
				</div>
				<input
					type='text'
					className='update-event-input'
					name='contact'
					placeholder='+91'
					onChange={(e) => {
						setContact(e.target.value)
					}}
				/>				
				<button
					style={{
						width: '50%',
						fontSize: '20px',
						padding: '5px',
						margin: '10px auto'
					}}
					type='submit'>submit</button>
			</form>
		</div>
	)
}