import React, { useState, useEffect, useContext} from 'react';
import firebase from '../../firebase/index';
import Editors from '../../components/DraftjsEditor';
import { useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import Loader from 'react-loader-spinner';

export default function EditEvent(props) {
	const eventid = props.history.location.pathname.split('/edit/')[1];
	const history = useHistory();
	const [event, setEvent] = useState({})
	const [base64, setBase64] = useState('')
	const [loading, setLoading] = useState(false)
	const [upload, setUpload] = useState(false)
	const [description, setDescription] = useState({})
	const [externalLink, setExternalLink] = useState([{link: "", description: ""}])

	useEffect(() => {
		if(!props.location.query){
			props.history.goBack();
		} else {
			setEvent(props.location.query)
			setDescription(props.location.query.description)
			if(props.location.query.externalLink?.length > 0){
				setExternalLink(props.location.query.externalLink);
			}
		}
	}, [])

	const handleSubmit = () => {
		setLoading(true)
		const finalExternalLink = externalLink.filter((val) => val.link !== "")
		if(upload){
			firebase.storage.ref(`/events/${event.coverImageName}`).put(event.coverImage)
			.then(res => {
				firebase.db.collection('events').doc(eventid).set({
					...event,
					description: description,
					externalLink: finalExternalLink,
					coverImage: {}
				}).then(resp => {
					props.history.push(`/event/${eventid}`)
				})
				.catch(err => {
					// console.log('db error: ', err)
				})
			})
			.catch(error => {
				// console.log('storage error: ', error)
			})
		} else {
			firebase.db.collection('events').doc(eventid).set({
				...event,
				description: description,
				externalLink: finalExternalLink,
				coverImage: {}
			}).then(resp => {
				props.history.push(`/event/${eventid}`)
			})
			.catch(err => {
				// console.log('db error without image: ', err)
			})
		}
	}

	const handleDelete = () => {
		firebase.db.collection('committees').doc(event.organizingCommittee.id).update({
			events: firebase.firebase.firestore.FieldValue.arrayRemove(eventid)
		}).then(async res => {
			if(event.coverImageName){
				await firebase.storage.ref(`/events/${event.coverImageName}`).delete()
			}
			if(event.media1Name){
				await firebase.storage.ref(`/events/${event.media1Name}`).delete()
			}
			if(event.media2Name){
				await firebase.storage.ref(`/events/${event.media2Name}`).delete()
			}
			// if(event.posts.length > 0){
			// 	event.posts.forEach(async post => {
			// 		await firebase.storage.ref(`/posts/${post.imageName}`).delete()
			// 	})
			// }
			firebase.db.collection('events').doc(eventid).delete()
			.then(resp => {
				history.push("/")
			})
		})
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
			<div className="event-box-oneday" style={{margin: '20px auto'}}>
				<label style={{width: '50%', textAlign: 'right'}}>one day event? </label>
				<div style={{width: '50%', display: 'flex'}}>
					<div className="event-box-binary">
						<input
							type='radio'
							name='oneDay'
							checked={event.oneDay}
							onChange={(e) => {
								if(e.target.value == 'on'){
									setEvent({
										...event,
										oneDay: true
									})
								}
							}}/>yes
					</div>
					<br/>
					<div className="event-box-binary">
						<input
							type='radio'
							name='oneDay'
							checked={!event.oneDay}
							onChange={(e) => {
								if(e.target.value == 'on'){
									setEvent({
										...event,
										oneDay: false
									})
								}
							}} />no
					</div>
				</div>
			</div>
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
						name='start date'
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
						name='end date'
						value={event.timeStamp ? event.timeStamp.finishedOn : null}
						onChange={(e) => {
							setEvent({
								...event,
								timeStamp: {
									...event.timeStamp,
									finishedOn: e.target.value
								}
							})
						}}
					/>
				</div>
			}
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
			{externalLink.map((val, ind) => {
				console.log(val);
				return(
					<div>
						<div><label className='update-event-label'>{`external link ${ind+1}`}</label></div>
						<input
							type="url"
							name={`external_link${ind}`}
							className="update-event-input"
							defaultValue={val.link}
							placeholder={`external link ${ind+1} (optional)`}
							onChange={(e) => {
								var arr = externalLink;
								arr[ind] = {
									...arr[ind],
									link: e.target.value
								}
								setExternalLink(arr);
							}}
						/>
						<div><label className='update-event-label'>{`link ${ind+1} description`}</label></div>
						<textarea
							// type="textarea"
							className="update-event-input"
							name="description1"
							defaultValue={val.description}
							placeholder="description of the link"
							onChange={(e) => {
								var arr = externalLink;
								arr[ind] = {
									...arr[ind],
									description: e.target.value
								}
								setExternalLink(arr);
							}}
						/>
					</div>
				)
			})}
			<button
				type="button"
				style={{
					padding: '10px',
					borderRadius: '5px',
					boxShadow: '0 0 5px grey',
					margin: '10px auto'
				}}
				onClick={() => {
					setExternalLink([
						...externalLink,
						{link: "", description: ""}
					])
				}}>Add another external link</button>
			{event.description ?
				<div style={{width: '100%', margin: '0 auto'}}>
					<Editors raw={event.description} description={description} setDescription={setDescription} />
				</div>
				:
				null
			}
				<button
					className='update-event-submit'
					onClick={handleSubmit}
				>update changes</button>
				<button
					className='update-event-submit'
					style={{marginTop: "50px"}}
					onClick={handleDelete}
				>delete event</button>
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