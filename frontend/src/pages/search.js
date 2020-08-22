import React, { useState, useEffect, useContext } from 'react'
import {globalContext} from '../globalContext'
import firebase from '../firebase/index'
import './search.css'
import logo from '../images/logo5.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Search(props) {
	const [activeTab, setActiveTab] = useState('events')
	const [searchQuery, setSearchQuery] = useState('')
	const [events, setEvents] = useState([])
	const [committees, setCommittees] = useState([])
	const [users, setUsers] = useState([])
	const [suggestionArr, setSuggestionArr] = useState([])

	useEffect(() => {
		console.log('start')
		firebase.db.collection('events').get()
		.then(res => {
			var temp = []
			res.docs.forEach(doc => {
				temp.push({
					name: doc.data().name,
					id: doc.id,
					coverImageName: doc.data().coverImageName
				})
			})
			setEvents(temp)
			firebase.db.collection('committees').get()
			.then(resp => {
				var temp2 = []
				resp.docs.forEach(doc => {
					temp2.push({
						id: doc.id,
						name: doc.data().name,
						coverImageName: doc.data().coverImageName
					})
				})
				setCommittees(temp2)
				firebase.db.collection('users').get()
				.then(response => {
					var temp3 = []
					response.docs.forEach(doc => {
						temp3.push({
							id: doc.id,
							name: doc.data().name,
							coverImageName: doc.data().profilePicture
						})
					})
					setUsers(temp3)
				})
			})
		})
	}, [])

	useEffect(() => {
		switch(activeTab){
			case 'events':
				eventSearch()
				break;
			case 'committees':
				committeeSearch()
				break;
			case 'users':
				userSearch();
				break;
			default:
				eventSearch();
				break;
		}
	}, [activeTab])

	const handleSearch = (e) => {
		setSearchQuery(e.target.value)
		switch(activeTab){
			case 'events':
				eventSearch()
				break;
			case 'committees':
				committeeSearch()
				break;
			case 'users':
				userSearch()
				break;
		}
	}

	const eventSearch = () => {
		setActiveTab('events')
		if(searchQuery !== ''){
			setSuggestionArr([])
			var temp = []
				events.forEach(eve => {
					if(eve.name.toLowerCase().includes(searchQuery.toLowerCase())){
						temp.push(eve)
					}
				})
			setSuggestionArr(temp)
		}
	}

	const committeeSearch = () => {
		setActiveTab('committees')
		if(searchQuery !== ''){
			setSuggestionArr([])
			var temp = []
				committees.forEach(comm => {
					if(comm.name.toLowerCase().includes(searchQuery.toLowerCase())){
						temp.push(comm)
					}
				})
			setSuggestionArr(temp)
		}
	}

	const userSearch = () => {
		setActiveTab('users')
		if(searchQuery !== ''){
			setSuggestionArr([])
			var temp = []
				users.forEach(user => {
					if(user.name.toLowerCase().includes(searchQuery.toLowerCase())){
						temp.push(user)
					}
				})
			setSuggestionArr(temp)
		}
	}

	return(
		<div className='search'>
			<div className="search-bar" style={{display: 'flex'}}>
		          <input
		          	placeholder='search by name'
		          	onChange={handleSearch}
		          />
	          <div className='search-icon'>
	            <FontAwesomeIcon icon={faSearch} size='2x'/>
	          </div>
	        </div>
	        <div>
	        	<div
	        		style={{
	        			display: 'flex',
	        			flexDirection: 'row'
	        		}}>
	        		<div
	        			style={{
	        				borderBottom: activeTab == 'events' ? '2px #f03 solid' : 'inherit',
	        				transition: '0.3s'
	        			}} 
	        			onClick={eventSearch}
	        			className='search-tab'>events</div>
	        		<div
	        			style={{
	        				borderBottom: activeTab == 'committees' ? '2px #f03 solid' : 'inherit',
	        				transition: '0.3s'
	        			}} 
	        			onClick={committeeSearch}
	        			className='search-tab'>organizations</div>
	        		<div
	        			style={{
	        				borderBottom: activeTab == 'users' ? '2px #f03 solid' : 'inherit',
	        				transition: '0.3s'
	        			}} 
	        			onClick={userSearch}
	        			className='search-tab'>users</div>
	        	</div>
	        	<div>
	        		{suggestionArr.map((val, ind) => {
	        			if(val.name !== ''){
	        				return <SuggestionCard {...props} activeTab={activeTab} data={val} key={ind} />
	        			}
	        		})}
	        	</div>
	        </div>
	    </div>
	)
}

const SuggestionCard = (props) => {
	const {activeTab, data} = props
	const [image, setImage] = useState('')

	useEffect(() => {
		if(activeTab == 'users'){
			setImage(data.coverImageName)
		} else {
			firebase.storage.ref(`/${activeTab}/${data.coverImageName}`).getDownloadURL()
			.then(url => {
				setImage(url)
			})
		}
	}, [data])

	return(
		<div 
			style={{
				display: 'flex',
				flexDirection: 'row',
				margin: '10px auto',
				width: '90%',
				boxShadow: '0 0 5px black',

			}}
			onClick={() => {
				switch(activeTab){
					case 'events':
						props.history.push(`/event/${data.id}`)
						break;
					case 'committees':
						props.history.push(`/committee/${data.id}`)
						break;
					case 'users':
						props.history.push(`/user/${data.id}`)
						break;
				}
			}}
		>
			<div style={{width: '100px', height: '100px'}}>
				{image !== '' ?
					<img style={{objectFit: 'cover', height: '100%', width: '100%'}} src={image} />
					:
					<img style={{width: '100%'}} src={logo} />
				}
			</div>
			<div style={{textAlign: 'center'}}>
				<h3 style={{margin: '10px'}}>{data.name}</h3>
			</div>
		</div>
	)
}