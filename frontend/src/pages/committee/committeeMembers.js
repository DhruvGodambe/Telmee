import React, { useState, useEffect, useContext } from 'react'
import firebase from '../../firebase/index'
import './committee.css'
import {globalContext} from '../../globalContext'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';

export default function CommitteeMembers(props) {
	const committeeid = props.history.location.pathname.split('/members/')[1]
	const {currentUser} = useContext(globalContext)
	const [committee, setCommittee] = useState({})
	const [Id, setId] = useState('');
	const [members, setMembers] = useState([])
	const [user, setUser] = useState({})
	const [popup, setPopup] = useState(false)
	const [optionPopup, setOptionPopup] = useState(false)
	const [optionUser, setOptionUser] = useState({})
	const [myComm, setMyComm] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0)
		firebase.db.collection('committees').doc(committeeid).get()
		.then(res => {
			if(res.exists){
				setCommittee(res.data())
				setId(res.id)
				console.log(res.data())
				res.data().members.forEach(member => {
					firebase.db.collection('users').doc(member.id).get()
					.then(result => {
						if(result.exists){
							setUser({
								id: result.id,
								name: result.data().name,
								email: result.data().email,
								profilePicture: result.data().profilePicture,
								position: member.position
							})
						}
					})
				})
			}
		})
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

	useEffect(() => {
		if(Object.keys(user).length > 0){
			setMembers([user, ...members])
			console.log(user)
		}
	}, [user])

	return(
		<div>
			<Popup
				committeeid={committeeid}
				popup={popup}
				setPopup={setPopup}
				committeeName={committee.name}
				members={members}
			/>
			<OptionPopup 
				optionPopup={optionPopup}
				setOptionPopup={setOptionPopup}
				optionUser={optionUser}
				setOptionUser={setOptionUser}
				committeeid={committeeid}
				members={committee.members}
				committeeName={committee.name}
				currentUser={currentUser}
			/>
			<h2 className='committee-title'>Members of {committee.name}</h2>
			{myComm ?
				<div style={{margin: '20px'}}>
					<button
						className='event-nav registered-user'
						onClick={() => {
							setPopup(true)
						}}
					>
						<div style={{margin: '5px', width: '20%'}}><FontAwesomeIcon style={{ fontSize: '30px'}} icon={faUser}/></div>
						<p style={{width: '80%', fontWeight: 'bold'}}> add member <b>+</b> </p>
					</button>
				</div>
				:
				null
			}
			{members.map((val, ind) => {
				return (
					<MemberCard
						user={val}
						key={ind}
						setOptionPopup={setOptionPopup}
						setOptionUser={setOptionUser}
						myComm={myComm}
					/>
				)
			})}
		</div>
	)
}

const MemberCard = (props) => {
	const {user, setOptionPopup, setOptionUser, myComm} = props
	const [selected, setSelected] = useState(false)
	console.log(user)
	const history = useHistory()

	return(
		<div className='registered-user-box'>
			<div className='registered-user-image-box'>
				<img
					width='100%'
					style={{borderRadius: '10px'}}
					onClick={() => {history.push("/user/" + user.id)}}
					src={user.profilePicture} />
			</div>
			<div className='registered-user-details'>
				<FontAwesomeIcon
					onClick={() => {
						setOptionPopup(true)
						setOptionUser(user)
					}}
					className="registered-user-option-button"
					style={{
						display: myComm ? 'block' : 'none',
					}}
					icon={faBars}
				/>
				<p style={{wordWrap: 'break-word'}}  onClick={() => {history.push("/user/" + user.id)}}><b>{user.name}</b></p>
				<p style={{wordWrap: 'break-word', color: 'grey'}}>position: {user.position}</p>
			</div>
			
		</div>
	)
}

const MemberCard2 = (props) => {
	const {user, id, setMemberUsers, memberUsers, members} = props
	const [selected, setSelected] = useState(false)

	return(
		<div
			style={{background: selected ? 'skyblue' : 'white'}}
			className='registered-user-box'
			onClick={() => {
				var unique = true;
				members.forEach(u => {
					console.log(u, user, id)
					if(u.id === id){
						unique = false;
					}
				})
				if(!selected){
					if(unique){
						setMemberUsers([
							...memberUsers,
							{
								id: id,
								email: user.email,
								profilePicture: user.profilePicture,
								position: 'member'
							}
						])
					}
				} else {
					var temp = memberUsers.filter((val, ind) => (val.id !== id))
					setMemberUsers(temp)
				}
				setSelected(!selected)
				console.log('member users: ', memberUsers)
			}}
			>
			<div className='registered-user-image-box'>
				<img width='100%' src={user.profilePicture} />
			</div>
			<div className='registered-user-details'>
			<p style={{color: 'black', wordWrap: 'break-word'}}><b>{user.name}</b></p>
			<p style={{wordWrap: 'break-word', color: 'grey'}}>{user.email}</p>
			</div>
			
		</div>
	)
}

