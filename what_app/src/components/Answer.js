import React, {Suspense} from 'react';
import firebase from '../firebase'
import StarRatings from '../../node_modules/react-star-ratings';
import {Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Question from "./Question";

function StarRating(props) {
    return (
        <StarRatings
            rating={props.rating}
            starDimension={props.size}
            starSpacing="0px"
        />
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        spacing: 10,
    },
}));


function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(result => {

        const user = result.user;
        console.log(user.displayName)
        localStorage.setItem("user", user);
        localStorage.setItem("displayName", user.displayName);
        localStorage.setItem("photoUrl", user.photoURL);
        console.log(user)
        alert("hello " + user.displayName);
    })
}

function addComment(communicator, rating, text) {
    firebase.firestore().collection('comments').add({
        AppId: communicator.id,
        rating: rating,
        text: text,
        displayName: localStorage.getItem("displayName"),
        photoURL: localStorage.getItem("photoUrl"),
        timestamp: Date.now()
    });
    console.log(localStorage.getItem("displayName"));
    console.log(localStorage.getItem("photoUrl"))
}

function googleLogout() {
    firebase.auth().signOut();
    localStorage.removeItem("user");
}

function Answer(props) {
    const [ratings] = React.useState(props.ratings);
    const [comments, setComments] = React.useState(null);

    const [communicators] = React.useState(props.communicators);
    const [allCommunicators] = React.useState(props.allCommunicators);
    const [questions] = React.useState(props.questions);

    const [hideButton, setHideButton] = React.useState(null);
    const [restartApp, setRestart] = React.useState(false);

    const [loggedIn, setLoggedIn] = React.useState(localStorage.getItem("user") == null);

    function loadComments(appID, key) {
        firebase
            .firestore().collection('comments').where("AppId", "==", appID)
            .onSnapshot((snapshot) => {
                const records = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setComments(records);
            });
        setHideButton(key);
    }

    const classes = useStyles();

    return (<>
            {restartApp ? <Question questions={questions} communicators={allCommunicators}/> :
                <Grid container class={classes.paper}>

                    <Grid item xs={12} style={{marginBottom: "100px"}}>
                        <h3>OUR RECOMMENDATIONS FOR YOU:</h3>
                        {loggedIn === false && <Button variant="contained" color="primary" onClick={() => {
                            setHideButton(null);
                            setLoggedIn(true);
                            googleLogin()
                        }}>log in to leave a comment</Button>}
                    </Grid>

                    {communicators.map((communicator, key) => {
                        return (<>
                            <div key={key} style={{margin: "20px"}}>

                                <Grid item xs={12} style={{paddingBottom: "20px"}}>
                                    <h2 style={{margin: "10px"}}>{communicator.name}</h2>
                                    <StarRating size="30px" rating={ratings[communicator.id]}/>
                                </Grid>

                                {hideButton !== key && <Button variant="contained" color="primary"
                                                               onClick={() => loadComments(communicator.id, key)}>load
                                    comments</Button>}
                                {hideButton === key && <h4>Comments:</h4>}
                                {hideButton === key && comments != null && comments.map((comment, key2) => {
                                    return (
                                        <>
                                            <div>

                                                <p key={key2} style={{
                                                    color: "black",
                                                    fontWeight: "bold"
                                                }}>{comment.displayName}</p>
                                                <StarRating size="15px" key={key2} rating={comment.rating}/>
                                                <p key={key2}>{comment.text}</p>

                                            </div>
                                            <hr style={{width: "25%"}}/>
                                        </>
                                    )
                                })}
                                {localStorage.getItem("user") != null && hideButton == key &&
                                <Button variant="contained" color="primary"
                                        onClick={() => addComment(communicator, 4, "lol")}>submit rating</Button>}
                                {hideButton === key &&
                                <Button variant="contained" color="primary" onClick={() => setHideButton(null)}>hide
                                    comments</Button>}
                            </div>
                            <hr/>
                        </>)
                    })}

                    <button onClick={() => setRestart(true)}>Let's start again...</button>

                    {loggedIn && <Button variant="contained" color="primary" onClick={() => {
                        setLoggedIn(false);
                        googleLogout()
                    }}>log out</Button>}
                </Grid>}
        </>
    )

}

export default Answer