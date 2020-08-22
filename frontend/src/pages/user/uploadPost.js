import React, { useState, useEffect, useContext} from 'react'
import {globalContext} from '../../globalContext';
import firebase from '../../firebase/index';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

export default function UploadPost(props) {
	const [post, setPost] = useState({})
	const {currentUser} = useContext(globalContext);
	const [base64, setBase64] = useState('')
	const [selectedEvent, setSelectedEvent] = useState({})
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if(props.location.query){
			setSelectedEvent(props.location.query.selectedEvent)
			setPost({
				...post,
				eventName: props.location.query.selectedEvent.name,
				eventid: props.location.query.selectedEvent.id
			})
		} else {
			props.history.goBack()
		}
	}, [])

	const handleSubmit = () => {
		const date = Date.now()
		setLoading(true)
		setPost({
			...post,
			likes: 0,
			postedOn: date,
			user: currentUser.data.name,
			userid: currentUser.id
		})
		firebase.storage.ref(`/posts/${post.imageName}`).put(post.imageFile)
		.then(res => {
			firebase.db.collection('users').doc(currentUser.id).update({
				posts: firebase.firebase.firestore.FieldValue.arrayUnion({
					...post,
					imageFile: {},
					likes: 0,
					postedOn: date,
					user: currentUser.data.name,
					userid: currentUser.id
				})
			}).then(resp => {
				firebase.db.collection('events').doc(post.eventid).update({
					posts: firebase.firebase.firestore.FieldValue.arrayUnion({
						...post,
						imageFile: {},
						likes: 0,
						postedOn: date,
						user: currentUser.data.name,
						userid: currentUser.id
					})
				}).then(response => {
					window.location.reload()
				})
			})
		})
	}

	return(
		<div>
			<input
				name='uploadPost'
				id='uploadPost'
				style={{display: 'none'}}
				type='file'
				className='create-event-file'
				accept='.jpg, .jpeg, .png'
				onChange={(e) => {
					var file = e.target.files[0]
					const reader = new FileReader();
					reader.readAsDataURL(file);
			        reader.addEventListener('load', () => {
			        	setBase64(reader.result);
			        });
					var postName = currentUser.id + '-' + Date.now().toString();
					var extension = file.name.split('.')[1];
			        setPost({
			        	...post,
			        	imageFile: file,
			        	imageName: `${postName}.${extension}`
			        })
				}}
			/>
			<h2 className='committee-title'>{selectedEvent.name}</h2>
			{base64 !== '' ?
				<div style={{color: 'black'}} className='create-event-input'>
					<img width='100%' src={base64} />							
				</div>
				:
				<div className='create-event-input'>
					<FontAwesomeIcon icon={faUpload} style={{margin: '0 10px'}}/>
					<label htmlFor='uploadPost'>
						upload photo
					</label>
				</div>
			}
			<div>
				<textarea
					className='create-event-input'
					type='text'
					rows='5'
					placeholder='description'
					onChange={(e) => {
						setPost({
							...post,
							description: e.target.value
						})
					}}
				/>
			</div>
			<div>
				<button 
					style={{
						fontSize: '20px',
						padding: '10px',
						width: '30%',
						margin: '10px auto'
					}}
					onClick={handleSubmit}
				>post</button>
			</div>
		</div>
	)
}