const Popup = (props) => {
	const {popup, setPopup, committeeid, committeeName, members} = props;
	const [users, setUsers] = useState([])
	const [suggestion, setSuggestion] = useState([])
	const [memberUsers, setMemberUsers] = useState([])

	useEffect(() => {
		firebase.db.collection('users').get()
		.then(res => {
			var temp = []
			res.docs.forEach(user => {
				temp.push({data: user.data(), id: user.id})
			})
			setUsers(temp)
		})
	}, [])

	const handleChange = (e) => {
		let arr = []
		users.forEach(user => {
			let isTheOne = false
			for(var i = 0; i < e.target.value.length; i++){
			    if(e.target.value[i].toLowerCase() == user.data.email[i]){
			    	isTheOne = true;
			    } else {
			    	isTheOne = false;
			    	break;
			    }
			}
			if(isTheOne){
				arr.push(user)
			}
		})
		setSuggestion(arr)
	}

	const handleAdd = () => {
		let arr = memberUsers.map(user => ({id: user.id, position: user.position}))
		console.log(arr)
		if(arr.length > 0){
			firebase.db.collection('committees').doc(committeeid).update({
				members: firebase.firebase.firestore.FieldValue.arrayUnion(...arr)
			})
			.then(res => {
				arr.forEach(user => {
					firebase.db.collection('users').doc(user.id).update({
						committee: firebase.firebase.firestore.FieldValue.arrayUnion({
							id: committeeid,
							name: committeeName,
							position: user.position
						})
					})
				})
				setPopup(false)
				window.location.reload()
			})
		} else {
			setPopup(false)
			window.location.reload()
		}
	}

	return(
		<div>
			{popup ?
				<div style={{height: '450px'}} className='main-popup'>
					<div style={{textAlign: 'right', fontSize: '20px'}}>
						<FontAwesomeIcon
							style={{cursor: 'pointer'}}
							icon={faTimes}
							onClick={() => {
								setPopup(false)
							}}
						/>
					</div>
					<input
						type='text'
						placeholder='search by email'
						style={{
							width: '80%',
							margin: '10px auto',
							fontSize: '16px',
							padding: '8px',
							borderRadius: '15px',
							border: 'none',
							outline: 'none'
						}}
						onChange={handleChange}
					/>
					<div style={{
						height: '300px',
						overflow: 'scroll',
						background: suggestion.length > 0 ? '#f03' : 'none'
					}}>
						{suggestion.map((val, ind) => {
							return (
								<MemberCard2
									setMemberUsers={setMemberUsers}
									memberUsers={memberUsers}
									user={val.data}
									id={val.id}
									key={ind}
									members={members}
								/>
							)
						})}
					</div>
					<button onClick={handleAdd}>add <b>+</b></button>
				</div>
				:
				null
			}
		</div>
	)
}

const OptionPopup = (props) => {
	const {optionUser, setOptionUser, optionPopup, setOptionPopup, committeeName, committeeid, members, currentUser} = props;

	useEffect(() => {
		setOptionUser({
			...optionUser,
			oldPosition: optionUser.position
		})
		console.log(optionUser)
	}, [optionPopup])

	const handleSubmit = () => {
		let arr = members.map(val => {
			if(val.id == optionUser.id){
				return {id: optionUser.id, position: optionUser.position}
			} else {
				return val
			}
		})

		firebase.db.collection('committees').doc(committeeid).update({
			members: arr
		}).then(res => {
			firebase.db.collection('users').doc(optionUser.id).update({
				committee: firebase.firebase.firestore.FieldValue.arrayRemove({
					id: committeeid,
					name: committeeName,
					position: optionUser.oldPosition
				})
			}).then(resp => {
				firebase.db.collection('users').doc(optionUser.id).update({
					committee: firebase.firebase.firestore.FieldValue.arrayUnion({
						id: committeeid,
						name: committeeName,
						position: optionUser.position
					})
				}).then(response => {
					window.location.reload()
				})
			})
		})
	}

	const handleRemoveMember = () => {
		firebase.db.collection('committees').doc(committeeid).update({
			members: firebase.firebase.firestore.FieldValue.arrayRemove({
				id: optionUser.id,
				position: optionUser.position
			})
		})
		.then(res => {
			firebase.db.collection('users').doc(optionUser.id).update({
				committee: firebase.firebase.firestore.FieldValue.arrayRemove({
					id: committeeid,
					name: committeeName,
					position: optionUser.position
				})
			})
			.then(resp => {
				window.location.reload()
			})
		})
	}

	return(
		<div>
			{ optionPopup ?
				<div className='main-popup'>
					<div style={{textAlign: 'right', fontSize: '20px'}}>
						<FontAwesomeIcon
							style={{cursor: 'pointer'}}
							icon={faTimes}
							onClick={() => {
								setOptionPopup(false)
							}}
						/>
					</div>
					<div className='registered-user-box'>
						<div className='registered-user-image-box'>
							<img width='100%' style={{borderRadius: '10px'}} src={optionUser.profilePicture} />
						</div>
						<div className='registered-user-details'>
							<p style={{color: 'black', wordWrap: 'break-word'}}><b>{optionUser.name}</b></p>
							<p style={{wordWrap: 'break-word', color: 'black'}}>{optionUser.email}</p>
							<p style={{wordWrap: 'break-word', color: 'black'}}>
								position   
								<input
									type='text'
									name='position'
									value={optionUser.position}
									onChange={(e) => {
										setOptionUser({
											...optionUser,
											position: e.target.value
										})
									}}
									/>
							</p>
							{currentUser.id !== optionUser.id ?
								<button
									onClick={handleRemoveMember}
								>remove member</button>
								:
								null
							}
						</div>
					</div>
					<button onClick={handleSubmit}>submit</button>
				</div>
				:
				null
			}
		</div>
	)
}