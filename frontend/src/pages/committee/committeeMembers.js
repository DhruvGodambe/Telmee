import React, { useState, useEffect } from 'react'
import firebase from '../../firebase/index'
import './committee.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function CommitteeMembers(props) {
	const committeeid = props.history.location.pathname.split('/members/')[1]
	const [committee, setCommittee] = useState({})
	const [members, setMembers] = useState([])
	const [user, setUser] = useState({})
	const [popup, setPopup] = useState(false)
	const [optionPopup, setOptionPopup] = useState(false)
	const [optionUser, setOptionUser] = useState({})

	useEffect(() => {
		window.scrollTo(0, 0)
		firebase.db.collection('committees').doc(committeeid).get()
		.then(res => {
			if(res.exists){
				setCommittee(res.data())
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
			/>
			<OptionPopup 
				optionPopup={optionPopup}
				setOptionPopup={setOptionPopup}
				optionUser={optionUser}
				setOptionUser={setOptionUser}
				committeeid={committeeid}
				members={committee.members}
				committeeName={committee.name}
			/>
			<h2 className='committee-title'>Members of {committee.name}</h2>
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
			{members.map((val, ind) => {
				return (
					<MemberCard
						user={val}
						key={ind}
						setOptionPopup={setOptionPopup}
						setOptionUser={setOptionUser}
					/>
				)
			})}
		</div>
	)
}

const MemberCard = (props) => {
	const {user, setOptionPopup, setOptionUser} = props
	const [selected, setSelected] = useState(false)

	return(
		<div className='registered-user-box'>
			<div className='registered-user-image-box'>
				<img width='100%' src={user.profilePicture} />
			</div>
			<div className='registered-user-details'>
				<div style={{textAlign: 'right'}}>
					<FontAwesomeIcon
						onClick={() => {
							setOptionPopup(true)
							setOptionUser(user)
						}}
						style={{cursor: 'pointer', fontSize: '18px'}}
						icon={faBars}
					/>
				</div>
				<p style={{wordWrap: 'break-word'}}><b>{user.name}</b></p>
				<p style={{wordWrap: 'break-word', color: 'grey'}}>{user.email}</p>
				<p style={{wordWrap: 'break-word', color: 'grey'}}>position: {user.position}</p>
			</div>
			
		</div>
	)
}

const MemberCard2 = (props) => {
	const {user, id, setMemberUsers, memberUsers} = props
	const [selected, setSelected] = useState(false)

	return(
		<div
			style={{background: selected ? 'skyblue' : 'white'}}
			className='registered-user-box'
			onClick={() => {
				if(!selected){
					setMemberUsers([
						...memberUsers,
						{
							id: id,
							email: user.email,
							profilePicture: user.profilePicture,
							position: 'member'
						}
					])
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
	const {popup, setPopup, committeeid, committeeName} = props;
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
						style={{width: '80%', margin: '10px auto', fontSize: '20px', padding: '10px'}}
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
	const {optionUser, setOptionUser, optionPopup, setOptionPopup, committeeName, committeeid, members} = props;

	useEffect(() => {
		setOptionUser({
			...optionUser,
			oldPosition: optionUser.position
		})
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
							<img width='100%' src={optionUser.profilePicture} />
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
							<button
								onClick={handleRemoveMember}
							>remove member</button>
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