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
    
    return(
        <div>
            <p>Your answer n-boy</p>
            {communicators.map((communicator)=>{
                return <p>{communicator.name}</p>
            })}
        </div>
    )
}

export default Answer