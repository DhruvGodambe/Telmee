import React, { useState, useEffect } from 'react';
import firebase from '../../firebase/index';
import logo from '../../images/logo5.png';
import EventCard from '../../components/eventCards';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';

export default function MyCommittee(props){
	const committeeid = props.history.location.pathname.split('/committee/')[1]
	const [committee, setCommittee] = useState({})
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
					className='event-nav registered-user'
					onClick={() => {
						props.history.push({
							pathname: `/committee/members/${committeeid}`,
						})
					}}
				>
					<div style={{margin: '5px', width: '20%'}}><FontAwesomeIcon style={{ fontSize: '30px'}} icon={faUsers}/></div>
					<p style={{width: '80%', fontWeight: 'bold'}}> members </p>
				</button>
			</div>
			<div style={{margin: '10px'}}>
				<button
					style={{minWidth: '40%'}}
					className='event-nav'
					onClick={() => {
						props.history.push({
							pathname: `/committee/add_images/${committeeid}`,
							query: {
								committeeName: committee.name
							}
						})
					}}
				>
					<div style={{margin: '5px 10px', width: '20%'}}><FontAwesomeIcon style={{ fontSize: '30px'}} icon={faCameraRetro}/></div>
					<p style={{width: '80%', fontWeight: 'bold'}}> add images </p>
				</button>
			</div>
			<div style={{margin: '10px'}}>
				<button
					style={{minWidth: '40%'}}
					className='event-nav'
					onClick={() => {
						props.history.push({
							pathname: `/committee/edit/${committeeid}`,
							query: committee
						})
					}}
				>
					<div style={{margin: '5px 10px', width: '20%'}}><FontAwesomeIcon style={{ fontSize: '30px'}} icon={faEdit}/></div>
					<p style={{width: '80%', fontWeight: 'bold'}}> edit </p>
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
			</div>
			<div className='committee-content'>
				{committee && committee.description ?
					<div className='event-content'>
						<pre style={{
							margin: '10px',
							color: 'inherit',
							fontSize: '15px',
							wordWrap: 'break-word',
							wordSpacing: '3px',
							lineHeight: '22px',
							width: '100%',
							whiteSpace: 'pre-wrap',
							whiteSpace: '-moz-pre-wrap',  /* Mozilla, since 1999 */
							whiteSpace: '-pre-wrap',     /* Opera 4-6 */
							whiteSpace: '-o-pre-wrap',   /* Opera 7 */
						}}>
							{committee.description}
						</pre>
						<hr/>
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