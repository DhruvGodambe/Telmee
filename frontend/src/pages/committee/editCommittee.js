import React, { useState, useEffect } from 'react'
import firebase from '../../firebase/index'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import Loader from 'react-loader-spinner';

export default function EditCommittee(props) {
	const committeeid = props.history.location.pathname.split('/edit/')[1]
	const [committee, setCommittee] = useState({})
	const [upload, setUpload] = useState(false)
	const [base64, setBase64] = useState('')
	const [members, setMembers] = useState([])
	const [mem, setMem] = useState()
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if(props.location.query && Object.keys(props.location.query).length > 0){
			setCommittee(props.location.query)
		} else {
			props.history.goBack()
		}
	}, [])

	const handleSubmit = () => {
		setLoading(true)
		if(upload){
			firebase.storage.ref(`/committees/${committee.coverImageName}`).put(committee.coverImage)
			.then(res => {
				firebase.db.collection('committees').doc(committeeid).update({
					...committee,
					coverImage: {}
				})
				.then(resp => {
					props.history.push(`/committee/${committeeid}`)
				})
			})
		} else {
			firebase.db.collection('committees').doc(committeeid).update(committee)
			.then(resp => {
				props.history.push(`/committee/${committeeid}`)
			})
		}
	}

	const handleDelete = () => {
		setLoading(true)
		committee.members.forEach(member => {
			firebase.db.collection('users').doc(member.id).update({
				committee: firebase.firebase.firestore.FieldValue.arrayRemove({
					id: committeeid,
					name: committee.name,
					position: member.position
				})
			})
			.then(res => {
				setMem(member)
			})
		})
	}

	useEffect(() => {
		if(members.length > 0){
			const lastMember = members[members.length-1]
			if(mem.id == lastMember.id){
				firebase.db.collection('committees').doc(committeeid).delete()
				.then(res => {
					console.log('deleted committee')
					props.history.push('/')
				})
			}
		}

	}, [mem])

	return(
		<div className='update-event-box'>
		{!loading ?
			<div>
				<div><label className='update-event-label'>description</label></div>
				<textarea
					type='text'
					className='update-event-input'
					name='event title'
					rows='10'
					value={committee && committee.description ? committee.description : ''}
					onChange={(e) => {
						setCommittee({
							...committee,
							description: e.target.value
						})
					}}
				/>
				{!upload ?
					<div className='update-event-input' style={{textAlign: 'center'}}>
						<label htmlFor='coverImage'><FontAwesomeIcon icon={faUpload}/> change cover image</label>
						<input
							style={{display: 'none'}}
							type='file'
							accept='.jpg, .png, .jpeg'
							id='coverImage'
							onChange={(e) => {
								setUpload(true)
								const file = e.target.files[0];
								const reader = new FileReader();
								reader.readAsDataURL(file);
						        reader.addEventListener('load', () => {
						        	setBase64(reader.result);
						        });
						        var arr = committee.name.split(' ');
								var eventName = arr.toString();
								var ext = file.name.split('.');
								var extension = ext[ext.length-1]
								setCommittee({
									...committee,
									coverImageName: `${eventName}.${extension}`,
									coverImage: file
								})
							}}
						/>
					</div>
					:
					<div className='update-event-input'>
						 <img width='100%' src={base64} />
						 <p>image uploaded successfully</p>
					</div>
				}
				<button
					className='update-event-submit'
					onClick={handleSubmit}>update changes</button>
				<button
					className='update-event-submit'
					style={{background: '#f03', color: 'white', margin: '20px'}}
					onClick={handleDelete}>delete organization</button>
			</div>
			:
			<div style={{textAlign: 'center', width: '100%', marginTop: '40%'}}>
				<Loader
			        type="ThreeDots"
			        color="#ff0033"
			        height={100}
			        width={100}
			        timeout={10000} //10 secs
			    />
			</div>
		}
		</div>
	)
}