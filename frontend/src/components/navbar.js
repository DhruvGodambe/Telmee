import React, {useContext} from 'react';
import './navbar.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import {globalContext} from '../globalContext';
import {Link} from 'react-router-dom';

export default function Navbar() {
	const {search , currentUser, setSearch, sidebar, setSidebar, loggedIn} = useContext(globalContext);
	return(
		<div className='navbar' >
			<h1>Telmee</h1>
			<p>an event sharing social networking app</p>
			<div className="nav-icons">
				<div className='icons'>
					<Link to='/'>
						<FontAwesomeIcon icon={faHome} size='2x'/>
					</Link>
				</div>
				<div className='icons'>
					<Link to={loggedIn ? `/user/${currentUser.id}` : '/user-login'}>
						<FontAwesomeIcon icon={faUser} size='2x'/>
					</Link>
				</div>
				<div className='icons'>
					<Link to='/search'>
						<FontAwesomeIcon icon={faSearch} size='2x'/>
					</Link>
				</div>
				<div className='icons' onClick={() => {setSidebar(!sidebar)}}>
					<FontAwesomeIcon icon={faBars} size='2x'/>
				</div>
			</div>
		</div>
	)
}