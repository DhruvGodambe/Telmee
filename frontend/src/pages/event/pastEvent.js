import React, { useState, useEffect } from 'react'
import firebase from '../../firebase/index'
import Cookies from 'js-cookie';
import logo from '../../images/logo5.png';
import {Link} from 'react-router-dom'
import {PostCard2} from '../../components/postCards'
import 'draft-js/dist/Draft.css';
import {Editor, EditorState, convertFromRaw} from 'draft-js';

export default function PastEvent(props) {
	const [event, setEvent] = useState({})
	const eventid = props.history.location.pathname.split('/past/')[1]
	const [img, setImg] = useState('');

	useEffect(() => {
		firebase.db.collection('events').doc(eventid).get()
		.then(res => {
			if(res.exists){
				setEvent(res.data())
				firebase.storage.ref(`/events/${res.data().coverImageName}`).getDownloadURL()
				.then(url => {
					setImg(url);
				})
			}
		})
		.catch(err => {console.log('errorr: ', err)})
	}, [])

	const getStdDate = (dateStr) => {
		const d = new Date(dateStr);
		return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
	}

	const FONT = 'Palatino, serif';

	return(
		<div>
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
					<h3 style={{margin: '5px 0'}}>Organized by
						<Link
							style={{ marginLeft: '5px', color: '#ff003f', opacity: '0.5'}}
							to={`/committee/${event.organizingCommittee.id}`}
						>
						{event.organizingCommittee.name}
						</Link>
					</h3>
					{event.oneDay ?
						<div>
							<p style={{margin: '0', color: 'grey'}}>held on {getStdDate(event.timeStamp.heldOn)}</p>
						</div>
						:
						<div>
							<p style={{margin: '0', color: 'grey'}}>from {getStdDate(event.timeStamp.heldOn)}</p>
							<p style={{margin: '0', color: 'grey'}}>to {event.timeStamp.finishedOn}</p>
						</div>
					}
					{event.venue ?
						<p style={{margin: '5px 0 30px', color: 'grey'}}>venue: {event.venue}</p>
						:
						null
					}
					{typeof(event.description) == "object" ?
						<Editor
							editorState={EditorState.createWithContent(convertFromRaw(event.description))}
							readOnly={true}
						/>
						:
						<pre className="pre-description">{event.description}</pre>
					}
					{/* {event.description ?
						<pre style={{fontFamily: FONT}}>{event.description}</pre>
						:
						null
					} */}
					{event.posts.length > 0 ?
						<div className='user'>
							{event.posts.map((val, ind) => {
								return <PostCard2 post={val} key={ind} />
							})}
						</div>
						:
						null
					}
				</div>
				: 
				null
			}
		</div>
	)
}