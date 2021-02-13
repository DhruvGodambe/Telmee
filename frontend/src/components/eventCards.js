import React, { useState, useEffect } from 'react';
import firebase from '../firebase/index';
import './eventCards.css';
import 'draft-js/dist/Draft.css';
import {Editor, EditorState, convertFromRaw} from 'draft-js';

export default function EventCards(props) {
	var {event} = props;
	const [img, setImg] = useState('')
	const [editorState, setEditorState] = useState(EditorState.createEmpty())
	const [description, setDescription] = useState('');

	useEffect(() => {
		if(typeof(event.description) == "object"){
			var currentContent = EditorState.createWithContent(convertFromRaw(event.description))
			setDescription(currentContent.getCurrentContent().getPlainText())
		} else {
			setDescription(event.description)
		}
		if(event.coverImageName){
			firebase.storage.ref(`/events/${event.coverImageName}`).getDownloadURL()
			.then(url => {
				setImg(url)
			})
		}
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
				<p className="organized">{event.organizingCommittee.name}</p>
				{/* <p>{new Date(event.timeStamp.heldOn) < Date.now() ? null : 'will be'} held on {getStdDate(event.timeStamp.heldOn)}</p> */}
				<hr />
				<p>{description !== "" ? description.substring(0, 200) + '...' : null}</p>
			</div>
		</div>
	)
}

export function EventCard2(props) {
	var {event} = props;
	const [img, setImg] = useState('')
	const [editorState, setEditorState] = useState(EditorState.createEmpty())
	const [description, setDescription] = useState('');

	useEffect(() => {
		if(typeof(event.description) == "object"){
			var currentContent = EditorState.createWithContent(convertFromRaw(event.description))
			setDescription(currentContent.getCurrentContent().getPlainText())
		} else {
			setDescription(event.description)
		}
		if(event.coverImageName){
			firebase.storage.ref(`/events/${event.coverImageName}`).getDownloadURL()
			.then(url => {
				setImg(url)
			})
		}
	}, [])

	const getStdDate = (dateStr) => {
		const d = new Date(dateStr);
		return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
	}

	return (
		<div style={{cursor: 'pointer'}} className="event-card-2" onClick={() => {props.history.push(`/event/${props.id}`)}}>
			<div className="event-card-image">
				<img src={img}/>
			</div>
			<div className="event-card-content">
				<h3>{event.name}</h3>
				<p className="organized">{event.organizingCommittee.name}</p>
				{/* <p>{new Date(event.timeStamp.heldOn) < Date.now() ? null : 'will be'} held on {getStdDate(event.timeStamp.heldOn)}</p> */}
				{/* <hr />
				<p>{description !== "" ? description.substring(0, 200) + '...' : null}</p> */}
			</div>
		</div>
	)
}