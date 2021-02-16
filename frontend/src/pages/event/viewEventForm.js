import React , { useState, useEffect} from 'react'
import firebase from '../../firebase/index'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

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
		} else {
			props.history.goBack()
		}
		console.log('hello')
	}, [])

	const handleSubmit = () => {
		if(inputs.length > 0){
			firebase.db.collection('events').doc(eventid).update({
				formTemplate: inputs
			}).then(res => {
				props.history.goBack()
			})
			.catch(err => {
				console.log(err)
			})
		} else {
			firebase.db.collection('events').doc(eventid).update({
				formTemplate: [],
				eventForm: false
			}).then(res => {
				props.history.goBack()
			})
			.catch(err => {
				console.log(err)
			})
		}
	}

	const handleDelete = () => {
		firebase.db.collection('events').doc(eventid).update({
			formTemplate: [],
			eventForm: false
		}).then(res => {
			props.history.goBack();
		})
	}

	return(
		<div className="register-for-event-container">
			<Popup
				popup={popup}
				setField={setField}
				setPopup={setPopup}
				field={field}
				inputs={inputs}
				setInputs={setInputs}
				fieldIndex={fieldIndex}
			/>
			<div className="register-for-event-title"></div>
			<div className="register-for-event-body">
				<button
				onClick={() => {
					setEdit(true)
				}}
				style={{
					padding: '10px 20px',
					marginLeft: '80%',
					marginTop: "50px",
					fontSize: '18px',
					background: "#ccc",
					boxShadow: 'none',
				}}>Edit</button>
				<h2 className='committee-title'>Event Form Preview</h2>
				<div style={{textAlign: 'left'}}>
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
									}} icon={faEllipsisV} />
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
						if (val.type == 'note') {
							var str = '';
							val.name.split(" ").forEach(val => {
								if(val.includes("https://")){
									var temp = `<a href="${val}">${val}</a>`;
									str = str.concat(temp)
								} else { str = str.concat(val + " ")}
							})
							return(
								<div 
									onMouseEnter={() => {}}
									className='register-form-sub-div'>
									<div style={{visibility: edit ? 'visible' : 'hidden', textAlign: 'right'}}>
										<FontAwesomeIcon onClick={() => {
											setPopup(true)
											setField(val)
											setFieldIndex(ind)
										}} icon={faEllipsisV} />
									</div>
									<p className="register-form-note" dangerouslySetInnerHTML={{__html: str}}></p>
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
										}} icon={faEllipsisV} />
									</div>
									<p className='register-form-label'>{val.name}</p>
									<input
										name={val.name}
										type={val.type}
										placeholder='answer'
										className='register-form-input'
									/>
								</div>
							)
						}
					}
				})}
					<div>
						<div style={{
							margin: '20px',
							display: 'inline'
						}}>	
							<button
								style={{
									background: "#55887C",
									color: "white",
									padding: "10px"
								}}
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
						<div style={{
							margin: '20px',
							display: 'inline',
						}}>	
							<button
								style={{
									background: "#55887C",
									color: "white",
									padding: "10px"
								}}
								onClick={() => {
									setFieldIndex(inputs.length)
									setPopup(true)
									setField({name: 'add description', type: 'note'})
									setInputs([
										...inputs,
										{name: 'add description', type: 'note'}
									])
								}}
							>Add Note / Description +</button>
						</div>
					</div>
				</div>
				<div style={{
					margin: '20px auto'
				}}>	
					<button
						style={{
							padding: '10px',
							margin: '0 auto',
							fontSize: '18px',
							borderRadius: '15px'
						}}
						onClick={handleSubmit}
					>submit changes</button>
				</div>
				<div style={{
					margin: '20px auto'
				}}>	
					<button
						style={{
							padding: '10px',
							margin: '40px auto 0',
							fontSize: '18px',
							borderRadius: '15px',
							width: '60%',
							background: "#E79981",
							color: 'white'
						}}
						onClick={handleDelete}
					>delete form</button>
				</div>
			</div>
		</div>
	)
}

const Popup = (props) => {
	const {popup, setPopup, field, setField, inputs, setInputs, fieldIndex} = props;

	// useEffect(() => {
	// 	console.log(field)
	// }, [field])

	const handleSubmit = () => {
		setPopup(false)
		var temp = inputs;
		temp[fieldIndex] = field
		setInputs(temp)
	}

	const handleDelete = () => {
		setPopup(false)
		var temp = inputs;
		temp = temp.filter((val, ind) => ind !== fieldIndex);
		setInputs(temp)
	}

	return(
		<div>
			{popup ?
				<div className='main-popup hieghtened-popup'>
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
							<div style={{padding: '10px'}}>
								<input
									type="checkbox"
									checked={field.required}
									onChange={(e) => {
										setField({
											...field,
											required: e.target.checked
										})
										}} />
								<p style={{margin: '0', display: 'inline'}}>mandatory</p>
							</div>
							<p className='register-form-label'>response type: </p>
							<select
								onChange={(e) => {
									if(e.target.value == 'options'){
										setField({
											...field,
											type: e.target.value,
											options: []
										})
									} else {
										setField({
											...field,
											type: e.target.value
										})
									}
								}}
								value={field.type}
								className='create-event-input'>
								<option value='options'>list of options</option>
								<option value="text">text</option>
								<option value="number">number</option>
								<option value="file">document upload</option>
							</select>
							<p className='register-form-label'>options</p>
							<div style={{
								height: '230px',
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
						field.type == 'note' ?
							<div>
								<p className='register-form-label'>note: </p>
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
								<div style={{padding: '10px'}}>
									<input type="checkbox" 
										checked={field.required}
										onChange={(e) => {
											setField({
												...field,
												required: e.target.checked
											})
										}} />
									<p style={{margin: '0', display: 'inline'}}>mandatory</p>
								</div>
								<p className='register-form-label'>response type: </p>
								<select
									onChange={(e) => {
										if(e.target.value == 'options'){
											setField({
												...field,
												type: e.target.value,
												options: []
											})
										} else {
											setField({
												...field,
												type: e.target.value
											})
										}
									}}
									className='create-event-input'>
									<option>{field.type}</option>
									<option value='options'>list of options</option>
									<option>{field.type == 'text' ? 'number' : 'text' }</option>
									<option value="file">document upload</option>
								</select>
							</div>
					}
					<div>
						<button onClick={handleSubmit}>change</button>
					</div>
					<div>
						<button onClick={handleDelete}>delete question</button>
					</div>
				</div>
				:
				null
			}
		</div>
	)
}