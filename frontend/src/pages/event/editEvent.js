import React, { useState, useEffect, useContext} from 'react';
import firebase from '../../firebase/index';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import Loader from 'react-loader-spinner';

export default function EditEvent(props) {
	const eventid = props.history.location.pathname.split('/edit/')[1];
	const [event, setEvent] = useState({})
	const [base64, setBase64] = useState('')
	const [loading, setLoading] = useState(false)
	const [upload, setUpload] = useState(false)

	useEffect(() => {
		if(!props.location.query){
			props.history.goBack();
		} else {
			setEvent(props.location.query)
			console.log(props.location.query)
		}
	}, [])

	const handleSubmit = () => {
		setLoading(true)
		if(upload){
			firebase.storage.ref(`/events/${event.coverImageName}`).put(event.coverImage)
			.then(res => {
				console.log('image updated successfully')
				firebase.db.collection('events').doc(eventid).set({
					...event,
					coverImage: {}
				}).then(resp => {
					props.history.push(`/event/${eventid}`)
				})
				.catch(err => {console.log('db error: ', err)})
			})
			.catch(error => {console.log('storage error: ', error)})
		} else {
			firebase.db.collection('events').doc(eventid).set({
				...event,
				coverImage: {}
			}).then(resp => {
				props.history.push(`/event/${eventid}`)
			})
			.catch(err => {console.log('db error without image: ', err)})
		}
	}

	return(
		<div className='update-event-box'>
		{!loading ?
			<div>
			<div><label className='update-event-label'>event title</label></div>
			<input
				type='text'
				className='update-event-input'
				name='event title'
				value={event.name}
				onChange={(e) => {
					setEvent({
						...event,
						name: e.target.value
					})
				}}
			/>
			<div><label className='update-event-label'>entry fee</label></div>
			<input
				type='number'
				className='update-event-input'
				name='entry fee'
				value={event.entryFee}
				onChange={(e) => {
					setEvent({
						...event,
						entryFee: e.target.value
					})
				}}
			/>
			{event.oneDay ?
				<div>
					<div className='update-event-label'><label>held on</label></div>
					<input
						type='date'
						className='update-event-input'
						name='entry fee'
						value={event.timeStamp ? event.timeStamp.heldOn : null}
						onChange={(e) => {
							setEvent({
								...event,
								timeStamp: {
									...event.timeStamp,
									heldOn: e.target.value,
									postedOn: Date.now()
								}
							})
						}}
					/>
				</div>
				:
				<div>
					<div><label className='update-event-label'>start date</label></div>
					<input
						type='date'
						className='update-event-input'
						name='entry fee'
						value={event.timeStamp ? event.timeStamp.heldOn : null}
						onChange={(e) => {
							setEvent({
								...event,
								timeStamp: {
									...event.timeStamp,
									heldOn: e.target.value
								}
							})
						}}
					/>
					<div><label className='update-event-label'>end date</label></div>
					<input
						type='date'
						className='update-event-input'
						name='entry fee'
						value={event.timeStamp ? event.timeStamp.finishedOn : null}
						onChange={(e) => {
							setEvent({
								...event,
								entryFee: e.target.value
							})
						}}
					/>
				</div>
			}
			<div><label className='update-event-label'>description</label></div>
			<textarea
				rows='10'
				className='update-event-input'
				name='description'
				value={event.description}
				onChange={(e) => {
					setEvent({
						...event,
						description: e.target.value
					})
				}}
			/>
			{!upload ?
				<div className='update-event-input' style={{textAlign: 'center'}}>
					<label htmlFor='coverImage'><FontAwesomeIcon icon={faUpload}/> change cover image</label>
					<input
						style={{display: 'none'}}
						type='file'
						accept='.jpg, .png, .jpeg'
						id='coverImage'
						onChange={(e) => {
							setUpload(true)
							const file = e.target.files[0];
							const reader = new FileReader();
							reader.readAsDataURL(file);
					        reader.addEventListener('load', () => {
					        	setBase64(reader.result);
					        });
					        var arr = event.name.split(' ');
							var eventName = arr.toString();
							var ext = file.name.split('.');
							var extension = ext[ext.length-1]
							setEvent({
								...event,
								coverImageName: `${eventName}.${extension}`,
								coverImage: file
							})
						}}
					/>
				</div>
				:
				<div className='update-event-input'>
					 <img width='100%' src={base64} />
					 <p>image uploaded successfully</p>
				</div>
			}
			<div><label className='update-event-label'>venue</label></div>
			<input
				className='update-event-input'
				name='venue'
				value={event.venue}
				onChange={(e) => {
					setEvent({
						...event,
						venue: e.target.value
					})
				}}
			/>
				<button
					className='update-event-submit'
					onClick={handleSubmit}
				>update changes</button>
			</div>
			:
			<div style={{width: '50%', margin: '50px auto', textAlign: 'center'}}>
				<Loader
			        type="ThreeDots"
			        color="#ff0033"
			        height={100}
			        width={100}
			        timeout={10000} //10 secs
			    />
			</div>
		}
		</div>
	)
}