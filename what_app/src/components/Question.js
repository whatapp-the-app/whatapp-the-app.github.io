import React from 'react';

function Question(props){
    const [breadcrumb,setBreadcrumb]=React.useState(props.breadcrumb);
    const [question,setQuestion]=React.useState(props.question)
    

    return(
        <div>
            <p>breadcrumb</p>
            <p>Lorem ipsum</p>
            <button >yes</button>
            <button >no</button>
        </div>
    )
}

export default Question