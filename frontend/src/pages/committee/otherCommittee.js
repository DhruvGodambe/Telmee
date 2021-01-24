import React, { useState, useEffect } from 'react';
import firebase from '../../firebase/index';
import logo from '../../images/logo5.png';
import EventCard from '../../components/eventCards';
import 'draft-js/dist/Draft.css';

import {Editor, EditorState, convertFromRaw} from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';

export default function OtherCommittee(props){
	const committeeid = props.history.location.pathname.split('/committee/')[1]
	const [committee, setCommittee] = useState({})
	const [popup, setPopup] = useState(false)
	const [img, setImg] = useState('')
	const [events, setEvents] = useState([])
	const [data, setData] = useState({})
	const [earlyData, setEarlyData] = useState({})
	const [pastEvents, setPastEvents] = useState([])
	const [src1, setSrc1] = useState('')
	const [src2, setSrc2] = useState('')
	const [src3, setSrc3] = useState('')

	useEffect(() => {
		window.scrollTo(0, 0)
		firebase.db.collection('committees').doc(committeeid).get()
		.then(res => {
			if(res.exists){
				setCommittee(res.data())
				console.log('committee: ', res.data())
				firebase.storage.ref(`/committees/${res.data().coverImageName}`).getDownloadURL()
				.then(url => {
					setImg(url)
				})
				Object.keys(res.data().moreImages).forEach((val, ind) => {
					firebase.storage.ref(`/committees/${res.data().moreImages[val]}`).getDownloadURL()
					.then(url => {
						switch(ind){
							case 0:
								setSrc1(url)
								break;
							case 1:
								setSrc2(url)
								break;
							case 2:
								setSrc3(url)
								break;
						}
					})
				})
				res.data().events.forEach(id => {
					firebase.db.collection('events').doc(id).get()
					.then(resp => {
						console.log(resp.data().timeStamp)
						if(new Date(resp.data().timeStamp.heldOn) > Date.now()){
							setData({
								data: resp.data(),
								id: id
							})
						} else {
							setEarlyData({
								data: resp.data(),
								id: id	
							})
						}
					})
				})
			}
		})

	}, [])

	useEffect(() => {
		if(Object.keys(data).length > 0){
			setEvents([data, ...events])
		}
	}, [data])

	useEffect(() => {
		if(Object.keys(earlyData).length > 0){
			setPastEvents([earlyData, ...pastEvents])
		}
	}, [earlyData])

	return(
		<div>
			<Popup popup={popup} members={committee.members} setPopup={setPopup} {...props}/>
			<div>
				{img !== '' ?
					<img width='100%' src={img} />
					:
					<img width='100%' src={logo} />
				}
			</div>
			<h1 className='committee-title'>{committee.name}</h1>
			<div style={{margin: '10px'}}>
				<button
					className='event-nav registered-user member-button'
					onClick={() => {
						setPopup(true)
					}}
				>
					<div style={{margin: '5px', width: '20%'}}>
						<FontAwesomeIcon icon={faUsers}/>
					</div>
					<p style={{width: '80%', fontWeight: 'bold'}}> members </p>
				</button>
			</div>
			<div style={{
				display: 'flex',
				flexDirection: 'row',
				width: '90%',
				margin: '20px auto',
				padding: '10px',
				overflow: 'scroll',
			}}>
				{src2 !== '' ?
					<img 
						style={{
							width: '40%',
							margin: '0 10px',
							maxHeight: '150px',
							border: '2px solid grey',
							borderCollapse: 'seperate',
							borderSpacing: '15px',
							objectFit: 'cover'

						}}
						src={src2}
					/>
					:
					null
				}
				{src1 !== '' ?
					<img 
						style={{
							width: '40%',
							margin: '0 10px',
							maxHeight: '150px',
							border: '2px solid grey',
							borderCollapse: 'seperate',
							borderSpacing: '15px',
							objectFit: 'cover'
						}}
						src={src1}
					/>
					:
					null
				}
				{src3 !== '' ?
					<img 
						style={{
							width: '40%',
							maxHeight: '150px',
							margin: '0 10px',
							border: '2px solid grey',
							borderCollapse: 'seperate',
							borderSpacing: '15px',
							objectFit: 'cover'
						}}
						src={src3}
					/>
					:
					null
				}
			</div>
			<div className='committee-content'>
			{committee.description ?
				<div>
					{typeof(committee.description) == "object" ?
						<Editor
							editorState={EditorState.createWithContent(convertFromRaw(committee.description))}
							readOnly={true}
						/>
						:
						<pre className="pre-description">{committee.description}</pre>
					}
				</div>
				:
				null
			}
			</div>
			{events.length > 0 ?
				<div className='home'>
					<h2 className='committee-title'>Upcoming Events</h2>
					{events.map((val, ind) => {
						return(
							<EventCard
								key={val.id}
								{...props}
								id={val.id}
								event={val.data}
							/>
						)
					})}
				</div>
				:
				null
			}
			{pastEvents.length > 0 ? 
				<div className='home'>
					<h2>past Events</h2>
					{pastEvents.map((val, ind) => {
						return(
							<EventCard
								key={val.id}
								{...props}
								id={val.id}
								event={val.data}
							/>
						)
					})}
				</div>
				: 
				null
			}
		</div>
	)
}

const Popup = (props) => {
	const {popup, setPopup, members} = props;
	const [tempUser, setTempUser] = useState({})
	const [memberArray, setMemberArray] = useState([])

	useEffect(() => {
		if(members){
			members.forEach(mem => {
				console.log('mem: ', mem.id)
				firebase.db.collection('users').doc(mem.id).get()
				.then(res => {
					if(res.exists){
						setTempUser({
							name: res.data().name,
							id: mem.id,
							position: mem.position,
							img: res.data().profilePicture
						})
					}
				})
				.catch(err => {console.log('errorr: ', err)})
			})
		}
	}, [members])

	useEffect(() => {
		if(Object.keys(tempUser).length > 0){
			setMemberArray([...memberArray, tempUser])
		}
	}, [tempUser])

	const cardStyle = {
		width: '80%',
		display: 'flex',
		background: '#333',
		color: 'white',
		margin: '10px auto',
		boxShadow: '0 0 5px black'
	}

	return(
		<div>
			{popup ?
				<div className='main-popup'>
					<div style={{textAlign: 'right', fontSize: '20px'}}>
						<FontAwesomeIcon
							style={{cursor: 'pointer'}}
							icon={faTimes}
							onClick={() => {
								setPopup(false)
							}}
						/>
					</div>
					<h2>Members list</h2>
					<div style={{height: '300px', overflow: 'scroll'}}>
						{memberArray.map((mem, ind) => (
							<div
								onClick={() => {props.history.push(`/user/${mem.id}`)}}
								style={cardStyle}>
								<img width='30%' height='100%' src={mem.img} />
								<div style={{width: '70%', margin: '0'}}>
									<p style={{width: '100%', textAlign: 'left', margin: '5px'}} key={ind}>{mem.name}</p>
									<p style={{width: '100%', textAlign: 'left', margin: '5px'}} key={ind}>position: {mem.position}</p>
								</div>
							</div>
						))}
					</div>
				</div>
				:
				null
			}
		</div>
	)
}

