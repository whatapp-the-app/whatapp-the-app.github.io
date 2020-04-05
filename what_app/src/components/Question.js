import React from 'react';
import Answer from './Answer';
import {Button} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';

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
            <Button variant="contained" key={i}>{props.items[i]}</Button>
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

    const [questions] = React.useState(props.questions);
    const [nextQuestions] = React.useState(
        () => {
            const numbers = [...Array(questions.length).keys()].map(num => num);
            numbers.sort(() => Math.random() - .5);

            let arr = [];
            for (const number of numbers) {
                arr.push(questions[number]);
            }

            return arr;
        }
    );
    const [currentQuestion, setCurrentQuestion] = React.useState(questions[0]);

    const [communicators, setCommunicators] = React.useState(props.communicators);
    const [communicatorScores, setCommunicatorScores] = React.useState(
        new Map(communicators.map(obj => [obj, 0]))
    );

    const [bestFitCommunicators, setBestFitCommunicators] = React.useState(null);

    const [hasAnswer, setHasAnswer] = React.useState(false);
    const [ratings] = React.useState(props.ratings);

    function applyAnswer(ans) {
        let tempCommunicatorScores = new Map();

        for (const [key, value] of communicatorScores) {
            tempCommunicatorScores.set(key, key[currentQuestion.feature] === true ? value + ans : value);
        }

        setCommunicatorScores(tempCommunicatorScores);
    }

    function checkIfHasAnswer(ans) {

        if (questions.length <= 1) {

            setBestFitCommunicators(getAllMaxInMap(communicatorScores));
            setHasAnswer(true);

            // localStorage.setItem("communicators", {communicators});
            // localStorage.setItem("hasAnswer", true);
        } else {
            applyAnswer(ans);

            if (questions.length === nextQuestions.length) {
                questions.shift();
            }

            setCurrentQuestion(questions.shift());
        }
    }

    const strongButtonText = "must-have";
    const okButtonText = "maybe";
    const noButtonText = "no";

    const classes = useStyles();

    return (

        <Grid item xs={12}>
            <div className={classes.paper}>

                {hasAnswer ?
                    <Answer ratings={ratings} communicators={bestFitCommunicators} allCommunicators={communicators}
                            questions={nextQuestions}/> : <div>

                        <BreadcrumbButtons items={breadcrumbs_list}/>
                        <h1>{currentQuestion.TextField}</h1>

                        <Grid container>
                            <Grid item xs={3}/>
                            <Grid item xs={2}>
                                <Button variant="contained" color="primary" onClick={() => {
                                    checkIfHasAnswer(2);
                                    setBreadcrumb(breadcrumb + " " + strongButtonText)
                                }}>{strongButtonText}
                                </Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button variant="contained" color="primary" onClick={() => {
                                    checkIfHasAnswer(1);
                                    setBreadcrumb(breadcrumb + " " + okButtonText)
                                }}>{okButtonText}
                                </Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button variant="contained" color="primary" onClick={() => {
                                    checkIfHasAnswer(0);
                                    setBreadcrumb(breadcrumb + " " + noButtonText)
                                }}>{noButtonText}
                                </Button>
                            </Grid>
                            <Grid item xs={3}/>
                        </Grid>
                    </div>}
            </div>
        </Grid>
    )
}

export default Question