import React, {useContext} from 'react';
import './navbar.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faSearch, faAngleLeft } from '@fortawesome/free-solid-svg-icons';

import {globalContext} from '../globalContext';
import {Link} from 'react-router-dom';

export default function Navbar() {
	const {search , currentUser, setSearch, sidebar, setSidebar, loggedIn} = useContext(globalContext);
	return(
		<div className="nav-icons">
            <div className='icons'>
              <Link to='/'>
                <FontAwesomeIcon icon={faHome}/>
              </Link>
            </div>
            <div className='icons'
            // onClick={() => {
            //   document.getElementsByClassName("home")[0].classList.add("not-home")
            //   document.getElementsByClassName("home")[0].classList.toggle("home", false)
            // }}
            >
              <Link to={loggedIn ? `/user/${currentUser.id}` : '/user-login'}>
                <FontAwesomeIcon icon={faUser}/>
              </Link>
            </div>
            <div className='icons'>
              <Link to='/search'>
                <FontAwesomeIcon icon={faSearch}/>
              </Link>
            </div>
            <div className='icons'>
              <FontAwesomeIcon icon={faBars}/>
            </div>
            <div
              className='icons'
              onClick={() => {
                // setSidebar(!sidebar)
                document.getElementsByClassName("nav-icons")[0].classList.remove("show-nav-icons")
              }}>
              <FontAwesomeIcon icon={faAngleLeft}/>
            </div>
        </div>
	)
}