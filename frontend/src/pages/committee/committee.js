import React, { useEffect, useState, useContext} from 'react'
import firebase from '../../firebase/index'
import {globalContext} from '../../globalContext'

import OtherCommittee from './otherCommittee';
import MyCommittee from './myCommittee';

export default function Committee(props) {
	const committeeid = props.history.location.pathname.split('/committee/')[1]
	const [Id, setId] = useState('')
	const {currentUser} = useContext(globalContext)
	const [myComm, setMyComm] = useState(false)

	useEffect(() => {
		firebase.db.collection('committees').doc(committeeid).get()
		.then(res => {
			if(res.exists){
				setId(res.id)
			}
		})
		console.log(currentUser)
	}, [])

	useEffect(() => {
		if(currentUser.data?.committee && Id !== ''){
			console.log(currentUser.data.committee)
			currentUser.data.committee.forEach(comm => {
				if(Id == comm.id) {
					setMyComm(true) 
				}
			})
		}
	}, [currentUser, Id])

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