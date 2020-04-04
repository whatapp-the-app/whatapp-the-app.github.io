import React from 'react';

function BreadcrumbList(props) {
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
    const [question,setQuestion]=React.useState(props.question)
    

    const breadcrumbs_list = breadcrumb.split(' ');

    return(
        <div>
            <ul><BreadcrumbList items={breadcrumbs_list} /></ul>
            <p>Lorem ipsum</p>
            <button onClick={()=>setBreadcrumb(breadcrumb + " yes")}>yes</button>
            <button onClick={()=>setBreadcrumb(breadcrumb + " no")}>no</button>
        </div>
    )
}

export default Question