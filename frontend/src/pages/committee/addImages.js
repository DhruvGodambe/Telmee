import React, { useState, useEffect } from 'react'
import firebase from '../../firebase/index'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Loader from 'react-loader-spinner';

export default function AddImages(props) {
	const committeeid = props.history.location.pathname.split('/add_images/')[1]
	const [img1, setImg1] = useState('')
	const [img2, setImg2] = useState('')
	const [img3, setImg3] = useState('')
	const [images, setImages] = useState({})
	const [name, setName] = useState('')
	const [moreImagesArr, setMoreImagesArr] = useState({})

	useEffect(() => {
		window.scrollTo(0, 0)
		if(props.location.query && Object.keys(props.location.query).length > 0 ){
			setName(props.location.query.committeeName)
			firebase.db.collection('committees').doc(committeeid).get()
			.then(res => {
				if(res.exists){
					setMoreImagesArr(res.data().moreImages)

					Object.keys(res.data().moreImages).forEach((val, ind) => {
						firebase.storage.ref(`/committees/${res.data().moreImages[val]}`).getDownloadURL()
						.then(url => {
							switch(val){
								case 'image1':
									setImg1(url)
									break;
								case 'image2':
									setImg2(url)
									break;
								case 'image3':
									setImg3(url)
									break;
							}
						})
					})
				}
			})
		} else {
			props.history.goBack()
		}
	}, [])

	const handleSubmit = () => {
		Object.keys(images).forEach(async (photo, ind) => {
			await firebase.storage.ref(`/committees/${images[photo].name}`).put(images[photo].file)
		})
		if(Object.keys(images).length > 0) {
			firebase.db.collection('committees').doc(committeeid).update({
				moreImages: moreImagesArr
			})
			.then(resp => {
				props.history.goBack()	
			})
		} else {
			props.history.goBack()
		}
	}

	return(
		<div>
			<h1 className='committee-title'>Add Images</h1>
			<p style={{color: 'grey'}}>you can add minimum 1 image and maximum 3 images</p>
			{img1 == '' ?
				<div>
					<div className='create-event-input'>
					<label htmlFor='image1'><FontAwesomeIcon icon={faUpload}/> image 1</label>
					</div>
				</div>
				:
				<div className='create-event-input'>
					
					<img className='create-event-image' src={img1} />
					<label htmlFor='image1' className='create-event-input'>change image</label>
				</div>
			}
			<input
				style={{display: 'none'}}
				type='file'
				name='image1'
				accept='.jpg, .png, .jpeg'
				id='image1'
				onChange={(e) => {
					const file = e.target.files[0];
					const reader = new FileReader();
					reader.readAsDataURL(file);
			        reader.addEventListener('load', () => {
			        	setImg1(reader.result);
			        });
			        var arr = name.split(' ');
					var imageName = arr.toString() + ',image1';
					var ext = file.name.split('.');
					var extension = ext[ext.length-1]
					setMoreImagesArr({
						...moreImagesArr,
						image1: `${imageName}.${extension}`,
					})
					setImages({
						...images,
						image1: {
							name: `${imageName}.${extension}`,
							file: file
						}
					})
				}}
			/>
			{img2 == '' ?
				<div>
					<div className='create-event-input'>
					<label htmlFor='image2'><FontAwesomeIcon icon={faUpload}/> image 2</label>
					</div>
				</div>
				:
				<div className='create-event-input'>
					<img className='create-event-image' src={img2} />
					<label htmlFor='image2' className='create-event-input'>change image</label>
				</div>
			}
			<input
				style={{display: 'none'}}
				type='file'
				accept='.jpg, .png, .jpeg'
				id='image2'
				onChange={(e) => {
					const file = e.target.files[0];
					const reader = new FileReader();
					reader.readAsDataURL(file);
			        reader.addEventListener('load', () => {
			        	setImg2(reader.result);
			        });
			        var arr = name.split(' ');
					var imageName = arr.toString() + ',image2';
					var ext = file.name.split('.');
					var extension = ext[ext.length-1]
					setMoreImagesArr({
						...moreImagesArr,
						image2: `${imageName}.${extension}`,
					})
					setImages({
						...images,
						image2: {
							name: `${imageName}.${extension}`,
							file: file
						}
					})
				}}
			/>
			{img3 == '' ?
				<div>
					<div className='create-event-input'>
					<label htmlFor='image3'><FontAwesomeIcon icon={faUpload}/> image 3</label>
					</div>
				</div>
				:
				<div className='create-event-input'>
					<img className='create-event-image' src={img3} />
					<label htmlFor='image3' className='create-event-input'>change image</label>
				</div>
			}
			<input
				style={{display: 'none'}}
				type='file'
				accept='.jpg, .png, .jpeg'
				id='image3'
				onChange={(e) => {
					const file = e.target.files[0];
					const reader = new FileReader();
					reader.readAsDataURL(file);
			        reader.addEventListener('load', () => {
			        	setImg3(reader.result);
			        });
			        var arr = name.split(' ');
					var imageName = arr.toString() + ',image3';
					var ext = file.name.split('.');
					var extension = ext[ext.length-1]
					setMoreImagesArr({
						...moreImagesArr,
						image3: `${imageName}.${extension}`,
					})	
					setImages({
						...images,
						image3: {
							name: `${imageName}.${extension}`,
							file: file
						}
					})
				}}
			/>
			<button 
				style={{
					padding: '10px',
					margin: '10px auto',
					fontSize: '20px'
				}}
				onClick={handleSubmit}
			>submit images</button>
		</div>
	)
}