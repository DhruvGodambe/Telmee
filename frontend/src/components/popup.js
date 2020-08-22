import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Popup(props){
	const {message, show, options} = props;

	useEffect(() => {
		console.log(props);
	}, [])

	let displayOptions = options.map((val, ind) => {
		return <button style={{margin: '0 10px'}}>{val}</button>
	})

	return(
		<div>
			{ show == 'true' ?
				<div style={{
					boxShadow: '1px 1px 5px black',
					margin: '0 auto',
					position: 'fixed',
					top: '50%',
					left: '30%',
					width: '30%',
					background: 'white'
				}}>
					<div style={{textAlign: 'right'}}><FontAwesomeIcon icon={faTimes} /></div>
					<div style={{
						padding: '1% 5%',
					}}>
						<h2>{message}</h2>
						{displayOptions}
					</div>
				</div>
				: null
			}

		</div>
	)
}