import React, {useState, useEffect, useContext} from 'react';
import './home.css';
import firebase from '../firebase/index';

import EventCard from '../components/eventCards';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {globalContext} from '../globalContext';

export default function Home(props) {
	const [eventArr, setEventArr] = useState([])
	const [paginate, setPaginate] = useState(false)
	const [paginateDate, setPaginateDate] = useState(0)

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
			setPaginate(true)
			setPaginateDate(res.docs[res.docs.length-1].data().timeStamp.heldOn)
		})
		.catch(err => {console.log('error: ', err)})
	}, [])

	// useEffect(() => {
	// 	console.log(eventArr)
	// }, [eventArr])

	useEffect(() => {
		if(paginate){
			setPaginate(false)
			var temp = eventArr
			firebase.db.collection('events').orderBy('timeStamp.heldOn', 'desc').startAfter(paginateDate).limit(3).get()
			.then(res => {
				// console.log(res)
				if(!res.empty){
					res.docs.forEach((eve, ind) => {
						if(new Date(eve.data().timeStamp.heldOn) > Date.now()){
							console.log(eve.data())
							temp.unshift({data: eve.data(), id: eve.id})
						} else {
							temp.push({data: eve.data(), id: eve.id})
						}
					})
					setEventArr(temp)
					setPaginate(true)
					setPaginateDate(res.docs[res.docs.length-1].data().timeStamp.heldOn)
				}
			})
			.catch(err => {console.log('error: ', err)})
		}
	}, [paginateDate])

	return(
		<div className='home' style={{padding: '0'}}>
			{eventArr.map((val, ind) => (
				<EventCard
					key={val.id}
					{...props}
					id={val.id}
					event={val.data}
				/>
			))}
		</div>
	)
}