import React from 'react';
import firebase from '../firebase'
import Question from './Question'
// Material UI Imports
import {Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

function LandingPage(){
    const [communicators, setCommunicators] = React.useState(null);
    const [start, setStart] = React.useState(true);
    const [questions, setQuestions] = React.useState(null);
    const [ratings, setRatings] = React.useState([]);


    const classes = useStyles();

    React.useMemo(() => {
        getQuestions()
    }, []);
    React.useMemo(() => {
        getAllCommunicators()
    }, []);
    React.useMemo(() => {
        getRatings()
    }, [communicators]);

    function getRatings() {
        if (communicators != null) {
            let tempRatings = [];
            communicators.map((communicator, key) => {
                let grade = 0;
                firebase
                    .firestore().collection('comments').where("AppId", "==", communicator.id)
                    .onSnapshot((snapshot) => {
                        const records = snapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data()
                        }));
                        records.forEach(record => {
                            grade += record.rating;
                        });
                        grade /= records.length;
                        tempRatings[communicator.id] = grade;
                    });
            });
            setRatings(tempRatings);
        }
    }

    function getQuestions() {
        firebase
            .firestore().collection('questions')
            .onSnapshot((snapshot) => {
                const records = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                records.sort((a, b) => parseInt(a.ID, 10) - parseInt(b.ID, 10));
                setQuestions(records);
            })
    }

    function getAllCommunicators() {
        firebase
            .firestore().collection('communicators')
            .onSnapshot((snapshot) => {
                const records = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCommunicators(records);
            })
    }

    return (
        <>
            <Container maxWidth="md">
                <div className={classes.root}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <div className={classes.paper}>
                                <h1>WhatsApp</h1>
                                <h3>Let us help you choose your communicator</h3>
                                <hr></hr>
                            </div>
                        </Grid>

                        {start ? <><Grid item xs={12}>
                                <div className={classes.paper}>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vitae nunc quis
                                        arcu eleifend posuere. Vivamus bibendum lacus et nisi posuere tincidunt. Vestibulum
                                        interdum et lacus quis cursus. Sed sed risus rhoncus, lobortis massa eget, cursus
                                        metus. Quisque varius, justo in tristique vulputate, massa ex bibendum mauris, et
                                        ornare sapien sapien ut nulla.</p>
                                </div>
                            </Grid>
                                <Grid item xs={12} sm={4}>
                                    <div className={classes.paper}>
                                        <FavoriteIcon style={{fontSize: 100}}/>
                                        <h2>IT'S EASY</h2>
                                        <h5>Just answer a few questions!</h5>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <div className={classes.paper}>
                                        <AccessibilityNewIcon style={{fontSize: 100}}/>
                                        <h2>1000+</h2>
                                        <h5>People helped!</h5>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <div className={classes.paper}>
                                        <MoneyOffIcon style={{fontSize: 100}}/>
                                        <h2>IT'S FREE</h2>
                                        <h5>We are here to help you!</h5>
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    <div className={classes.paper}>
                                        <h3>Are you ready to start?</h3>

                                        <Button variant="contained" color="primary" onClick={() => {
                                            setStart(false)
                                        }}>
                                            Let's go!
                                        </Button>
                                    </div>
                                </Grid></> :
                            <Question ratings={ratings} questions={questions}
                                      communicators={communicators}/>
                        }


                        <Grid item xs={12}>
                            <hr/>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </>
    )
}

export default LandingPage