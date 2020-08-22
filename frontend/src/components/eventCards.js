import React, { useState, useEffect } from 'react';
import firebase from '../firebase/index';
import './eventCards.css';

export default function EventCards(props) {
	var {event} = props;
	const [img, setImg] = useState('')

	useEffect(() => {
		firebase.storage.ref(`/events/${event.coverImageName}`).getDownloadURL()
		.then(url => {
			setImg(url)
		})
	}, [])

	const getStdDate = (dateStr) => {
		const d = new Date(dateStr);
		return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
	}

	return (
		<div style={{cursor: 'pointer'}} className="event-card" onClick={() => {props.history.push(`/event/${props.id}`)}}>
			<div className="event-card-image">
				<img src={img}/>
			</div>
			<div className="event-card-content">
				<h3>{event.name}</h3>
				<p>organized by {event.organizingCommittee.name}</p>
				<p>{new Date(event.timeStamp.heldOn) < Date.now() ? null : 'will be'} held on {getStdDate(event.timeStamp.heldOn)}</p>
				<p>{event.description ? event.description.substring(0, 200) + '...' : null}</p>
			</div>
		</div>
	)
}