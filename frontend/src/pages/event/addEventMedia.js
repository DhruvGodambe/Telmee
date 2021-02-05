import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import firebase from '../../firebase/index';
import Loader from 'react-loader-spinner';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUpload, faCheck, faTimes} from '@fortawesome/free-solid-svg-icons';

export default function AddEventMedia(props) {
    const [loading, setLoading] = useState(false);
    const [media1, setMedia1] = useState("");
    const [media2, setMedia2] = useState("");
    const history = useHistory();
    const [event, setEvent] = useState({})
    const [change1, setChange1] = useState("");
    const [change2, setChange2] = useState("");
    let temparr = window.location.href.split("/");
    const eventid = temparr[temparr.length-1];

    useEffect(() => {
        if(props.location.query){
            setEvent(props.location.query);
            if(props.location.query.media1Name){
                firebase.storage.ref(`/events/${props.location.query.media1Name}`).getDownloadURL()
                .then(url => {
                    setMedia1(url);
                })
            }
            if(props.location.query.media2Name){
                firebase.storage.ref(`/events/${props.location.query.media2Name}`).getDownloadURL()
                .then(url => {
                    setMedia2(url);
                })
            }
        } else {
            history.goBack();
        }
    }, [])

    const handleSubmit = async () => {
        setLoading(true);

        if(change1 !== ""){
            await firebase.storage.ref("/events/" + change1).delete()
        }

        if(change2 !== ""){
            await firebase.storage.ref("/events/" + change2).delete()
        }

        if(media1 !== '' && media1.indexOf("https") == -1){
            await firebase.storage.ref(`/events/${event.media1Name}`).put(event.media1)
        }

        if(media2 !== '' && media2.indexOf("https") == -1){
            await firebase.storage.ref(`/events/${event.media2Name}`).put(event.media2)
        }

        await firebase.db.collection("events").doc(eventid).update({
            ...event,
            media1: {},
            media2: {}
        })

        history.goBack();
    }

    const handleDelete1 = async () => {
        await firebase.storage.ref(`/events/${event.media1Name}`).delete()
        setMedia1("");
        let obj = Object.assign({}, event);
        delete obj.media1;
        delete obj.media1Type;
        delete obj.media1Name;
        setEvent(obj);
        await firebase.db.collection("events").doc(eventid).update(event);
    }

    const handleDelete2 = async () => {
        await firebase.storage.ref(`/events/${event.media2Name}`).delete()
        setMedia2("");
        let obj = Object.assign({}, event);
        delete obj.media2;
        delete obj.media2Type;
        delete obj.media2Name;
        setEvent(obj);
        await firebase.db.collection("events").doc(eventid).update(event);
    }

    return(
        <div>
            <h1>Add Photos / Videos</h1>
            {media1 !== "" ? 
				<div className='create-event-input'>
                    <div style={{textAlign:'right'}}>
                        <FontAwesomeIcon icon={faTimes} onClick={handleDelete1} />
                        </div>
					media uploaded   <FontAwesomeIcon icon={faCheck} />
                    {event.media1Type.indexOf("image") !== -1 ?
					    <img className='create-event-image' src={media1} />
                        :
                        <video style={{margin: '20px auto', borderRadius: '10px'}} width="100%" autoPlay src={media1} controls />
                    }
					<label htmlFor='media1' onClick={() => {setChange1(event.media1Name)}} className='create-event-input'>change media</label>
				</div>
				:
				<div className='create-event-input'>
					<FontAwesomeIcon icon={faUpload} style={{margin: '0 10px'}}/>
					<label htmlFor='media1'>	
						add more media for your event
					</label>
				</div>
			}
			<input
				name='coverImage'
				id='media1'
				type='file'
				accept='.jpg, .jpeg, .png, .mp4'
				onChange={(e) => {
                    var file = e.target.files[0]
                    if(file.type.includes("video")){
                        const url = URL.createObjectURL(file);
                        setMedia1(url);
                    } else {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.addEventListener('load', () => {
                            setMedia1(reader.result);
                        });
                    }
                    var arr = event.name.split(' ');
                    arr.push("media1");
					var eventName = arr.toString();
                    var extension = file.name.split('.')[1];
			        setEvent({
						...event,
                        media1: file,
                        media1Type: file.type,
                        media1Name: `${eventName}.${extension}`
                    })
				}}
				className='create-event-file'
			/>
            {media2 !== "" ? 
				<div className='create-event-input'>
                    <div style={{textAlign:'right'}}>
                        <FontAwesomeIcon icon={faTimes} onClick={handleDelete2} />
                    </div>
					media uploaded   <FontAwesomeIcon icon={faCheck} />
					{event.media2Type.indexOf("image") !== -1 ?
					    <img className='create-event-image' src={media2} />
                        :
                        <video style={{margin: '20px auto', borderRadius: '10px'}} width="100%" src={media2} autoPlay controls />
                    }
					<label htmlFor='media2' onClick={() => {setChange2(event.media2Name)}} className='create-event-input'>change media</label>
				</div>
				:
				<div className='create-event-input'>
					<FontAwesomeIcon icon={faUpload} style={{margin: '0 10px'}}/>
					<label htmlFor='media2'>	
						add more media for your event
					</label>
				</div>
			}
			<input
				name='coverImage'
				id='media2'
				type='file'
				accept='.jpg, .jpeg, .png, .mp4'
				onChange={(e) => {
                    var file = e.target.files[0]
                    if(file.type.includes("video")){
                        const url = URL.createObjectURL(file);
                        setMedia2(url);
                    } else {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.addEventListener('load', () => {
                            setMedia2(reader.result);
                        });
                    }
                    var arr = event.name.split(' ');
                    arr.push("media2");
					var eventName = arr.toString();
                    var extension = file.name.split('.')[1];
			        setEvent({
						...event,
                        media2: file,
                        media2Type: file.type,
                        media2Name: `${eventName}.${extension}`
                    })
				}}
				className='create-event-file'
			/>
            {loading ?
                <Loader
                    type="ThreeDots"
                    color="#ff0033"
                    height={100}
                    width={100}
                    timeout={10000000} //10 secs
                />
                :
                null
            }
            <div>
                <button className="register-form-submit" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}