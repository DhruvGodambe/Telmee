import React , {useState, useEffect, useContext} from 'react';
import {globalContext} from '../../globalContext';
import './createEvent.css';
import Cookies from 'js-cookie';

import {PersonalEvent, OrganizationEvent} from './eventForm.js';
import bg from '../../images/bg3.png'

export default function CreateEvent(props) {
	const {currentUser} = useContext(globalContext);
	const [popup, setPopup] = useState(false)
	const eventType = window.location.href.split('/create/')[1];
	const userID = Cookies.get('userID')

	useEffect(() => {
		// if(!userID){
		// 	props.history.push('/login')
		// }
	}, [])

	return(
		<div className='create-event-box'>
			<div style={{width: '100%', margin: '0', backgroundImage: `url(${bg})`, height: '180px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}} >
				<br/>
				<br/>
				<br/>
				<h1>Host an Event</h1>
			</div>
			{eventType == 'organization_event' ?
				<OrganizationEvent {...props}/>
				:
				<PersonalEvent {...props}/>
			}
		</div>
	)
}

const Popup = (props) => {
	const {popup, setPopup} = props;

	return(
		<div>
			{ popup ?
				<div className='main-popup' style={{textAlign: 'center'}}>
					<h3>Sorry, you cannot host organization event unless you are a member of that organization</h3>
					<button onClick={() => {
						setPopup(false);
						props.history.goBack();
					}}>OK
					</button>
				</div>
				:
				null
			}
		</div>
	)
}