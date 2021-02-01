import React, { useState, useEffect, useContext } from 'react';
import firebase from '../../firebase/index';
import {globalContext} from '../../globalContext';
import Loader from 'react-loader-spinner';
import './myUser.css';
import {PostCard3} from '../../components/postCards'
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function User(props) {
	const userid = window.location.href.split('/user/')[1];
	const [name, setName] = useState('');
	const {currentUser} = useContext(globalContext);
	const [committeeArray, setCommitteeArray] = useState([]);
	const [numberOfEvents, setNumberOfEvents] = useState(0)
	const [user, setUser] = useState({})
	const [commonEvents, setCommonEvents] = useState([]);
	const [showDetails, setShowDetails] = useState(false)

	useEffect(() => {
		var userRef = firebase.db.collection('users').doc(userid);
		userRef.get().then(result => {
			if(result.data()){
				setUser(result.data())
				if(result.data().committee){
					var comArr = result.data().committee.map((val, ind) => {
						return(
							<div className='committee-member-child' key={ind}>
								<p>{val['position']}</p>
								<p>of</p>
								<p><Link to={`/committee/${val.id}`} className='link-tag' >{val.name}</Link></p>
							</div>
						)
					})
					setCommitteeArray(comArr);
				}
				if(currentUser.data && result.data().attendedEvents) {
					var events = currentUser.data.attendedEvents.filter((val, ind) => {
						for(var i = 0; i <= ind; i++){
							return currentUser.data.attendedEvents == result.data().attendedEvents[i]
						}
					})
					setCommonEvents(events);
				}
				if(result.data().attendedEvents && result.data().attendedEvents.length > 0){
					setNumberOfEvents(result.data().attendedEvents.length)
				}
			}
		})
		if(currentUser.data){
			setShowDetails(true)
		}

	}, [])



	return (
		<div>
			{ user ? 
				<div className='user'>
					<div className='image-box'>
						<img src={user.profilePicture}/>
					</div>
					{/* <hr style={{
						position: "absolute",
						width: "99%",
						top: "25%",
						zIndex: "-1",
						left: "0",
						display: user.profilePicture ? 'block' : 'none'
					}} /> */}
					<h3>{user.name}</h3>
					<div className='main-user'>
						<div className='intro'>
							<p>{user.description}</p>
							<hr/>
							{ user.committee ?
								<div className='committee-member'>
									{committeeArray}
									<hr/>
								</div>
								:
								null
							}
						</div>
						<div className='user-details'>
							<p>been to <span>{numberOfEvents}</span> {numberOfEvents == 1 ? 'event' : 'events'}</p>
							{currentUser.data ?
								<p><span>{commonEvents.length}</span> events in common</p>
								:
								null
							}
							{user.posts && user.posts.length > 0 ?
								user.posts.map((val, ind) => {
									return <PostCard3 post={val} key={ind} />
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
			        timeout={5000} //3 secs
			    />
			}
		</div>
	)
}	