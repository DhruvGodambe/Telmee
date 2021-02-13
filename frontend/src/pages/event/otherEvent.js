import React, {useState, useEffect, useContext} from 'react';
import {globalContext} from '../../globalContext';
import Cookies from 'js-cookie';
import firebase from '../../firebase/index';
import './event.css';
import logo from '../../images/logo5.png';
import {Link} from 'react-router-dom';
import InnerHTML from 'dangerously-set-html-content'
import 'draft-js/dist/Draft.css';
// import { RippleButton } from 'react-ripple-effect';

import {Editor, EditorState, convertFromRaw} from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCheck, faShare } from '@fortawesome/free-solid-svg-icons';

export default function OtherEvent(props) {
	const {currentUser} = useContext(globalContext);
	const [event, setEvent] = useState({})
	const [errmsg, setErrmsg] = useState('')
	const [popup, setPopup] = useState(false)
	const [img, setImg] = useState('');
	let tempPath = props.history.location.pathname.split('/');
	const eventid = tempPath[tempPath.length - 1];
	const [registered, setRegistered] = useState(false);
	const [confirm, setConfirm] = useState(false);
	const [description, setDescription] = useState('')
	const [media1, setMedia1] = useState("");
    const [media2, setMedia2] = useState("");

	useEffect(() => {
		window.scrollTo(0,0)
		firebase.db.collection('events').doc(eventid).get()
		.then(result => {
			if(result.exists){
				setEvent(result.data())
				document.title = result.data().name;
				if(new Date(result.data().timeStamp.heldOn) < Date.now()){
					props.history.replace(`/event/past/${eventid}`)
				}
				//check if any media in the event
				if(result.data().media1Name){
					firebase.storage.ref(`/events/${result.data().media1Name}`).getDownloadURL()
					.then(url => {
						setMedia1(url);
					})
				}
				if(result.data().media2Name){
					firebase.storage.ref(`/events/${result.data().media2Name}`).getDownloadURL()
					.then(url => {
						setMedia2(url);
					})
				}
				if(result.data().coverImageName){
					firebase.storage.ref(`/events/${result.data().coverImageName}`).getDownloadURL()
					.then(url => {
						setImg(url);
					})
				}
			}
		})
		.catch(err => {
			setErrmsg('something went wrong!\n please reload or try again later')
			window.location.reload()
		})
		if(Cookies.get("telmee-registered-events")){
			let arr = JSON.parse(Cookies.get("telmee-registered-events"))
			if(arr.includes(eventid)){
				setRegistered(true)
			}
		}
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
	// 		event.description.split(' ').forEach(val => {
	// 		    if(val.includes('.')){
	// 		        if(val.indexOf('.') < val.length -1){
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
	const FONT = "Arial, Helvetica, sans-serif";

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
					<h2>{event.name}</h2>
					{img !== '' ?
						<img width='100%' src={img} />
						:
						<img width='100%' src={logo} />
					}
				</div>
				{event.name ?
					<div className='event-content'>
						<div style={{ margin: '0 0 2.5% 75%'}}>
							<button
								className='event-nav'
								onClick={share}
							>
								<div style={{margin: 'auto', width: 'auto', alignItems: 'center'}}><FontAwesomeIcon style={{ fontSize: '20px'}} icon={faShare}/></div>
								<p style={{ marginLeft: '2px'}}>share</p>
							</button>
						</div>
						<h3>Organized by
							<Link
								style={{ marginLeft: '5px', color: '#E79981'}}
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
							<p style={{margin: '0px 0 0', color: 'grey'}}>venue: {event.venue}</p>
							:
							null
						}
						{media1 !== "" ?
							event.media1Type.indexOf("image") !== -1 ?
								<div style={{width: '95%', margin: '30px auto'}}>
									<img width="100%" src={media1} /> 
								</div>
								:
								<div style={{width: '95%', margin: '30px auto'}}>
									<video width="100%" src={media1} autoPlay controls controlsList="nodownload nofullscreen" /> 
								</div>
							:
							null
						}
						{media2 !== "" ?
							event.media2Type.indexOf("image") !== -1 ?
								<div style={{width: '95%', margin: '30px auto'}}>
									<img width="100%" src={media2} /> 
								</div>
								:
								<div style={{width: '95%', margin: '30px auto'}}>
									<video width="100%" src={media2} autoPlay controls controlsList="nodownload nofullscreen" /> 
								</div>
							:
							null
						}
						{event.description ?
							<div style={{marginTop: '30px'}}>
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
						{event.externalLink?.length > 0 ?
							event.externalLink.map((val, ind) => {
								return(
									<div key={ind} className="event-external-link">
										<p>{val.description}</p>
										<a style={{color: "#ff003f", opacity: '.5'}} href={val.link}>{val.link}</a>
									</div>
								)
							})
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
							onClick={() => {setPopup(true)}}
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