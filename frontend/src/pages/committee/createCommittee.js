import React, { useState, useEffect, useContext } from 'react';
import bg from '../../images/bg3.png'
import firebase from '../../firebase/index'
import {globalContext} from '../../globalContext';
import Loader from 'react-loader-spinner';
import Cookies from 'js-cookie';
import Editors from '../../components/DraftjsEditor';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

export default function CreateCommittee(props){
	const [committee, setCommittee] = useState({})
	const [upload, setUpload] = useState(false)
	const [base64, setBase64] = useState('')
	const {currentUser, setCurrentUser} = useContext(globalContext)
	const [loading, setLoading] = useState(false)
	const [description, setDescription] = useState({})

	useEffect(() => {
		window.scrollTo(0, 0)
		if(!Cookies.get('userID')){
			props.history.push('/login')
		}
	}, [])

	const handleSubmit = () => {
		if(committee.coverImage){
			firebase.storage.ref(`/committees/${committee.coverImageName}`).put(committee.coverImage)
			.then(res => {
				setCommittee({
					...committee,
					coverImage: {},
					members: [{id: currentUser.id, position: 'leader'}],
					moreImages: {},
					description: description,
					events: []
				})
				firebase.db.collection('committees').add({
					...committee,
					coverImage: {},
					members: [{id: currentUser.id, position: 'leader'}],
					moreImages: {},
					description: description,
					events: []
				}).then(result => {
					firebase.db.collection('users').doc(currentUser.id).update({
						committee: firebase.firebase.firestore.FieldValue.arrayUnion({
							id: result.id,
							name: committee.name,
							position: 'leader'
						})
					})
					.then(response => {
						props.history.push(`/committee/${result.id}`)
					})
				})
				.catch(err => {console.log('firestore error: ', err)})
			})
			.catch(err => {console.log('storage error: ', err)})
		} else {
			setCommittee({
				...committee,
				coverImage: {},
				members: [{id: currentUser.id, position: 'leader'}],
				moreImages: {},
				events: [],
				description: description
			})
			firebase.db.collection('committees').add({
				...committee,
				coverImage: {},
				members: [{id: currentUser.id, position: 'leader'}],
				moreImages: {},
				events: [],
				description: description
			}).then(result => {
				firebase.db.collection('users').doc(currentUser.id).update({
					committee: firebase.firebase.firestore.FieldValue.arrayUnion({
						id: result.id,
						name: committee.name,
						position: 'leader'
					})
				})
				.then(response => {
					props.history.push(`/committee/${result.id}`)
				})
			})
			.catch(err => {console.log('firestore error: ', err)})
		}
	}

	return(
		<div className='create-event-box'>
			{!loading ?
				<div>
					<div style={{width: '100%', margin: '0', backgroundImage: `url(${bg})`, height: '180px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}} >
						<br/>
						<br/>
						<h2 style={{fontSize: '35px'}}>create a student council</h2>
					</div>
					<form className='create-event-form'>
						<input
							name='name'
							placeholder='organization name'
							type='text'
							required
							onChange={(e) => {
								setCommittee({
									...committee,
									name: e.target.value
								})
							}}
							className='create-event-input'
						/>
						{upload ?
							<div className='create-event-input'>
								image uploaded   <FontAwesomeIcon icon={faCheck} />
								<img className='create-event-image' src={base64} />
								<label htmlFor='coverImage' className='create-event-input'>change image</label>
							</div>
							:
							<div className='create-event-input'>
								<FontAwesomeIcon icon={faUpload} style={{margin: '0 10px'}}/>
								<label htmlFor='coverImage'>	
									add cover image for your event
								</label>
							</div>
						}
						<input
							name='coverImage'
							id='coverImage'
							type='file'
							style={{display: 'none'}}
							accept='.jpg, .jpeg, .png'
							onChange={(e) => {
								setUpload(true)
								var file = e.target.files[0]
								const reader = new FileReader();
								reader.readAsDataURL(file);
						        reader.addEventListener('load', () => {
						        	setBase64(reader.result);
						        });
						        var arr = committee.name.split(' ');
								var committeeName = arr.toString();
								var extension = file.name.split('.')[1];
								setCommittee({
									...committee,
									coverImage: file,
									coverImageName: `${committeeName}.${extension}`
								})
							}}
							className='create-event-file'
						/>
						<div style={{width: "85%", margin: "10px auto"}}>
							<Editors description={description} setDescription={setDescription} />
						</div>
						<button
							type='button'
							style={{
								width: '30%', 
								margin: '10px auto', 
								padding: '5px',
								fontSize: '20px'
							}}
							onClick={handleSubmit}
						>create</button>
					</form>
				</div>
				:
				<div style={{margin: '30% auto'}}>
					<Loader
				        type="ThreeDots"
				        color="#ff0033"
				        height={100}
				        width={100}
				        timeout={10000} //3 secs
				    />
			    </div>
			}
		</div>
	)
}