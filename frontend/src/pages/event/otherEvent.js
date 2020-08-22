import React, {useState, useEffect, useContext} from 'react';
import {globalContext} from '../../globalContext';
import Cookies from 'js-cookie';
import firebase from '../../firebase/index';
import './event.css';
import logo from '../../images/logo5.png';
import {Link} from 'react-router-dom';
import InnerHTML from 'dangerously-set-html-content'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default function OtherEvent(props) {
	const {currentUser} = useContext(globalContext);
	const [event, setEvent] = useState({})
	const [errmsg, setErrmsg] = useState('')
	const [popup, setPopup] = useState(false)
	const [img, setImg] = useState('');
	const eventid = props.history.location.pathname.split('/event/')[1];
	const [registered, setRegistered] = useState(false);
	const [confirm, setConfirm] = useState(false);
	const [description, setDescription] = useState('')

	useEffect(() => {
		console.log('eventid: ', eventid);
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
		})
		if(props.history.location.query == 'registered'){
			setRegistered(true)
			setConfirm(true)
		}
	}, [])

	useEffect(() => {
		console.log('currentUser: ', currentUser)
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

	useEffect(() => {
		var str = ''
		if(event.description){
			event.description.split(' ').forEach(val => {
			    if(val.includes('.')){
			        if(val.indexOf('.') < val.length -1){
			        	if(val.includes('https')){
				            var temp = `<a href='${val}'>`
				        	console.log('temp: ', temp)
				            var temp2 = temp.concat(val)
				            temp2 = temp2.concat('</a> ')
				            str = str.concat(temp2)
				        } else {
				        	var temp = `<a href='https://${val}'>`
				        	console.log('temp: ', temp)
				            var temp2 = temp.concat(val)
				            temp2 = temp2.concat('</a> ')
				            str = str.concat(temp2)
				        }
			        } else {
			            str = str.concat(`${val} `)
			        }
			    } else {
			        str = str.concat(`${val} `)
			    }
			})
		}
		setDescription(str)
	}, [event.description])

	const getStdDate = (dateStr) => {
		const d = new Date(dateStr);
		return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
	}

	const FONT = 'Palatino, serif';

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
					<h2>{event.name}</h2>
				</div>
				{event.name ?
					<div className='event-content'>
						<h3>Organized by
							<Link
								className='link-tag'
								style={{textDecoration: 'underline'}}
								to={`/committee/${event.organizingCommittee.id}`}
							>
							{event.organizingCommittee.name}
							</Link>
						</h3>
						{event.oneDay ?
							<div>
								<p>will be held on {getStdDate(event.timeStamp.heldOn)}</p>
							</div>
							:
							<div>
								<p>from {getStdDate(event.timeStamp.heldOn)}</p>
								<p>to {event.timeStamp.finishedOn}</p>
							</div>
						}
						{event.venue ?
							<p>venue: {event.venue}</p>
							:
							null
						}
						{event.description ?
							description !== '' ?
								<div>
									<pre style={{fontFamily: FONT}}>
										<InnerHTML html={description} />
									</pre>
								</div>
								:
								<pre style={{fontFamily: FONT}}>{event.description}</pre>
							:
							null
						}
						{event.entryFee ?
							<p style={{fontSize: '18px'}}><b>entry fee: Rs.{event.entryFee}/-</b></p>
							:
							null
						}
						<div className='event-register'>
						<button
							className='event-register-button'
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
						}}>OK
						</button>
				</div>
				:
				null
			}
		</div>
	)
}