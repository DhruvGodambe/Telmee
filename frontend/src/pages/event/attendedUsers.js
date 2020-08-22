import React, { useState, useEffect } from 'react';
import firebase from '../../firebase/index';
import ExcelExport from 'react-html-table-to-excel';

export default function AttendedUsers(props) {
	const eventid = props.history.location.pathname.split('/attended/')[1];
	const [registeredUser, setRegisteredUser] = useState({})
	const [p, setP] = useState({})
	const [popup, setPopup] = useState(false)
	const [arr, setArr] = useState([])
	const [excelFields, setExcelFields] = useState(['name'])
	const [tempUser, setTempUser] = useState({})
	const [registeredUsers2, setRegisteredUsers2] = useState([])
	const [name, setName] = useState('')

	useEffect(() => {
		window.scrollTo(0, 0)
		if(props.location.query){
			setName(props.location.query.name)
			props.location.query.attendedUsers.forEach(user => {
				firebase.db.collection('users').doc(user.id).get()
				.then(result => {
					setRegisteredUser({
						name: result.data().name,
						profilePicture: result.data().profilePicture,
						details: {
							...user,
							email: result.data().email,
							college: result.data().college,
							contact: result.data().contact
						}
					})
				})
				.catch(err => {console.log('errrrr: ', err)})
				if(props.location.query.attendedUsers.indexOf(user) == props.location.query.attendedUsers.length - 1){
					setTempUser(user)
					console.log('temp user: ', user)
				}
			})
		} else {
			firebase.db.collection('events').doc(eventid).get()
			.then(res => {
				if(!res.empty){
					setName(res.data().name)
					res.data().attendedUsers.forEach(user => {
						firebase.db.collection('users').doc(user.id).get()
						.then(result => {
							setRegisteredUser({
								name: result.data().name,
								profilePicture: result.data().profilePicture,
								details: {
									...user,
									email: result.data().email,
									college: result.data().college,
									contact: result.data().contact
								}
							})
						})
						.catch(err => {console.log('err: ', err)})
						if(res.data().attendedUsers.indexOf(user) == res.data().attendedUsers.length - 1){
							setTempUser(user)
							console.log('temp user: ', user)
						}
					})
					setRegisteredUsers2(res.data().registeredUsers)
				} else {
					props.history.goBack();
				}
			})
		}
	}, [])

	useEffect(() => {
		if(Object.keys(registeredUser).length > 0){
			setArr([registeredUser, ...arr])
			console.log(arr)
		}
	}, [registeredUser])

	useEffect(() => {
		var tempArr = []
		if(arr.length > 0 && arr[0].details.id == tempUser.id){
			Object.keys(arr[arr.length - 1]['details']).forEach(field => {
				if(!(field == 'id') && tempArr.indexOf(field) == -1 ){
					tempArr.push(field)
				}
			})
			setExcelFields([...excelFields, ...tempArr])
		}
	}, [arr])

	useEffect(() => {
 		console.log(registeredUsers2)
	}, [registeredUsers2])

	return(
		<div>
			<UserPopup
				{...props}
				popup={popup}
				setPopup={setPopup}
				name={name}
				arr={
					props.location.query ?
						props.location.query.registeredUsers
						: 
						registeredUsers2 
					}
				eventid={eventid}
			/>
			<h1 className='registered-user-title'>attended Users</h1>
			<p style={{color: 'grey'}}>note: only attended users can post images related to this event</p>
			<button
				style={{
					padding: '10px',
					fontSize: '20px',
					borderRadius: '20px'
				}}
				onClick={() => {
					setPopup(true)
				}}
			>add <b>+</b></button>
			<div style={{margin: '20px'}}>
				<ExcelExport
					id='test-table-excel-button'
					table='table-to-excel'
					filename='registered-users'
					sheet='shit1'
					buttonText='download excel file'
					className='excel-button'
				/>
			</div>
			{arr ?
				arr.map((val, ind) => {
					return (
						<UserCard user={val} key={ind} />
					)
				})
				:
				null
			}
			<table style={{width: '100%', display: 'none'}} id='table-to-excel'>
				<tbody>
						<tr>
							{excelFields.map((key, ind) => {
								return (<th>{key}</th>)
							})}
						</tr>
						
					{arr.length > 0 ?
						arr.map((val, ind) => {
							return(
								<tr key={ind}>
									<td>{val.name}</td>
									{excelFields.map((key, index) => {
										if(!(key == 'name')){
											return <td key={index}>{val['details'][key]}</td>
										}
									})}
								</tr>
							)
						})
						:
						<tr>nnuull</tr>
					}
				</tbody>
			</table>
		</div>
	)
}

