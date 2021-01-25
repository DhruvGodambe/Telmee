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
			<p>event sharing social network</p>
		</div>
	)
}