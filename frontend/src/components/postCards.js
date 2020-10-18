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
		return `${d.getHours()}:${d.getMinutes()}`
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
				<h3>
					<Link
						to={`/event/past/${post.eventid}`}
						style={{textDecoration: 'underline'}}
					>{post.eventName}
					</Link>
				</h3>
				<p>{post.description}</p>
				<p 
					style={{
						color: 'grey',
						fontSize: '15px',
						lineHeight: '12px'
					}}
				>posted by
					<Link
						to={`/user/${post.userid}`}
						style={{textDecoration: 'underline'}}
					>{post.user}</Link>
				</p>
				<p 
					style={{
						color: 'grey',
						fontSize: '15px',
						lineHeight: '12px'
					}}
				>on {getStdDate(post.postedOn)} at {getStdTime(post.postedOn)}</p>
				<div style={{textAlign: 'right'}}>
					<button style={{
						cursor: 'pointer',
						background: 'inherit',
						color: 'inherit',
						boxShadow: 'none'
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
		return `${d.getHours()}:${d.getMinutes()}`
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
		return `${d.getHours()}:${d.getMinutes()}`
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
				<h3>
					<Link
						to={`/event/past/${post.eventid}`}
						style={{textDecoration: 'underline'}}
					>{post.eventName}
					</Link>
				</h3>
				<p>{post.description}</p>
				<p 
					style={{
						color: 'grey',
						fontSize: '15px',
						lineHeight: '12px'
					}}
				>posted by
					<Link
						to={`/user/${post.userid}`}
						style={{textDecoration: 'underline'}}
					>{post.user}</Link>
				</p>
				<p 
					style={{
						color: 'grey',
						fontSize: '15px',
						lineHeight: '12px'
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
					<h2>confirm delete this post?</h2>
					<button onClick={handleDelete}>yes</button>
					<button onClick={() => setPopup(false)}>no</button>
				</div>
				:
				null
			}
		</div>
	)
}

