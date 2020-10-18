import React, { useState, useContext, useEffect} from 'react';
import './sidebar.css';

import {Link} from 'react-router-dom';
import {globalContext} from '../globalContext';
import firebase from '../firebase/index';
import Cookies from 'js-cookie';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
	const [popup, setPopup] = useState(false);
	const {setSidebar, setLoggedIn, loggedIn, currentUser} = useContext(globalContext);

	function googleLogout() {
		firebase.auth.signOut().then(() => {
			setLoggedIn(false);
			Cookies.remove('userID')
		})
	}

	return(
		<div className="sidebar">
			<Popup popup={popup} setPopup={setPopup} setSidebar={setSidebar}/>
			{loggedIn ? 
				<div className="buttons">
					<p>logged in as {currentUser.data ? currentUser.data.name : null} </p>
					<Link to='/'>
						<button
							onClick={googleLogout}
							style={{padding: '10px'}}
						>logout</button>
					</Link>
				</div>
				:
				<Link to='/login' className="buttons" onClick={() => setSidebar(false)}>
					<p>Login</p>
				</Link>	
			}
			<Link to='/create/organization_event' className="buttons" onClick={() => setSidebar(false)}>
		
				<p>Host an event</p>
			</Link>
			<Link to='/create/committee' className="buttons" onClick={() => setSidebar(false)}>create a student organization / council</Link>
			<div className="buttons">about us</div>
		</div>
	)
}

const Popup = (props) => {
	const {popup, setPopup, setSidebar} = props;

	return(
		<div>
			{ popup ?
				<div className='main-popup' style={{textAlign: 'center'}}>
					<div style={{textAlign: 'right'}}>
						<FontAwesomeIcon style={{cursor: 'pointer'}} onClick={() => {setPopup(false)}} icon={faTimes}/>
					</div>
					<h3>what type of event would you like to host?</h3>
					<Link to='/create/personal_event'>
						<button onClick={() => {
							setPopup(false)
							setSidebar(false)
						}}>personal event
						</button>
					</Link>
					<Link to='/create/organization_event'>
						<button onClick={() => {
							setPopup(false)
							setSidebar(false)
						}}>organization event
						</button>
					</Link>
				</div>
				:
				null
			}
		</div>
	)
}