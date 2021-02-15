import React, { useState, useEffect } from 'react';
import HomeBG from '../images/home_event_bg_2.svg';
import Logo from '../images/Logo.png';
import imgnet from '../images/business_cover.png'
import './landingPage.css';
import firebase from "../firebase/index";
import {EventCard2} from '../components/eventCards';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser, faArrowRight} from '@fortawesome/free-solid-svg-icons';

export default function LandingPage(props) {
    const [eventArr, setEventArr] = useState([])

    useEffect(() => {
		document.title = "Telmee: Discover new events"
		var temp = [];
		firebase.db.collection('events').orderBy('timeStamp.heldOn', 'desc').limit(3).get()
		.then(res => {
			res.docs.forEach((eve, ind) => {
				if(eve.data().name !== 'Test Event'){
					if(new Date(eve.data().timeStamp.heldOn) > Date.now()){
						temp.unshift({data: eve.data(), id: eve.id})
					} else {
						temp.push({data: eve.data(), id: eve.id})
					}
				}
			})
			setEventArr(temp)
		})
		.catch(err => {console.log('error: ', err)})
	}, [])

    return(
        <div className="landing-page">
            <div className="home-intro">
                <div className="home-nav">
                    <div className="home-nav-left">
                        <div className="home-logo"><img src={Logo} /></div>
                    </div>
                    <div className="home-nav-right">
                        <div className="nav-right-comps">
                            <button onClick={() => {props.history.push("/login")}}><FontAwesomeIcon icon={faUser}/> Login</button>
                        </div>
                        <div
                            style={{cursor: 'pointer'}}
                            className="nav-right-comps"
                            onClick={() => {props.history.push("/home#about")}}>About</div>
                    </div>
                </div>
                <div className="home-organisation">
                    <p>member of an organisation?</p>
                    <p
                        onClick={() => {props.history.push("/create/organization_event")}}
                        style={{textDecoration: 'underline', cursor: 'pointer'}}>hold an event <FontAwesomeIcon icon={faArrowRight} /></p>
                </div>
            </div>
            <div style={{width: '60%', margin: '20px auto'}}>
                <hr/>
            </div>
            <div className="home-upcoming">
                <h2>UPCOMING EVENTS</h2>
                <div className="upcoming-list">
                <div style={{cursor: 'pointer'}} className="event-card-2" onClick={() => {props.history.push(`/event/${props.id}`)}}>
                    <div className="event-card-image">
                        <img src={imgnet}/>
                    </div>
                    <div className="event-card-content">
                        <h3>Small Business Series</h3>
                        <p className="organized">Asia Society</p>
                        {/* <p>{new Date(event.timeStamp.heldOn) < Date.now() ? null : 'will be'} held on {getStdDate(event.timeStamp.heldOn)}</p> */}
                        {/* <hr />
                        <p>{description !== "" ? description.substring(0, 200) + '...' : null}</p> */}
                    </div>
                </div>
                    {eventArr.map((val, ind) => (
                        <EventCard2
                            key={val.id}
                            {...props}
                            id={val.id}
                            event={val.data}
                        />
                    ))}
                    {eventArr.length >= 3 ?
                        <div
                        onClick={() => {props.history.push("/")}}
                        style={{
                            width: '200px',
                            alignItems: 'center',
                            background: '#E79981',
                            color: 'white',
                            padding: '50px',
                            margin: '10px',
                            borderRadius: '10px',}}>
                            <p style={{
                                alignItems: 'center',
                                margin: '50% auto'}}>See more <FontAwesomeIcon icon={faArrowRight} /> </p>    
                        </div>
                        :
                        null
                    }
                </div>
            </div>
            <div style={{width: '60%', margin: '20px auto'}}>
                <hr/>
            </div>
            <div className="home-about" id="about">
                <h2>ABOUT US</h2>
                <p>Telmee is an easy to use platform dedicated to bring together the event organizing committees and the interested audience.</p>
                <div style={{width: '50px', margin: '0 auto'}}><hr/></div>
                <p>This app is mainly designed for the students and committees of Datta Meghe College of Engineering</p>
                <div style={{width: '50px', margin: '0 auto'}}><hr/></div>
                <p>The problem that we are trying to solve here is to make every event accessible to every student. The most simple UI to understand the contents of the event and register for it with least of your efforts.</p>
                <div style={{width: '50px', margin: '0 auto'}}><hr/></div>
                <p>Users can also post images about the event that they attended for others to have a more clear understanding of the event.</p>
            </div>
            <div style={{width: '100%', height: '100px', border: '2px solid #e78060', background: '#E79981'}}>

            </div>
        </div>
    )
}