import React, { useState, useEffect } from 'react';
import './App.css';

import Home from './pages/home';
import About from './pages/about';
import Login from './pages/login';
import Search from './pages/search';
import Test from './pages/test';
import LandingPage from './pages/landingPage';
import UserLogin from './pages/userLogin';
import EditUser from './pages/user/editUser';
import MyUser from './pages/user/myUser';
import User from './pages/user/user';
import UserEditProfile from './pages/user/userEditProfile';
import UserEditPicture from './pages/user/userEditPicture';
import UploadPost from './pages/user/uploadPost';
import Event from './pages/event/event';
import PastEvent from './pages/event/pastEvent';
import AddEventMedia from './pages/event/addEventMedia';
import RegisteredUsers from './pages/event/registeredUsers';
import AttendedUsers from './pages/event/attendedUsers';
import RegisterEvent from './pages/event/registerEvent';
import EditEvent from './pages/event/editEvent';
import CreateEvent from './pages/event/createEvent';
import ViewEventForm from './pages/event/viewEventForm';
import DynamicEventForm from './pages/event/dynamicEventForm';
import Committee from './pages/committee/committee';
import CreateCommittee from './pages/committee/createCommittee';
import CommitteeMembers from './pages/committee/committeeMembers';
import EditCommittee from './pages/committee/editCommittee';
import AddImages from './pages/committee/addImages';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import { globalContext } from './globalContext';
import firebase from './firebase/index';
import Cookies from 'js-cookie';
import MyEditor from './components/draftjsLink';
import {AuthEditUser, AuthMyUser, AuthLogin} from './authRoutes';


import { BrowserRouter as Router, Switch, Route, Link, useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [search, setSearch] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    var userRef = firebase.db.collection('users').doc(`${Cookies.get('userID')}`);
    if(Cookies.get('userID')){
      userRef.get()
      .then(res => {
        setCurrentUser({
          data: res.data(),
          id: res.id
        });
        setLoggedIn(true);
      })
    }
  }, [])

  return (
    <div className="App">
      <globalContext.Provider value={{
        search, setSearch, sidebar, setSidebar, currentUser, setCurrentUser,
        setLoggedIn, loggedIn
      }}>
        <Router>
          <Navbar/>
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
            <div className='icons' onClick={() => {setSidebar(!sidebar)}}>
              <FontAwesomeIcon icon={faBars}/>
            </div>
          </div>
          <div className="main-container">
            <div className="page">
              <Switch>
                <Route exact path="/" component={Home}/>
                <Route exact path="/about" component={About} />
                <Route exact path="/search" component={Search}/>
                <Route exact path="/test" component={Test}/>
                <Route exact path="/home" component={LandingPage}/>
                <AuthLogin exact path="/login" component={Login}/>
                <AuthLogin exact path="/user-login" component={UserLogin}/>
                <AuthMyUser exact path="/user/:userid" component={MyUser}/>
                <AuthEditUser exact path='/user/edit/:userid' component={EditUser}/>
                <Route exact path='/user/userEditProfile/:userid' component={UserEditProfile} />
                <Route exact path='/user/userEditPicture/:userid' component={UserEditPicture} />
                <Route exact path='/user/upload/post' component={UploadPost} />
                <Route exact path='/event/:eventid' component={Event} />
                <Route exact path='/event/edit/:eventid' component={EditEvent} />
                <Route exact path='/event/add_media/:eventid' component={AddEventMedia} />
                <Route exact path='/event/register/:eventid' component={RegisterEvent} />
                <Route exact path='/event/get/:eventid' component={RegisteredUsers} />
                <Route exact path='/event/attended/:eventid' component={AttendedUsers} />
                <Route exact path='/event/past/:eventid' component={PastEvent} />
                <Route exact path='/create/personal_event' component={CreateEvent} />
                <Route exact path='/create/organization_event' component={CreateEvent} />
                <Route exact path='/create/eventForm/:id' component={DynamicEventForm} />
                <Route exact path='/event/view_form/:id' component={ViewEventForm} />
                <Route exact path='/create/committee' component={CreateCommittee} />
                <Route exact path='/committee/:committeeid' component={Committee} />
                <Route exact path='/committee/members/:committeeid' component={CommitteeMembers} />
                <Route exact path='/committee/edit/:committeeid' component={EditCommittee} />
                <Route exact path='/committee/add_images/:committeeid' component={AddImages} />
              </Switch>
            </div>
            <div className={sidebar ? 'side-active' : 'side'}>
              <div style={{display: window.innerWidth > 720 ? "none" : "block"}}><FontAwesomeIcon className="navbar-x" onClick={() => {setSidebar(false)}} icon={faTimes} /></div>
              <Sidebar sidebar={sidebar} />
            </div>
          </div>
        </Router>
      </globalContext.Provider>
    </div>
  );
}

export default App;
