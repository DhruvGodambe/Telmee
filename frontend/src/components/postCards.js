import React, {useState, useEffect } from 'react'
import firebase from '../firebase/index'
import {Link} from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export function PostCard(props) {
	const {post} = props
	const [popup, setPopup] = useState(false)
	const [image, setImage] = useState('')

	useEffect(() => {
		firebase.storage.ref(`/posts/${post.imageName}`).getDownloadURL()
		.then(url => {
			setImage(url)
		})
	}, [])

	const getStdDate = (dateStr) => {
		const d = new Date(dateStr);
		return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
	}

	const getStdTime = (dateStr) => {
		const d = new Date(dateStr)
		const ampm = d.getHours() > 12 ? 'am' : 'pm';
		return `${d.getHours()}:${d.getMinutes()} ${ampm}`
	}

	return(
		<div className='post-container'>
			<DeletePopup
				post={post}
				popup={popup}
				setPopup={setPopup}
			/>
			<div className='image-container'>
				<img alt='' src={image} />
			</div>
			<div style={{padding: '2%'}}>
				<p style={{margin: '5px 0'}}>{post.description}</p>
				<p style={{margin: '10px 0 5px'}}>
					<Link
						to={`/event/past/${post.eventid}`}
					>{post.eventName}
					</Link>
				</p>
				{/* <p 
					style={{
						color: 'grey',
						fontSize: '15px',
						lineHeight: '12px',
						margin: '5px 0'
					}}
				>posted by
					<Link
						to={`/user/${post.userid}`}
						style={{marginLeft: '5px', color: '#333'}}
					>{post.user}</Link>
				</p> */}
				<p 
					style={{
						color: 'grey',
						fontSize: '15px',
						lineHeight: '12px',
						margin: '5px 0'
					}}
				>{getStdDate(post.postedOn)} at {getStdTime(post.postedOn)}</p>
				<div style={{textAlign: 'right'}}>
					<button style={{
						cursor: 'pointer',
						background: 'inherit',
						color: 'inherit',
						boxShadow: 'none',
						padding: '5px'
					}}
						onClick={() => {setPopup(true)}}
					><FontAwesomeIcon icon={faTimes}/></button>
				</div>
			</div>
		</div>
	)
}

export function PostCard2(props) {
	const {post} = props
	const [popup, setPopup] = useState(false)
	const [image, setImage] = useState('')

	useEffect(() => {
		firebase.storage.ref(`/posts/${post.imageName}`).getDownloadURL()
		.then(url => {
			setImage(url)
		})
	}, [])

	const getStdDate = (dateStr) => {
		const d = new Date(dateStr);
		return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
	}

	const getStdTime = (dateStr) => {
		const d = new Date(dateStr)
		const ampm = d.getHours() > 12 ? 'am' : 'pm';
		return `${d.getHours()}:${d.getMinutes()} ${ampm}`
	}

	return(
		<div className='post-container'>
			<div className='image-container'>
				<img alt='' src={image} />
			</div>
			<div style={{padding: '2%'}}>
				<h3>
					<Link
						to={`/user/${post.userid}`}
					>{post.user}
					</Link>
				</h3>
				<p>{post.description}</p>
				<p 
					style={{
						color: 'grey',
						fontSize: '15px',
						lineHeight: '12px'
					}}
				>{post.eventName}</p>
				<p 
					style={{
						color: 'grey',
						fontSize: '15px',
						lineHeight: '12px'
					}}
				>posted on {getStdDate(post.postedOn)} at {getStdTime(post.postedOn)}</p>
			</div>
		</div>
	)
}

export function PostCard3(props) {
	const {post} = props
	const [popup, setPopup] = useState(false)
	const [image, setImage] = useState('')

	useEffect(() => {
		firebase.storage.ref(`/posts/${post.imageName}`).getDownloadURL()
		.then(url => {
			setImage(url)
		})
	}, [])

	const getStdDate = (dateStr) => {
		const d = new Date(dateStr);
		return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
	}

	const getStdTime = (dateStr) => {
		const d = new Date(dateStr)
		const ampm = d.getHours() > 12 ? 'am' : 'pm';
		return `${d.getHours()}:${d.getMinutes()} ${ampm}`
	}

	return(
		<div className='post-container'>
			<DeletePopup
				post={post}
				popup={popup}
				setPopup={setPopup}
			/>
			<div className='image-container'>
				<img alt='' src={image} />
			</div>
			<div style={{padding: '2%'}}>
				{post.description ? <p>{post.description}</p> : null}
				<p style={{margin: '10px 0 0'}}>
					<Link
						to={`/event/past/${post.eventid}`}
					>{post.eventName}
					</Link>
				</p>
				{/* <p 
					style={{
						color: 'grey',
						fontSize: '15px',
						lineHeight: '12px'
					}}
				>posted by
					<Link
						to={`/user/${post.userid}`}
					>{post.user}</Link>
				</p> */}
				<p 
					style={{
						color: 'grey',
						fontSize: '15px',
						lineHeight: '12px',
						margin: '5px 0'
					}}
				>on {getStdDate(post.postedOn)} at {getStdTime(post.postedOn)}</p>
			</div>
		</div>
	)
}

const DeletePopup = (props) => {
	const {post, popup, setPopup} = props

	const handleDelete = () => {
		firebase.db.collection('events').doc(post.eventid).update({
			posts: firebase.firebase.firestore.FieldValue.arrayRemove(post)
		}).then(res => {
			firebase.db.collection('users').doc(post.userid).update({
				posts: firebase.firebase.firestore.FieldValue.arrayRemove(post)
			}).then(resp => {
				firebase.storage.ref(`/posts/${post.imageName}`).delete()
				.then(response => {
					window.location.reload()
				})
			})
			.catch(err => {console.log('event error: ', err)})
		})
	}

	return(
		<div>
			{popup ?
				<div style={{textAlign: 'center'}} className='main-popup'>
					<p className="popup-title">confirm delete this post?</p>
					<button onClick={handleDelete}>yes</button>
					<button onClick={() => setPopup(false)}>no</button>
				</div>
				:
				null
			}
		</div>
	)
}


