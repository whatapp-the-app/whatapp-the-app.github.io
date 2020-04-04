import React from 'react';
import firebase from '../firebase'

function Answer(props){
    const appId = props.appId;
    const [comments,setComments] = React.useState(null);
    const [communicators] = React.useState(props.communicators)

    function getAllComments(){
        firebase
        .firestore().collection('comments').where("appId","==",{appId})
        .onSnapshot((snapshot)=>{
            const records = snapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data()
            }))
            setComments(records);
        })
    }
    function loadComments(appID){
        console.log(appID)
        firebase
        .firestore().collection('comments').where("AppId","==",appID)
        .onSnapshot((snapshot)=>{
            const records = snapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data()
            }))
            console.log(records)
        })
    }

    return(
        <div>
            <p>Your answer n-boy</p>
            {communicators.map((communicator,key)=>{
                return (
                <div key={key}>
                    <p>name: {communicator.name}</p>
                    <button onClick={()=>loadComments(communicator.id)}>load comments</button>
                </div>)
            })}
        </div>
    )
}

export default Answer