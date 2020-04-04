import React from 'react';
import { AnswerContext } from '../AnswerContext.js';

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
    //const [question,setQuestion]=React.useState(props.question)
    const [questions, setQuestions]=React.useState(props.questions)
    const [communicators,setCommunicators]=React.useState(props.communicators)
    const [currentText,setCurrentText]=React.useState(questions[0].TextField)
    const breadcrumbs_list = breadcrumb.split(' ');
    //const [hasAnswer,setHasAnswer] = React.useContext(AnswerContext);

    function checkIfHasAnswer(){
        if(questions.length==1 || communicators.length ==1){
            localStorage.setItem("communicators",{communicators});
            //setHasAnswer("true");
            localStorage.setItem("hasAnswer",true);
        }else{
            setCurrentText(questions.pop().TextField)
        }
        //TODO case when all communcators would be rejected
    }
    return(
        <div>
            <ul><BreadcrumbButtons items={breadcrumbs_list} /></ul>
            <p>{currentText}</p>
            <button onClick={()=>{checkIfHasAnswer();setBreadcrumb(breadcrumb + " yes")}}>yes</button>
            <button onClick={()=>{checkIfHasAnswer();setBreadcrumb(breadcrumb + " no")}}>no</button>
        </div>
    )
}

export default Question