// for(var i = 0; i < 20; i++){
//     var a = Math.round(Math.random()*2);
//     switch(a){
//         case 0:
//             str = str.concat(String.fromCharCode(Math.round(Math.random()*25 + 65)))
//             break;
//         case 1:
//             str = str.concat(String.fromCharCode(Math.round(Math.random()*25 + 97)))
//             break;
//         case 2:
//             str = str.concat(String.fromCharCode(Math.round(Math.random()*9 + 48)))
//             break;
//     }
// }

const UserCard = (props) => {
	const {user} = props
	return(
		<div className='registered-user-box'>
			<div className='registered-user-image-box'>
				<img width='100%' src={user.profilePicture} />
				<p style={{wordWrap: 'break-word'}}><b>{user.name}</b></p>
			</div>
			<div className='registered-user-details'>
			{Object.keys(user.details).map((key, index) => {
				if(key !== 'id'){
					return <li key={index}><b>{key}</b>: {user.details[key]}</li>
				}
			})}
			</div>
		</div>
	)
}

const UserCard2 = (props) => {
	const {user, attendedUsers, setAttendedUsers} = props
	const [selected, setSelected] = useState(false)

	return(
		<div
			onClick={() => {
				if(!selected){
					var obj = {}
					Object.keys(user.details).forEach(val => {
						if(val !== 'email' && val !== 'contact'){
							obj = Object.assign(obj, {[val]: user.details[val]})
						}
					})
					setAttendedUsers([...attendedUsers, obj])
				} else {
					var temp = attendedUsers.filter((val, ind) => (val !== user.details.id))
					setAttendedUsers(temp)
				}
				setSelected(!selected)
			}}
			style={{background: selected ? 'skyblue' : 'white'}}
			className='registered-user-box'>
			<div className='registered-user-image-box'>
				<img width='100%' src={user.profilePicture} />
			</div>
			<div className='registered-user-details'>
			<p style={{wordWrap: 'break-word'}}><b>{user.name}</b></p>
			<p style={{wordWrap: 'break-word', color: 'grey'}}>{user.details.email}</p>
			</div>
			
		</div>
	)
}

const UserPopup = (props) => {
	const {popup, setPopup, arr, eventid, name} = props;
	const [tempUser, setTempUser] = useState({})
	const [regUsers, setRegUsers] = useState([])
	const [attendedUsers, setAttendedUsers] = useState([])

	useEffect(() => {
		if(arr && arr.length > 0){
			arr.forEach(user => {
				firebase.db.collection('users').doc(user.id).get()
				.then(result => {
					if(result.exists){
						setTempUser({
							name: result.data().name,
							profilePicture: result.data().profilePicture,
							details: {
								...user,
								email: result.data().email,
								contact: result.data().contact
							}
						})
					}
				})
			})
		}
	}, [arr])

	useEffect(() => {
		if(Object.keys(tempUser).length > 0){
			setRegUsers([tempUser, ...regUsers])
		}
	}, [tempUser])

	const handleSubmit = () => {
		firebase.db.collection('events').doc(eventid).update({
			attendedUsers: firebase.firebase.firestore.FieldValue.arrayUnion(...attendedUsers)
		})
		.then(res => {
			setPopup(false)
			attendedUsers.forEach(user => {
				firebase.db.collection('users').doc(user.id).update({
					attendedEvents: firebase.firebase.firestore.FieldValue.arrayUnion({
						id: eventid,
						name: name
					})
				}).then(res => {
					window.location.reload();
				})
			})
		})
	}

	return(
		<div>
			{popup ?
				<div style={{height: '450px'}} className='main-popup'>
					<h2>add attended users</h2>
					<div style={{
						color: 'black',
						background: '#333',
						width: '100%',
						height: '300px',
						overflow: 'scroll'
					}}>
						{regUsers.map((val, ind) => (
							<div style={{display: 'flex'}}
							>
							<UserCard2
								attendedUsers={attendedUsers}
								setAttendedUsers={setAttendedUsers}
								user={val}
								key={ind}
							/>
							</div>
						))}
					</div>
					<button onClick={handleSubmit}>mark as attended</button>
				</div>
				:
				null
			}
		</div>
	)
}