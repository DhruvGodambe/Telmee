import React, { useState, useEffect } from 'react';
import firebase from '../../firebase/index';
import ExcelExport from 'react-html-table-to-excel';

export default function RegisteredUsers(props) {
	const eventid = props.history.location.pathname.split('/get/')[1];
	const [registeredUser, setRegisteredUser] = useState({})
	const [para, setP] = useState("")
	const [arr, setArr] = useState([])
	const [excelFields, setExcelFields] = useState(['name'])
	const [tempUser, setTempUser] = useState({})

	useEffect(() => {
		window.scrollTo(0, 0)
		firebase.db.collection("events").doc(eventid).get()
		.then(res => {
			if(res.data().formTemplate?.length > 0){
				var temparr = res.data().formTemplate.map(val => val.name)
				setExcelFields(["name", "contact", "email", ...temparr])
			}
		})
		if(props.location.query && props.location.query.length > 0){
			props.location.query.forEach(user => {
				if(typeof(user) == "object"){
					firebase.db.collection('users').doc(user.id).get()
					.then(result => {
						setRegisteredUser({
							name: result.data().name,
							profilePicture: result.data().profilePicture,
							details: {
								...user,
								email: result.data().email,
								contact: result.data().contact
							}
						})
					})
					.catch(err => {console.log('errrrr: ', err)})
					if(props.location.query.indexOf(user) == props.location.query.length - 1){
						setTempUser(user)
					}
				} else {
					firebase.db.collection('users').doc(user).get()
					.then(result => {
						setRegisteredUser({
							name: result.data().name,
							profilePicture: result.data().profilePicture,
							details: {
								id: user,
								email: result.data().email,
								contact: result.data().contact
							}
						})
					})
					.catch(err => {console.log('errrrr: ', err)})
					if(props.location.query.indexOf(user) == props.location.query.length - 1){
						setTempUser(user)
					}
				}
			})
		} else {
			if(props.location.query){
				setP("no registered users yet");
			} else {
				props.history.goBack()
			}
		}
	}, [])

	useEffect(() => {
		if(Object.keys(registeredUser).length > 0){
			setArr([registeredUser, ...arr])
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
			// setExcelFields([...excelFields, ...tempArr])
		}
	}, [arr])

	return(
		<div>
			<h1 className='registered-user-title'>Registered Users</h1>
			{para !== "" ? <p>{para}</p> : null}
			<div style={{margin: '20px', display: para !== "" ? "none" : "block"}}>
				<ExcelExport
					id='test-table-excel-button'
					table='table-to-excel'
					filename='registered-users'
					sheet='sheet1'
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
				<img width='100%' style={{borderRadius: '10px'}} src={user.profilePicture} />
				<p style={{wordWrap: 'break-word'}}><b>{user.name}</b></p>
			</div>
			<div className='registered-user-details'>
			{Object.keys(user.details).map((key, index) => {
				if(key !== 'id'){
					if(user.details[key]?.substring(0,8) == "https://"){
						return <li key={index}><b>{key}</b>: <a href={user.details[key]}>{user.details[key]}</a></li>	
					}
					return <li key={index}><b>{key}</b>: {user.details[key]}</li>
				}
			})}
			
			</div>
		</div>
	)
}