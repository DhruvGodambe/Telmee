import React , { useState, useEffect} from 'react'
import firebase from '../../firebase/index'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function ViewEventForm(props) {
	const eventid = props.history.location.pathname.split('/view_form/')[1]
	const [popup, setPopup] = useState(false)
	const [edit, setEdit] = useState(false)
	const [field, setField] = useState({})
	const [fieldIndex, setFieldIndex] = useState(0)
	const [inputs, setInputs] = useState([])

	useEffect(() => {
		window.scrollTo(0, 0)
		if(props.location.query){
			setInputs(props.location.query.inputs)
			console.log(props.location.query.inputs)
		} else {
			props.history.goBack()
		}
		console.log('hello')
	}, [])

	const handleSubmit = () => {
		firebase.db.collection('events').doc(eventid).update({
			formTemplate: inputs
		}).then(res => {
			props.history.goBack()
		})
		.catch(err => {
			console.log(err)
		})
	}

	return(
		<div>
			<Popup
				popup={popup}
				setField={setField}
				setPopup={setPopup}
				field={field}
				inputs={inputs}
				setInputs={setInputs}
				fieldIndex={fieldIndex}
			/>
			<h2 className='committee-title'>Event Form</h2>
			<div style={{textAlign: 'left'}}>
			<button
			onClick={() => {
				setEdit(true)
			}}
			style={{
				padding: '10px',
				margin: '10px',
				fontSize: '18px',
			}}>Edit</button>
			</div>
			<div className='register-form-div'>
			{inputs.map((val, ind) => {
				if (val.type == 'options') {
					return(
						<div className='register-form-sub-div'>
							<div style={{visibility: edit ? 'visible' : 'hidden', textAlign: 'right'}}>
								<FontAwesomeIcon onClick={() => {
									setPopup(true)
									setField(val)
									setFieldIndex(ind)
								}} icon={faBars} />
								</div>
							<p className='register-form-label'>{val.name}</p>
							<select
								name={val.name}
								className='register-form-input'
								key={ind}>
								<option>select option</option>
								{val.options.map((opt, index) => (
									<option value={opt}>{opt}</option>
								))}
							</select>
						</div>
					)
				} else {
					return(
						<div 
							onMouseEnter={() => {}}
							className='register-form-sub-div'>
							<div style={{visibility: edit ? 'visible' : 'hidden', textAlign: 'right'}}>
								<FontAwesomeIcon onClick={() => {
									setPopup(true)
									setField(val)
									setFieldIndex(ind)
								}} icon={faBars} />
							</div>
							<p className='register-form-label'>{val.name}</p>
							<input
								name={val.name}
								placeholder='answer'
								className='register-form-input'
							/>
						</div>
					)
				}
			})}
				<div style={{
					margin: '20px auto'
				}}>	
					<button
						onClick={() => {
							setFieldIndex(inputs.length)
							setPopup(true)
							setField({name: 'add question', type: 'text'})
							setInputs([
								...inputs,
								{name: 'add question', type: 'text'}
							])
						}}
					>Add Question +</button>
				</div>
			</div>
			<div style={{
				margin: '20px auto'
			}}>	
				<button
					style={{
						padding: '20px',
						margin: '0 auto',
						fontSize: '20px',
						borderRadius: '15px'
					}}
					onClick={handleSubmit}
				>submit changes</button>
			</div>
		</div>
	)
}

const Popup = (props) => {
	const {popup, setPopup, field, setField, inputs, setInputs, fieldIndex} = props;

	useEffect(() => {
		console.log(field)
	}, [field])

	const handleSubmit = () => {
		setPopup(false)
		var temp = inputs;
		temp[fieldIndex] = field
		setInputs(temp)
		console.log('inputs: ', inputs)
	}

	return(
		<div>
			{popup ?
				<div className='main-popup'>
					<div style={{textAlign: 'right'}}>
						<FontAwesomeIcon onClick={() => setPopup(false)} icon={faTimes} />
					</div>
					{field.type == 'options' ?
						<div style={{
							textAlign: 'left' 
						}}>
							<p className='register-form-label'>question: </p>
							<input
								className='create-event-input'
								value={field.name}
								onChange={(e) => {
									setField({
										...field,
										name: e.target.value
									})
								}}
							/>
							<p className='register-form-label'>response type: </p>
							<select
								onChange={(e) => {
									if(e.target.value == 'options'){
										setField({
											...field,
											type: e.target.value,
											options: []
										})
									}
									console.log(e)
								}}
								className='create-event-input'>
								<option value='options'>list of options</option>
								<option>text</option>
								<option>number</option>
							</select>
							<p className='register-form-label'>options</p>
							<div style={{
								height: '270px',
								overflow: 'scroll'
							}}>
								{field.options ? field.options.map((opt, index) => (
									<input
										className='create-event-input'
										value={opt}
										onChange={(e) => {
											var temp = [...field.options]
											temp[index] = e.target.value
											setField({
												...field,
												options: temp
											})
										}}
									/>))
									:
									null
								}
								<div>
									<button onClick={() => {
										setField({
											...field,
											options: [...field.options, '']
										})
									}}>add option +</button>
								</div>
							</div>
						</div>
						:
						<div style={{
							textAlign: 'left' 
						}}>
							<p className='register-form-label'>question: </p>
							<input
								className='create-event-input'
								value={field.name}
								onChange={(e) => {
									setField({
										...field,
										name: e.target.value
									})
								}}
							/>
							<p className='register-form-label'>response type: </p>
							<select
								onChange={(e) => {
									if(e.target.value == 'options'){
										setField({
											...field,
											type: e.target.value,
											options: []
										})
									}
								}}
								className='create-event-input'>
								<option>{field.type}</option>
								<option value='options'>list of options</option>
								<option>{field.type == 'text' ? 'number' : 'text' }</option>
							</select>
						</div>
					}
					<div>
						<button onClick={handleSubmit}>change</button>
					</div>
				</div>
				:
				null
			}
		</div>
	)
}