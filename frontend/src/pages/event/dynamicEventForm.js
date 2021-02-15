import React, { useState, useEffect, useContext } from 'react';
import {Link, useHistory} from 'react-router-dom';
import './dynamicEventForm.css'
import {globalContext} from '../../globalContext';
import firebase from '../../firebase/index';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default function DynamicEventForm(props) {
	const eventid = props.history.location.pathname.split('/eventForm/')[1]
	const history = useHistory();
	const {currentUser, setCurrentUser} = useContext(globalContext);
	const [event, setEvent] = useState({})
	const [inputs, setInputs] = useState([]);
	const [render, setRender] = useState(false);
	const [name, setName] = useState('');
	const [options, setOptions] = useState([]);
	const [optionItems, setOptionItems] = useState([]);
	const [type, setType] = useState('');
	const [addNote, setAddNote] = useState(false);
	const [note, setNote] = useState("")
	const [checked, setChecked] = useState(false);
	let item = '';

	function handleOptions(e) {
		if(e.target.value === 'options') {
			setOptions([0]);
		} else {
			setOptions([])
			setOptionItems([])
		}
		setType(e.target.value);
	}

	function handleAddNote(e) {
		setInputs([...inputs, {type: "note", name: note}])
		setOptions([])
		setAddNote(false);
		setNote("")
	}

	useEffect(() => {
		window.scrollTo(0, 0)
		firebase.db.collection('events').doc(eventid).get()
		.then(res => {
			setEvent(res.data())
		})
	}, [])

	function addOption() {
		var num = options.length + 1;
		setOptions([...options, num]);
		setOptionItems([...optionItems, item]);
	} 

	function handleAddField() {
		setRender(false);
		if(type === 'options'){
			setInputs([...inputs, {type: type, name: name, options: optionItems, required: checked}]);
			setOptions([]);
			setOptionItems([]);
			setChecked(false);
		} else {
			setInputs([...inputs, {type: type, name: name, required: checked}])
			setOptions([])
			setChecked(false)
		}
	}

	function handleOptionChange(e) {
		item = e.target.value;
	}

	function handleCreateForm() {
		currentUser.data.committee.forEach(comm => {
			if(comm.name == event.organizingCommittee.name){
				firebase.db.collection('events').doc(eventid).update({
					formTemplate: inputs,
					eventForm: true
				}).then(res => {
					props.history.push(`/event/${eventid}`)
				})
				.catch(err => {console.log('err: ', err)})
			}
		})
	}

	function RenderDescription(desc) {
		var str = '';
		desc.name.split(" ").forEach(val => {
			if(val.includes("https://")){
				var temp = `<a href="${val}">${val}</a>`;
				str = str.concat(temp)
			} else { str = str.concat(val + " ")}
		})
		return(
			<p className="register-form-note" dangerouslySetInnerHTML={{__html: str}}></p>	
		)
	}

	return(
		<div className="create-event-form-container">
			<div className="create-event-form-title"></div>
			<div className='create-form-root'>
				<h1>Create A Registeration Form</h1>
				<p className="note" >Note: basic information like name, email id and contact number will be directly recorded when the person registers for the event. You don't need to ask for these details in the custom form.</p>
				<div>
					<div className='form-box'>
						{inputs.map((val, ind) => (
							<div key={ind}>
								{val.type == 'options' ?
									<div
										style={{
											background: '#eee',
											borderRadius: '10px',
											padding: '10px 5px',
										}} 
										className='register-form-sub-div'>
										<div>
											<button
											className='register-form-button'
											onClick={() => {
												var temp = inputs.filter((val, index) => ind !== index)
												setInputs(temp)	
											}}>x</button>
										</div>
										<p className='register-form-label'>{val.name}</p>
										<select
											className='register-form-input'
										>
											<option value=''>select option</option>
											{val.options.map((opt, index) => (
												<option>{opt}</option>
											))}
										</select>
									</div>
								:
									val.type == "note" ?
									<div
									style={{
										background: '#eee',
										borderRadius: '10px',
										padding: '10px 5px',
									}} 
									className='register-form-sub-div'>
										<div>
											<button
											className='register-form-button'
											onClick={() => {
												var temp = inputs.filter((val, index) => ind !== index)
												setInputs(temp)	
											}}>x</button>
										</div>
										{RenderDescription(val)}
									</div>
									:
										val.type == "file" ?
										<div
											style={{
												background: '#eee',
												borderRadius: '10px',
												padding: '10px 5px',
											}} 
											className='register-form-sub-div'>
											<div>
												<button
												className='register-form-button'
												onClick={() => {
													var temp = inputs.filter((val, index) => ind !== index)
													setInputs(temp)	
												}}>x</button>
											</div>
											<p className='register-form-label'>{val.name}</p>
											<input
												placeholder={val.name}
												type={val.type}
												className='register-form-input'
											/>
										</div>
										:
										<div
											style={{
												background: '#eee',
												borderRadius: '10px',
												padding: '10px 5px',
											}} 
											className='register-form-sub-div'>
											<div>
												<button
												className='register-form-button'
												onClick={() => {
													var temp = inputs.filter((val, index) => ind !== index)
													setInputs(temp)	
												}}>x</button>
											</div>
											<p className='register-form-label'>{val.name}</p>
											<input
												placeholder={val.name}
												type={val.type}
												className='register-form-input'
											/>
										</div>
								}
							</div>
						))}
					{addNote ?
						<div style={{width: '90%', margin: '10px auto'}}>
							<textarea rows="10" style={{width: '95%', padding: '2.5%', fontFamily: 'Helvetica'}} onChange={(e) => {setNote(e.target.value)}} />
							<button className='create-event-input' type="button" onClick={handleAddNote}>Add</button>
						</div>
						:
						null
					}
					{!render && !addNote ?
						<div>
							<button
								type="button"
								onClick={() => {
									setRender(true)
								}}
								className='create-event-input'
							>add a question</button>
							<button
								type="button"
								onClick={() => {
									setAddNote(true)
								}}
								className='create-event-input'
							>add description / note</button>
						</div>
						:
						null
					}
					{render ? 
						<div>
							<input
								placeholder='question'
								onChange={(e) => setName(e.target.value)}
								className='create-event-input'
								style={{width: '90%'}}
							/>
							<select 
								style={{
									padding: '10px',
									border: 'none',
									borderRadius: '20px',
									outline: 'none'
								}}
								onChange={handleOptions}
							>
								<option>answer type</option>
								<option>text</option>
								<option value='options'>list of options</option>
								<option>number</option>
								<option value="file">document upload</option>
							</select>
							{options.map((val, ind) => (
								<div className='deep-form' >
									<input 
										placeholder={`option${ind+1}`}
										onChange={handleOptionChange}
										style={{
											fontSize: '15px',
											width: '60%',
											margin: '5%',
											border: 'none',
											padding: '10px',
											borderRadius: '10px'
										}}
									/>
									<button
										type="button"
										onClick={addOption}
										style={{
											width: '10%',
											margin: '5% 2.5%',
										}}
									>+</button>
									{
										options.length > ind + 1 ?
											<FontAwesomeIcon
												style={{
													margin: '5% 2.5%'
												}}
												icon={faCheck} />
											:
											null
									}
								</div>
							))}
							<div style={{padding: '10px'}}>
								<input type="checkbox" onChange={(e) => {setChecked(e.target.checked)}} />
								<p style={{margin: '0', display: 'inline'}}>mandatory</p>
							</div>
							<button className='create-event-input' type="button" onClick={handleAddField}>Add</button>
						</div>
						:
						<div></div>
					}
					{inputs.length > 0 ?
						<div>
							<button className='create-event-input' type="button" onClick={handleCreateForm}>create form</button>
							<button className='create-event-input' type="button" onClick={() => {history.goBack()}}>discard form</button>
						</div>
						:
						<div></div>
					}
					</div>
					
				</div>
			</div>
		</div>
	)
}