import React, { useState } from 'react';
import firebase from '../firebase'
import Question from './Question'
import Answer from './Answer'

function LandingPage(){
    const [communicators, setCommunicators] = React.useState(null);
    const [start,setStart] = React.useState(true);
    const [questions,setQuestions]= React.useState(null);

    function getQuestions(){
        firebase
        .firestore().collection('questions')
        .onSnapshot((snapshot)=>{
            const records = snapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data()
            }))
            setQuestions(records);
        })
    }

    function getAllCommuniators(){
        firebase
        .firestore().collection('communicators')
        .onSnapshot((snapshot)=>{
            const records = snapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data()
            }))
            console.log(records)
            //setCommunicators(records);
        })
    }
    
    return(
        <>
        {getAllCommuniators()}
        {start ? <div>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras fermentum eget nisi non fermentum. Etiam varius ligula nec ante mollis, eget placerat metus mollis. Praesent et auctor odio. Cras lacinia justo at mauris molestie rutrum. Integer luctus purus vel mi ultricies ultrices. Vestibulum non ipsum non turpis blandit tempor.</p>
            <button onClick={()=>setStart(false)}>start</button>
        </div> :
        communicators===null ?
        <Question question={questions[0]}></Question>:
        communicators.length()===1 || questions.length()===0 ? 
        <Answer communicators={communicators}/>:
        <Question/>}
        </>
    )
}

export default LandingPage