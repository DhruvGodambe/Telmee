import React, {useContext} from 'react';
import './navbar.css';
import Logo from '../images/Logo.png';

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
            <div className='icons' style={{
              background: "#FAF2EF",
              margin: '0'
            }}>
              <img src={Logo} width="30%" />
            </div>
            <div className='icons'>
              <Link to='/'>
                <FontAwesomeIcon icon={faHome}/><br/><span>home</span>
              </Link>
            </div>
            <div className='icons'
            // onClick={() => {
            //   document.getElementsByClassName("home")[0].classList.add("not-home")
            //   document.getElementsByClassName("home")[0].classList.toggle("home", false)
            // }}
            >
              <Link to={loggedIn ? `/user/${currentUser.id}` : '/user-login'}>
                <FontAwesomeIcon icon={faUser}/><br/><span>profile</span>
              </Link>
            </div>
            <div className='icons'>
              <Link to='/search'>
                <FontAwesomeIcon icon={faSearch}/><br/><span>search</span>
              </Link>
            </div>
            <div className='icons'>
              <FontAwesomeIcon icon={faBars}/><br/><span>more</span>
            </div>
            <div
              className='icons'
              onClick={() => {
                // setSidebar(!sidebar)
                document.getElementsByClassName("nav-icons")[0].classList.remove("show-nav-icons")
              }}>
              <FontAwesomeIcon icon={faAngleLeft}/><br/><span>close</span>
            </div>
        </div>
	)
}