import React, { useState, useEffect, useContext } from 'react'
import {globalContext} from '../../globalContext'
import firebase from '../../firebase/index'
import OtherEvent from './otherEvent'
import MyEvent from './myEvent'
import Cookies from 'js-cookie';

export default function Event(props) {
	const eventid = props.history.location.pathname.split('/event/')[1]
	const {currentUser} = useContext(globalContext)
	const [committee, setCommittee] = useState({})
	const [admin, setAdmin] = useState(false)

	useEffect(() => {
		// if(Cookies.get('userID')){
			firebase.db.collection('events').doc(eventid).get()
			.then(res => {
				if(res.exists){
					setCommittee(res.data().organizingCommittee)
				}
			})
		// } else {
		// 	props.history.push("/login")
		// }
	}, [])

	useEffect(() => {
		if(currentUser.data){
			if(currentUser.data.committee && committee.id){
				currentUser.data.committee.forEach(comm => {
					if(comm.id == committee.id){
						setAdmin(true)
					}
				})
			}
		}
	}, [currentUser, committee])

	return(
		<div>
			{admin ?	
				<MyEvent {...props} />
				:
				<OtherEvent {...props} />
			}
		</div>
	)
}