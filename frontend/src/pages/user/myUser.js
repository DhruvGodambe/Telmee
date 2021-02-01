import React, { useEffect, useState, useContext } from 'react';
import './myUser.css';
import sadme from '../../images/sadme.png';
import {PostCard} from '../../components/postCards'

import {globalContext} from '../../globalContext';
import {Link} from 'react-router-dom';
import Loader from 'react-loader-spinner';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

export default function MyUser(props) {
	const {currentUser} = useContext(globalContext);
	const [committeeArray, setCommitteeArray] = useState([]);
	const [popup, setPopup] = useState(false);
	const [eventPopup, setEventPopup] = useState(false)

	useEffect(() => {
		window.scrollTo(0, 0)
		if(currentUser.data){
			if(currentUser.data.committee){
				var comArr = currentUser.data.committee.map((val, ind) => {
					return(
						<div className='committee-member-child' key={ind}>
							<p>{val['position']}</p>
							<p style={{lineHeight: '20px'}}>of</p>
							<p>
								<Link to={`/committee/${val.id}`} className='link-tag' >{val.name}</Link>
							</p>
						</div>
					)
				})
				setCommitteeArray(comArr);
			}
		}
	}, [currentUser])

	const handleUpload = () => {
		setPopup(true);
	}

	const handleEvents = () => {
		setEventPopup(true)
	}

	return(
		<div>
			<Popup {...props} popup={popup} setPopup={setPopup} />
			{ currentUser.data ? 
				<div className='user'>
					{/* <hr style={{
						position: "absolute",
						width: "99%",
						top: "195px",
						zIndex: "-1",
						left: "0",
						display: currentUser.data.profilePicture ? 'block' : 'none'
					}} /> */}
					<div className='image-box'>
						<img alt='' src={currentUser.data.profilePicture}/>
					</div>
					<h3>{currentUser.data.name}</h3>
					<div className='main-user'>
						<div className='intro'>
							<Link to={`/user/userEditProfile/${currentUser.id}`} >
								<button>edit profile</button>
							</Link>
							<p>{currentUser.data.description}</p>
							<hr/>
							{ currentUser.data.committee && currentUser.data.committee.length > 0 ?
								<div className='committee-member'>
									{committeeArray}
									<hr/>
								</div>
								:
								null
							}
						</div>
						<div className='user-details'>
							{currentUser.data.attendedEvents ?
								<p>been to <span onClick={handleEvents}>{currentUser.data.attendedEvents.length}</span> {currentUser.data.attendedEvents.length == 1 ? 'event' : 'events'}</p>
								:
								<p>been to <span>0</span> events</p>
							}
							<button alt='you' onClick={handleUpload}>upload a moment +</button>
							{currentUser.data.posts.length > 0 ?
								currentUser.data.posts.map((val, ind) => {
									return <PostCard post={val} key={ind} />
								})
								:
								null
							}
						</div>
					</div>
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
		</div>
	)
}

const Popup = (props) => {
	const {popup, setPopup} = props;
	const {currentUser} = useContext(globalContext);
	const [selectedEvent, setSelectedEvent] = useState({})
	const [upload, setUpload] = useState(false)
	const [base64, setBase64] = useState('')
	const [post, setPost] = useState({})

	function deletePost(e) {
		alert('delete the post?');
		setPopup(false);
	}

	return(
		<div>
			{ popup ?
				<div className='main-popup'>
					<div style={{textAlign: 'right'}}>
						<FontAwesomeIcon style={{cursor: 'pointer'}} onClick={() => {setPopup(false)}} icon={faTimes}/>
					</div>
					{currentUser.data.attendedEvents.length > 0 ?
						<div>
							<h2>Moment from which event?</h2>
							{currentUser.data.attendedEvents.map((val, ind) => {
								return (
									<div key={ind} style={{cursor: 'pointer'}}>
										<p
											onClick={() => {
												props.history.push({
													pathname: '/user/upload/post',
													query: {
														selectedEvent: val
													}
												})
											}}
											htmlFor='uploadPost'
											className='event-post-option'
										>{val.name}</p>
									</div>
								)
							})}
						</div>
						:
						<div>
							<p style={{
								fontSize: '18px'
							}}>sorry, you have to attend an event to upload photos.</p>
							<img alt='' style={{width: '30%'}} src={sadme}/>
						</div>
					}
				</div>
				:
				null
			}
		</div>
	)
}