import React, { useEffect, useState } from 'react';
import firebase from '../firebase/index';

export default function Test() {
    const [list1, setList1] = useState([])
    const [tempObj, setTempObj] = useState({})

    useEffect(() => {
        var arr = []
        firebase.db.collection("users").get()
        .then(res => {
            // console.log(res.docs.length)
            res.docs.forEach(doc => {
                setTempObj({name: doc.data().name})
            })
        })
    }, [])

    useEffect(() => {
        setList1([...list1, tempObj]);
    }, [tempObj])

    return(
        <div>
            {/* {list1.map(val => (<li>{val.name}</li>))} */}
        </div>
    )
}