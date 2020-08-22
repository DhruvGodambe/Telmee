import React, { useState, useContext, useEffect, useRef } from 'react';
import {globalContext} from '../../globalContext';
import firebase from '../../firebase/index';
import Loader from 'react-loader-spinner';
import './userEditProfile.css';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ImgDropAndCrop from '../../components/ImgDropAndCrop';
import {Link, Redirect} from 'react-router-dom'; 

export default function UserEditProfile(props) {
	const {currentUser, setCurrentUser} = useContext(globalContext);
	const [name, setName] = useState('')
	const [contact, setContact] = useState('')
	const [description, setDescription] = useState('')
	const [src, setSrc] = useState('')
	const [display, setDisplay] = useState(false)
	const [popup, setPopup] = useState(false);
	const imageRef = useRef();
	const [userImage, setUserImage] = useState('')
	const [crop, setCrop] = useState({aspect: 1})
	const [imageObject, setImageObject] = useState('')
	const editId = window.location.href.split('/userEditProfile/')[1]
	useEffect(() => {
		if(currentUser.data){
			setName(currentUser.data.name)
			setContact(currentUser.data.contact)
			setDescription(currentUser.data.description)
		}
	}, [currentUser])

	const handleSubmit = (e) => {
		e.preventDefault();

		firebase.db.collection('users').doc(currentUser.id).update({
			'name': name,
			'contact': contact,
			'description': description
		}).then(res => {
			setCurrentUser({
				...currentUser,
				data: {
					...currentUser.data,
					name: name,
					contact: contact,
					description: description
				}
			})
			props.history.push(`/user/${currentUser.id}`)
			
		})
		.catch(err => {
			console.log('error: ', err)
		})
		console.log('name: ', name)
		console.log('contact: ', contact)
		console.log('user: ', currentUser.id)
	}

	return(
		<div style={{
			width: '90%',
			margin: '0 auto',
			textAlign: 'center'
		}}>
			<Popup popup={popup} setPopup={setPopup} userImage={userImage}/>
			{currentUser.data && currentUser.id == editId ? 
				<form  onSubmit={handleSubmit}>
					<div style={{width: '80%', margin: '10px auto'}}>
						<div style={{textAlign: 'left', paddingLeft: '10px'}}><label className='update-event-label'>full name</label></div>
						<input
							type='text'
							className='update-event-input'
							name='name'
							value={name}
							onChange={(e) => {
								setName(e.target.value)
							}}
						/>
						<div style={{textAlign: 'left', paddingLeft: '10px'}}><label className='update-event-label'>contact number</label></div>
						<input
							type='text'
							className='update-event-input'
							name='name'
							value={contact}
							onChange={(e) => {
								setContact(e.target.value)
							}}
						/>
						<div style={{textAlign: 'left', paddingLeft: '10px'}}><label className='update-event-label'>description</label></div>
						<textarea
							type='text'
							className='update-event-input'
							name='name'
							rows='5'
							value={description}
							onChange={(e) => {
								setDescription(e.target.value)
							}}
						/>
					</div>
				<button
					style={{margin: '0 auto'}}
					className='update-event-submit'
					type='submit'>change</button>
				</form>
			:
			<Loader
		        type="ThreeDots"
		        color="#ff0033"
		        height={100}
		        width={100}
		        timeout={10000} //10 secs
		    />
			}
		</div>
	)
}

const Popup = (props) => {
	const {popup, setPopup, userImage} = props;

	useEffect(() => {
		console.log('popup props', props);
	}, [])

	function deletePost(e) {
		alert('delete the post?');
		setPopup(false);
	}

	return(
		<div>
			{ popup ?
				<div className='edit-main-popup'>
					<ImgDropAndCrop/>
					<button onClick={() => {
						setPopup(false);
						console.log('userImage', userImage);
					}}>close</button>
				</div>
				:
				null
			}
		</div>
	)
}