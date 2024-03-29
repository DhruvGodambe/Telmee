import React, { useState, useContext, useEffect } from 'react';
import {globalContext} from '../../globalContext';
import Cookies from 'js-cookie';
import firebase from '../../firebase/index';
import Editors from '../../components/DraftjsEditor';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Switch from "react-switch";
import Loader from 'react-loader-spinner';
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';

export const PersonalEvent = (props) => {
	const [event, setEvent] = useState({})

	const handleSubmit = () => {
		console.log(event)
	}

	return (
		<form className='create-event-form'>
			<input
				name='name'
				placeholder='event title'
				type='text'
				onChange={(e) => {
					
				}}
				className='create-event-input'
			/>
			<textarea
				name='description'
				placeholder='description'
				type='text'
				rows='5'
				onChange={(e) => {
					
				}}
				className='create-event-input'
			/>
			<input
				name='entryFee'
				placeholder='entry fee'
				type='number'
				onChange={(e) => {
					
				}}
				className='create-event-input'
			/>
			<button
				type='button'
				style={{
					width: '50%', 
					margin: '10px auto', 
					padding: '5px'
				}}
				onClick={handleSubmit}
			>submit</button>
		</form>
	)
}

export const OrganizationEvent = (props) => {
	const [event, setEvent] = useState({eventForm: false})
	const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
	const [popup, setPopup] = useState(false)
	const [loading, setLoading] = useState(false);
	const [submit, setSubmit] = useState(false)
	const [uploaded, setUpload] = useState(false);
	const [base64, setBase64] = useState('')
	const [description, setDescription] = useState({})
	const [oneDay, setOneDay] = useState('')
	const {currentUser, setCurrentUser} = useContext(globalContext);
	const userID = Cookies.get('userID');
	const eventRef = firebase.db.collection('events');
	const [checked, setChecked] = useState(false);
	const [error, setError] = useState("")
	const [externalLink, setExternalLink] = useState([{link: "", description: ""}]);

	useEffect(() => {
		if(userID){
			if(currentUser.id){
				if(currentUser.data.committee){
					if(currentUser.data.committee.length <= 0){
						setPopup(true)
					}
				} else {
					setPopup(true)
				}
			}
		}
	}, [currentUser])

	const handleSubmit = (e) => {
		if(event.name && event.name !== "" && event.organizingCommittee && event.venue && Object.keys(description).length > 0 && event.entryFee && event.timeStamp && Object.keys(event.timeStamp).length > 0 ){
			setLoading(true);
			setEvent({
				...event,
				description: description
			})
			setCurrentUser({
				...currentUser,
				data: {
					...currentUser.data,
					event: event
				}
			})
			const finalExternalLink = externalLink.filter((val) => val.link !== "")
			if(event.coverImage){
	
				firebase.storage.ref(`/events/${event.coverImageName}`).put(event.coverImage)
				.then(response => {
					currentUser.data.committee.forEach(comm => {
						if(event.organizingCommittee.name == comm.name){
							eventRef.add({
								...event,
								organizingCommittee: {
									...event.organizingCommittee,
									id: comm.id
								},
								externalLink: finalExternalLink,
								description: description,
								coverImage: {},
								attendedUsers: [],
								registeredUsers: [],
								posts: []
							}).then(res => {
								firebase.db.collection('committees').doc(comm.id).update({
									events: firebase.firebase.firestore.FieldValue.arrayUnion(res.id)
								})
								.then(resp => {
									if(event.eventForm){
										props.history.push(`/create/eventForm/${res.id}`)
									} else {
										props.history.push(`/event/${res.id}`)
									}
								})
							})
						}
					})
				})
				.catch(err => {console.log('err: ', err)})
			} else {
				currentUser.data.committee.forEach(comm => {
					if(event.organizingCommittee.name == comm.name){
						eventRef.add({
							...event,
							organizingCommittee: {
								...event.organizingCommittee,
								id: comm.id
							},
							externalLink: finalExternalLink,
							description: description,
							coverImage: {},
							attendedUsers: [],
							registeredUsers: [],
							posts: []
						}).then(res => {
							firebase.db.collection('committees').doc(comm.id).update({
								events: firebase.firebase.firestore.FieldValue.arrayUnion(res.id)
							})
							.then(resp => {
								if(event.eventForm){
									props.history.push(`/create/eventForm/${res.id}`)
								}else {
									props.history.push(`/event/${res.id}`)
								}
							})
						})
					}
				})
			}
		} else {
			if(!description || Object.keys(description).length <= 0){
				setError("Description of the event is mandatory")
			}
			if(!event.timeStamp || Object.keys(event.timeStamp).length <= 0){
				setError("Date of the event is mandatory")
			}
			if(!event.venue){
				setError("Venue is mandatory")
			}
			if(!event.entryFee){
				setError("Entry fee for the event is required. If the event is free, write 0 for entry fee")
			}
			if(!event.organizingCommittee){
				setError("Please select an organizing committee")
			}
			if(!event.name || event.name == ""){
				setError("Name of the event is mandatory")
			}
		}
		
	}

	return (
		<form className='create-event-form' onSubmit={handleSubmit}>
			<Popup popup={popup} setPopup={setPopup} {...props} />
			<ErrorPopup error={error} setError={setError} />
			{!loading ? 
			<div>
			<input
				name='eventName'
				placeholder='event name / title'
				type='text'
				required
				onChange={(e) => {
					setEvent({
						...event,
						name: e.target.value,
					})
				}}
				className='create-event-input'
			/>

			<select
				className='create-event-input'
				onChange={(e) => {
					setEvent({
						...event,
						organizingCommittee: {
							name: e.target.value,
						}
					})
				}}
			>
				<option value=''>select organization</option>
				{currentUser.data ? 
					currentUser.data.committee ?
						currentUser.data.committee.map((val, ind) => (
							<option key={ind}>{val.name}</option>
						))
					:
						null
				:
					null
				}
			</select>

			<input
				name='entryFee'
				required
				placeholder='entry fee'
				type='number'
				onChange={(e) => {
					setEvent({
						...event,
						entryFee: e.target.value
					})
				}}
				className='create-event-input'
			/>
			{uploaded ? 
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
				accept='.jpg, .jpeg, .png'
				onChange={(e) => {
					setUpload(true)
					var file = e.target.files[0]
					const reader = new FileReader();
					reader.readAsDataURL(file);
			        reader.addEventListener('load', () => {
			        	setBase64(reader.result);
			        });
			        var arr = event.name.split(' ');
					var eventName = arr.toString();
					var extension = file.name.split('.')[1];
			        setEvent({
						...event,
						coverImage: file,
						coverImageName: `${eventName}.${extension}`
					})
				}}
				className='create-event-file'
			/>
			<div className="event-box-oneday">
				<label style={{width: '50%'}}>one day event? </label>
				<div style={{width: '50%', display: 'flex'}}>
					<div className="event-box-binary">
						<input
							type='radio'
							name='oneDay'
							required
							onChange={(e) => {
								if(e.target.value == 'on'){
									setOneDay('true');
								}
							}}
							name='oneDay'/>yes
					</div>
					<br/>
					<div className="event-box-binary">
						<input
							type='radio'
							name='oneDay'
							required
							onChange={(e) => {
								if(e.target.value == 'on'){
									setOneDay('false')
								}
							}}
							name='oneDay' />no
					</div>
				</div>
			</div>
			{oneDay !== '' ? 
				oneDay !== 'true' ?
					<div style={{margin: '0 auto', width: '60%'}}>
						<div >
						<label>start date: </label>
						<input
							type='date'
							required
							name='heldOn'
							className='create-event-input'
							placeholder='start date'
							onChange={(e) => {
								setEvent({
									...event,
									oneDay: false,
									timeStamp: {
										...event.timeStamp,
										heldOn: e.target.value,
										postedOn: Date.now()
									}
								})
							}}
						/>
						<br/>
						<label>end date: </label>
						<input
							type='date'
							required
							name='finishedOn'
							className='create-event-input'
							placeholder='end date'
							onChange={(e) => {
								setEvent({
									...event,
									oneDay: false,
									timeStamp: {
										...event.timeStamp,
										finishedOn: e.target.value
									}
								})
							}}
						/>
						</div>
					</div>
					:
					<div style={{margin: '10px auto', width: '60%'}}>
						<label>will be held on: </label>
						<input
							type='date'
							required
							name='heldOn'
							className='create-event-input'
							placeholder='will be held on'
							onChange={(e) => {
								setEvent({
									...event,
									oneDay: true,
									timeStamp: {
										heldOn: e.target.value,
										postedOn: Date.now()
									}
								})
							}}
						/>	
					</div>
				:
				null
			}
			{externalLink.map((val, ind) => {
				return(
					<div>
						<input
							type="url"
							name={`external_link${ind}`}
							className="create-event-input"
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
						<textarea
							// type="textarea"
							className="create-event-input"
							name="description1"
							placeholder="description of the link"
							onChange={(e) => {
								var arr = externalLink;
								arr[ind] = {
									...arr[ind],
									description: e.target.value
								}
								setExternalLink(arr);
								console.log(externalLink)
							}}
						/>
					</div>
				)
			})}
			<div>
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
			</div>
			<input
				type='text'
				name='venue'
				placeholder='venue'
				className='create-event-input'
				onChange={(e) => {
					setEvent({
						...event,
						venue: e.target.value
					})
				}}
			/>
			{/* <div style={{margin: '10px auto', width: '60%'}}>
				<label>last date of registration: </label>
				<input
					type='date'
					required
					name='lastDate'
					className='create-event-input'
					placeholder='last date of registration'
					onChange={(e) => {
						setEvent({
							...event,
							timeStamp: {
								...event.timeStamp,
								lastRegistration: e.target.value
							}
						})
					}}
				/>	
			</div> */}
			<div style={{width: '90%', margin: '0 auto'}}>
				<Editors description={description} setDescription={setDescription} />
			</div>
			<div style={{
				margin: '10px auto',
				maxWidth: '80%',
				display: 'flex',
			}}>
				<Switch 
					onChange={(val) => {
						setEvent({
							...event,
							eventForm: val
						})
					}} 
					checked={event.eventForm} 
				/>
				<div style={{
				}}>  create a form for this event</div>
			</div>
			<button
				type='button'
				style={{
					width: '50%', 
					margin: '10px auto', 
					padding: '5px'
				}}
				onClick={handleSubmit}
			>submit</button>
			</div>
			:
			<Loader
		        type="ThreeDots"
		        color="#ff0033"
		        height={100}
		        width={100}
		        timeout={10000} //10 secs
		    />
			}
		</form>
	)
}

const Popup = (props) => {
	const {popup, setPopup} = props;

	return(
		<div>
			{ popup ?
				<div className='main-popup' style={{textAlign: 'center'}}>
					<h3>Sorry, you cannot host event unless you are a member of an organization</h3>
					<button onClick={() => {
						props.history.push(`/create/committee`)
					}}>create an organization?</button>
					<button onClick={() => {
						setPopup(false);
						props.history.goBack();
					}}>close
					</button>
				</div>
				:
				null
			}
		</div>
	)
}

const ErrorPopup = (props) => {
	const {error, setError} = props;

	return(
		<div>
			{error !== "" ? 
				<div className='main-popup'>
					<p>{error}</p>
					<button onClick={() => {setError("")}}>OK</button>
				</div>
				:
				null
			}
		</div>
	)
}