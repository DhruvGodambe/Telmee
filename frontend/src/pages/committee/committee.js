import React, { useEffect, useState, useContext} from 'react'
import firebase from '../../firebase/index'
import {globalContext} from '../../globalContext'

import OtherCommittee from './otherCommittee';
import MyCommittee from './myCommittee';

export default function Committee(props) {
	const committeeid = props.history.location.pathname.split('/committee/')[1]
	const [name, setName] = useState('')
	const {currentUser} = useContext(globalContext)
	const [myComm, setMyComm] = useState(false)

	useEffect(() => {
		firebase.db.collection('committees').doc(committeeid).get()
		.then(res => {
			if(res.exists){
				setName(res.data().name)
			}
		})
	}, [])

	useEffect(() => {
		console.log(currentUser)
		if(currentUser.data && currentUser.data.committee && name !== ''){
			currentUser.data.committee.forEach(comm => {
				if(name == comm.name) {
					setMyComm(true) 
				} else {
					setMyComm(false)
				}
			})
		}

	}, [currentUser, name])

	return(
		<div>
			{myComm ? 
				<MyCommittee {...props}/>
				:
				<OtherCommittee {...props}/>
			}
		</div>
	)
}