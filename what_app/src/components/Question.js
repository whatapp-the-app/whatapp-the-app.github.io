import React from 'react';
import Answer from './Answer';

function BreadcrumbButtons(props) {
    let array = [];
    for(let i = 0; i < props.items.length; i++) {
        array.push(
        <button key={i}>{props.items[i]}</button>
        );
    }
    return (
    <div>
        {array}
    </div>
    );
}

function Question(props){
    const [breadcrumb = "START",setBreadcrumb]=React.useState(props.breadcrumb);
    const [questions, setQuestions]=React.useState(props.questions)
    const [communicators,setCommunicators]=React.useState(props.communicators)
    const [currentText,setCurrentText]=React.useState(questions[0].TextField)
    const [currentQuestion,setCurrentQuestion]=React.useState(questions[0])
    const breadcrumbs_list = breadcrumb.split(' ');
    const [hasAnswer,setHasAnswer]= React.useState(false);

    function applyAnswer(ans){
        if (ans===true)
        {let tempCommunicators=[];
        communicators.map((communicator)=>{
            if(communicator[currentQuestion.feature]==ans){
                tempCommunicators.push(communicator);
            }
        })
        setCommunicators(tempCommunicators);}
    }

    function checkIfHasAnswer(ans){
        
        if(questions.length==1 || communicators.length ==1){
            localStorage.setItem("communicators",{communicators});
            setHasAnswer(true);
            localStorage.setItem("hasAnswer",true);
        }else{
            applyAnswer(ans);
            setCurrentQuestion(questions.pop());
        }
        //TODO case when all communicators would be rejected
    }
    return(
        <div>{hasAnswer? <Answer communicators={communicators}/>:<div><ul><BreadcrumbButtons items={breadcrumbs_list} /></ul>
        <p>{currentQuestion.TextField}</p>
        <button onClick={()=>{checkIfHasAnswer(true);setBreadcrumb(breadcrumb + " yes")}}>yes</button>
        <button onClick={()=>{checkIfHasAnswer(false);setBreadcrumb(breadcrumb + " no")}}>no</button></div>}
            
        </div>
    )
}

export default Question