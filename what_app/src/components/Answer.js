import React, { Suspense } from 'react';
import firebase from '../firebase'
import StarRatings from '../../node_modules/react-star-ratings';

function StarRating(props){
    return(
        <StarRatings
            rating={props.rating}
            starDimension="40px"
            starSpacing="15px"
            />
    );
}

function Answer(props){
    const [comments,setComments] = React.useState(null);
    const [communicators] = React.useState(props.communicators)
    const [hideButton,setHideButton] = React.useState(null)
    const [ratings,setRatings]=React.useState([])
    React.useMemo(()=>{
        let tempRatings=[];
        communicators.map((communicator,key)=>{
            let grade=0;
            firebase
            .firestore().collection('comments').where("AppId","==",communicator.id)
            .onSnapshot((snapshot)=>{
                const records = snapshot.docs.map((doc)=>({
                    id: doc.id,
                    ...doc.data()
                }))
                records.forEach(record => {
                    grade+=record.rating;
                });
                grade/=records.length;
                tempRatings[key]=grade;
        });
        })
        setRatings(tempRatings);
    },[])

    function loadComments(appID,key){
        firebase
        .firestore().collection('comments').where("AppId","==",appID)
        .onSnapshot((snapshot)=>{
            const records = snapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data()
            }))
            setComments(records);
        })
        setHideButton(key);
    }
    const results=React.useMemo(()=>{
        
    })

    return(
        <div>
            <p>Your answer n-boy</p>
            {communicators.map((communicator,key)=>{
                return (
                <div key={key}>
                    <p>name: {communicator.name}</p>
                    <StarRating rating={ratings[key]}/>
                    {hideButton!=key && <button onClick={()=>loadComments(communicator.id,key)}>load comments</button>}
                    {hideButton==key && comments != null && comments.map((comment,key2)=>{
                        return(<p key={key2}>{comment.text}</p>)
                    })}
                    {hideButton==key && <button onClick={()=>setHideButton(null)}>hide comments</button>}
                </div>)
            })}
        </div>
    )
}

export default Answer