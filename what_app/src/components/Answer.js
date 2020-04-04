import React from 'react';
import firebase from '../firebase'

function Answer(props){
    const appId = props.appId;
    const [comments,setComments] = React.useState(null);

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
        </div>
    )
}

export default Answer