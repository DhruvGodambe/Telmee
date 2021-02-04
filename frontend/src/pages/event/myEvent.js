import React, {useState, useEffect, useContext} from 'react';
import {globalContext} from '../../globalContext';
import Cookies from 'js-cookie';
import firebase from '../../firebase/index';
import './event.css';
import logo from '../../images/logo5.png';
import {Link} from 'react-router-dom';
import 'draft-js/dist/Draft.css';

import {Editor, EditorState, convertFromRaw} from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faFont } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default function MyEvent(props) {
	const {currentUser} = useContext(globalContext);
	const [event, setEvent] = useState({})
	const [popup, setPopup] = useState(false)
	const [errmsg, setErrmsg] = useState('')
	const [img, setImg] = useState('');
	const eventid = props.history.location.pathname.split('/event/')[1];
	const [registered, setRegistered] = useState(false);
	const [confirm, setConfirm] = useState(false);
	const [description, setDescription] = useState(false);

	useEffect(() => {
		window.scrollTo(0,0)
		firebase.db.collection('events').doc(eventid).get()
		.then(result => {
			if(result.exists){
				setEvent(result.data())
				if(new Date(result.data().timeStamp.heldOn) < Date.now()){
					props.history.replace(`/event/past/${eventid}`)
				}
				firebase.storage.ref(`/events/${result.data().coverImageName}`).getDownloadURL()
				.then(url => {
					setImg(url);
				})
			}
		})
		.catch(err => {
			setErrmsg('something went wrong!\n please reload or try again later')
			window.location.reload()
		})
		if(props.history.location.query == 'registered'){
			setRegistered(true)
			setConfirm(true)
		}
	}, [])

	useEffect(() => {
		if(currentUser.data){
			if(currentUser.data.registeredEvents){
				const temp = currentUser.data.registeredEvents.filter((val, ind) => {
					return val === eventid
				})
				if(temp.length > 0){
					setRegistered(true)
				} else {
					setRegistered(false)		
				}
			}
		}
	}, [currentUser])

	// useEffect(() => {
	// 	var str = ''
	// 	if(event.description){
	// 		console.log('description', event)
	// 		event.description.split(' ').forEach(val => {
	// 		    if(val.includes('.')){
	// 		        if(val.indexOf('.') < val.length -1){
	// 		        	console.log('val:', val)
	// 		        	if(val.includes('https')){
	// 			            var temp = `<a href='${val}'>`
	// 			        	console.log('temp: ', temp)
	// 			            var temp2 = temp.concat(val)
	// 			            temp2 = temp2.concat('</a> ')
	// 			            str = str.concat(temp2)
	// 			        } else {
	// 			        	var temp = `<a href='https://${val}'>`
	// 			        	console.log('temp: ', temp)
	// 			            var temp2 = temp.concat(val)
	// 			            temp2 = temp2.concat('</a> ')
	// 			            str = str.concat(temp2)
	// 			        }
	// 		        } else {
	// 		            str = str.concat(`${val} `)
	// 		        }
	// 		    } else {
	// 		        str = str.concat(`${val} `)
	// 		    }
	// 		})
	// 	}
	// 	setDescription(str)
	// }, [event.description])

	const getStdDate = (dateStr) => {
		const d = new Date(dateStr);
		return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
	}

	const share = () => {
		console.log(navigator)
		if(navigator.share){
			navigator.share({
				title: event.name,
				url: window.location.href,
			}).then(() => console.log('Successful share'))
		}
	}

	// const FONT = 'Palatino, serif';
	const FONT = 'Helvetica, Arial, sans-serif';

	return(
		<div className='root-event' style={{fontFamily: FONT}}>
			{errmsg == '' ?
				<div  className='main-event-box'>
					<RegisterPopup
						{...props}
						eventid={eventid}
						popup={popup}
						setPopup={setPopup}
						event={event}
						setRegistered={setRegistered}
						setConfirm={setConfirm}
					/>
					<ConfirmPopup
						confirm={confirm}
						setConfirm={setConfirm}
					/>
					<div className='cover-image-container'>
						{img !== '' ?
							<img width='100%' src={img} />
							:
							<img width='100%' src={logo} />
						}
						<h2 style={{margin: '5px'}}>{event.name}</h2>
					</div>
					{event.name ?
						<div className='event-content'>
							<div style={{margin: '10px 0'}}>
								<button
									className='event-nav registered-user'
									onClick={() => {
										props.history.push({
											pathname: `/event/get/${eventid}`,
											query: event.registeredUsers
										})
									}}
								>
									<div style={{margin: 'auto 5px', width: 'auto'}}><FontAwesomeIcon style={{ fontSize: '20px'}} icon={faUsers}/></div>
									<p style={{width: 'auto', fontWeight: 'bold'}}> registered users </p>
								</button>
							</div>
							<div style={{margin: '10px 0'}}>
								<button
									className='event-nav registered-user'
									onClick={() => {
										props.history.push({
											pathname: `/event/attended/${eventid}`,
											query: {
												attendedUsers: event.attendedUsers,
												registeredUsers: event.registeredUsers,
												name: event.name
											}
										})
									}}
								>
									<div style={{margin: 'auto 5px', width: 'auto'}}><FontAwesomeIcon style={{ fontSize: '20px'}} icon={faUsers}/></div>
									<p style={{width: 'auto', fontWeight: 'bold'}}> attended users </p>
								</button>
							</div>
							<div style={{width: '100%'}}>
								<div style={{margin: '10px 0', display: 'inline-block', margin: '0 0 2.5% 0'}}>
									<button
										className='event-nav'
										onClick={() => {
											props.history.push({
												pathname: `/event/edit/${eventid}`,
												query: event
											})
										}}
									>
										<div style={{margin: 'auto', width: 'auto', alignItems: 'center'}}><FontAwesomeIcon style={{ fontSize: '20px'}} icon={faEdit}/></div>
										<p style={{width: '80%'}}>edit</p>
									</button>
								</div>
								<div style={{margin: '10px 0', display: 'inline-block', margin: '0 0 2.5% 2.5%'}}>
									<button
										className='event-nav'
										onClick={() => {
											props.history.push({
												pathname: event.eventForm ? `/event/view_form/${eventid}` : `/create/eventForm/${eventid}`,
												query: {
													inputs: event.formTemplate
												}
											})
										}}
									>
										<div style={{margin: 'auto', width: 'auto', alignItems: 'center'}}><FontAwesomeIcon style={{ fontSize: '20px'}} icon={faEdit}/></div>
										<p style={{width: '80%'}}>{event.eventForm ? 'view form' : 'create a form'}</p>
									</button>
								</div>
								<div style={{margin: '10px 0', display: 'inline-block', margin: '0 0 2.5% 2.5%'}}>
									<button
										className='event-nav'
										onClick={share}
									>
										<div style={{margin: 'auto', width: 'auto', alignItems: 'center'}}><FontAwesomeIcon style={{ fontSize: '20px'}} icon={faShare}/></div>
										<p style={{width: '80%', marginLeft: '2px'}}>share</p>
									</button>
								</div>
							</div>
							<h3 style={{margin: '20px 0 5px'}}>Organized by
								<Link
									style={{ marginLeft: '5px', color: '#ff003f', opacity: '0.5'}}
									to={`/committee/${event.organizingCommittee.id}`}
								>
								{event.organizingCommittee.name}
								</Link>
							</h3>
							{event.oneDay ?
								<div>
									<p style={{margin: '0', color: 'grey'}}>will be held on {getStdDate(event.timeStamp.heldOn)}</p>
								</div>
								:
								<div>
									<p style={{margin: '0', color: 'grey'}}>from {getStdDate(event.timeStamp.heldOn)} to {getStdDate(event.timeStamp.finishedOn)}</p>
								</div>
							}
							{event.venue ?
								<p style={{margin: '5px 0 30px', color: 'grey'}}>venue: {event.venue}</p>
								:
								null
							}
							{event.description ?
								<div>
									{typeof(event.description) == "object" ?
										<Editor
											editorState={EditorState.createWithContent(convertFromRaw(event.description))}
											readOnly={true}
										/>
										:
										<pre style={{fontFamily: FONT}}>{event.description}</pre>
									}
								</div>
								:
								null
							}
							{event.entryFee && event.entryFee !== "0" ?
								<p style={{fontSize: '18px'}}><b>entry fee: Rs.{event.entryFee}/-</b></p>
								:
								null
							}
							<div className='event-register'>
							<button
								className='event-register-button'
								// disabled={eventid == "GWRJjoUwIgVbnf8LhoYd" ? true : false}
								onClick={() => {
									if(Cookies.get('userID')){
										if(!registered){
											setPopup(true)
										}
									} else {
										props.history.push('/login')
									}
								}}
							><FontAwesomeIcon icon={faCheck} style={{display: registered ? 'inline-block' : 'none'}} /> {registered ? 'registered' : 'register'}</button>
							
							</div>
						</div>
						: 
						null
					}
				</div>
				:
				<div>
					<h3>{errmsg}</h3>
				</div>
			}
		</div>
	)
}

