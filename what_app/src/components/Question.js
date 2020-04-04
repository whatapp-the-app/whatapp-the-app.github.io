import React from 'react';
import Answer from './Answer';
import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));

function BreadcrumbButtons(props) {
    let array = [];
    for (let i = 0; i < props.items.length; i++) {
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

function getAllMaxInMap(map) {
    let arr = [];

    const max = Array.from(map.values()).reduce(
        (a, b) => a >= b ? a : b
    );

    console.log(max);

    for (const [key, value] of map) {
        if (value === max) {
            arr.push(key);
        }
    }

    return arr;
}

function Question(props) {
    const [breadcrumb = "START", setBreadcrumb] = React.useState(props.breadcrumb);
    const breadcrumbs_list = breadcrumb.split(' ');

    const [questions, setQuestions] = React.useState(props.questions);
    const [currentQuestion, setCurrentQuestion] = React.useState(questions[0]);

    const [communicators, setCommunicators] = React.useState(props.communicators);
    const [communicatorScores, setCommunicatorScores] = React.useState(
        new Map(communicators.map(obj => [obj, 0]))
    );
    const [bestFitCommunicators, setBestFitCommunicators] = React.useState(null);

    const [currentText, setCurrentText] = React.useState(questions[0].TextField);
    const [hasAnswer, setHasAnswer] = React.useState(false);

    function applyAnswer(ans) {
        let tempCommunicatorScores = new Map();

        for (const [key, value] of communicatorScores) {
            tempCommunicatorScores.set(key, key[currentQuestion.feature] === true ? value + ans : value);
        }

        setCommunicatorScores(tempCommunicatorScores);
    }

    function checkIfHasAnswer(ans) {

        if (questions.length == 1 || communicators.length == 1) {

            setBestFitCommunicators(getAllMaxInMap(communicatorScores));
            setHasAnswer(true);

            // localStorage.setItem("communicators", {communicators});
            // localStorage.setItem("hasAnswer", true);
        } else {
            applyAnswer(ans);
            setCurrentQuestion(questions.pop());
        }


        //TODO case when all communicators would be rejected
    }

    const strongButtonText = "stronk";
    const okButtonText = "yass";
    const noButtonText = "bruh";

    const classes = useStyles();

    return (
        <Grid item xs={12}>
          <div className={classes.paper}>

            {hasAnswer ? <Answer communicators={bestFitCommunicators}/> : <div>
                <BreadcrumbButtons items={breadcrumbs_list}/>
                <p>{currentQuestion.TextField}</p>

                <Button variant="contained" color="primary" onClick={() => {
                    checkIfHasAnswer(0);
                    setBreadcrumb(breadcrumb + " " + noButtonText)
                }}>{noButtonText}
                </Button>

                <Button variant="contained" color="primary" onClick={() => {
                    checkIfHasAnswer(1);
                    setBreadcrumb(breadcrumb + " " + okButtonText)
                }}>{okButtonText}
                </Button>

                <Button variant="contained" color="primary" onClick={() => {
                    checkIfHasAnswer(2);
                    setBreadcrumb(breadcrumb + " " + strongButtonText)
                }}>{strongButtonText}
                </Button>
            </div>}
                
            </div>
        </Grid>
    )
}

export default Question