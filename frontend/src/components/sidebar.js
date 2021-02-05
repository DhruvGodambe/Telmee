import React, { useState, useContext, useEffect} from 'react';
import './sidebar.css';

import {Link} from 'react-router-dom';
import {globalContext} from '../globalContext';
import firebase from '../firebase/index';
import Cookies from 'js-cookie';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar(props) {
	const [popup, setPopup] = useState(false);
	const {setSidebar, setLoggedIn, loggedIn, currentUser} = useContext(globalContext);

	function googleLogout() {
		firebase.auth.signOut().then(() => {
			setLoggedIn(false);
			Cookies.remove('userID')
			window.location.reload()
		})
	}

	return(
		<div className="sidebar" style={{display: window.innerWidth > 720 ? 'flex' : props.sidebar ? 'flex' : 'none'}}>
			<Popup popup={popup} setPopup={setPopup} setSidebar={setSidebar}/>
			{loggedIn ? 
				<div className="buttons">
					<div>
						<img style={{width: '30%', borderRadius: '10px'}} src={currentUser.data?.profilePicture ? currentUser.data.profilePicture : ""} />
					</div>
					<p className="loggedIn">logged in as {currentUser.data ? currentUser.data.name : null} </p>
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
			<Link to="/about" className="buttons" onClick={() => setSidebar(false)}>about us</Link>
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