const RegisterPopup = (props) => {
	const {popup, setPopup, event, eventid, setRegistered, setConfirm} = props;
	const {currentUser} = useContext(globalContext);

	const handleRegister = () => {
		setPopup(false)
		var eventRef = firebase.db.collection('events').doc(eventid);
		if(event.eventForm){
			props.history.push({
				pathname: `/event/register/${eventid}`,
				query: event
			})
		} else {
			if(event.registeredUsers){
				eventRef.update({
					registeredUsers: [...event.registeredUsers, currentUser.id]
				})
				.then(res => {
					if(currentUser.data.registeredEvents){
						firebase.db.collection('users').doc(currentUser.id).update({
							registeredEvents: [...currentUser.data.registeredEvents, eventid]
						})
					} else {
						firebase.db.collection('users').doc(currentUser.id).update({
							registeredEvents: [eventid]
						})
					}
					setRegistered(true);
					setConfirm(true);
				})
			} else {
				eventRef.update({
					registeredUsers: [currentUser.id]
				})
				.then(res => {
					if(currentUser.data.registeredEvents){
						firebase.db.collection('users').doc(currentUser.id).update({
							registeredEvents: [...currentUser.data.registeredEvents, eventid]
						})
					} else {
						firebase.db.collection('users').doc(currentUser.id).update({
							registeredEvents: [eventid]
						})
					}
					setRegistered(true)
					setConfirm(true)
				})
			}
		}
	}

	return(
		<div>
			{ popup ?
				<div className='main-popup' style={{textAlign: 'center'}}>
					<div style={{textAlign: 'right'}}>
						<FontAwesomeIcon style={{cursor: 'pointer'}} onClick={() => {setPopup(false)}} icon={faTimes}/>
					</div>
					<h3>register for {event.name}?</h3>
					
						<button onClick={handleRegister}>yes</button>
					
						<button onClick={() => {
							setPopup(false)
						}}>no
						</button>
				</div>
				:
				null
			}
		</div>
	)
}

const ConfirmPopup = (props) => {
	const {confirm, setConfirm} = props;

	return(
		<div>
			{ confirm ?
				<div className='main-popup' style={{textAlign: 'center'}}>
					<div style={{textAlign: 'right'}}>
						<FontAwesomeIcon style={{cursor: 'pointer'}} onClick={() => {setConfirm(false)}} icon={faTimes}/>
					</div>
					<h3>successfully registered for the event</h3>
										
						<button onClick={() => {
							setConfirm(false)
							window.location.reload()
						}}>OK
						</button>
				</div>
				:
				null
			}
		</div>
	)
}
