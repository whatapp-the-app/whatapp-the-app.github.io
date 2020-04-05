import React from 'react';
import firebase from '../firebase'
import StarRatings from '../../node_modules/react-star-ratings';
import {Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Question from "./Question";
import Rating from '@material-ui/lab/Rating';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import { useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';

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
        localStorage.setItem("user", user);
        localStorage.setItem("displayName", user.displayName);
        localStorage.setItem("photoUrl", user.photoURL);
        alert("welcome " + user.displayName);
    })
}


function addComment(communicator, rating, text) {

    firebase.firestore().collection('comments').where('AppId', '==', communicator.id).where("displayName", '==', localStorage.getItem("displayName"))
        .onSnapshot((snapshot) => {
            const records = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            if (records.length !== 0) {
                firebase.firestore().collection('comments').doc(records[0].id).update({
                    AppId: communicator.id,
                    rating: rating,
                    text: text,
                    displayName: localStorage.getItem("displayName"),
                    photoURL: localStorage.getItem("photoUrl")
                })
            } else {
                firebase.firestore().collection('comments').add({
                    AppId: communicator.id,
                    rating: rating,
                    text: text,
                    displayName: localStorage.getItem("displayName"),
                    photoURL: localStorage.getItem("photoUrl"),
                    timestamp: Date.now()
                })
            }

        });
}

function googleLogout() {
    firebase.auth().signOut();
    localStorage.removeItem("user");
}

function Answer(props) {
    
    const classes = useStyles();
    const theme = useTheme();

    const [ratingValue, setRatingValue] = React.useState(2);
    const [commentValue, setCommentValue] = React.useState("Any feedback is welcome!");
    const ratings= props.ratings;
    const [comments, setComments] = React.useState(null);

    const [communicators] = React.useState(props.communicators);
    const [allCommunicators] = React.useState(props.allCommunicators);
    const [questions] = React.useState(props.questions);

    const [hideButton, setHideButton] = React.useState(null);
    const [restartApp, setRestart] = React.useState(false);

    const [loggedIn, setLoggedIn] = React.useState(localStorage.getItem("user") !== null);

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

    return (<>
            <Grid container class={classes.paper}>
                {restartApp ? <Question questions={questions} communicators={allCommunicators}/> :
                    <Grid item xs={12}>
                        {localStorage.getItem("displayName")!==null && <p>The best solution for {localStorage.getItem("displayName")}!</p>}
                        {localStorage.getItem("displayName")===null && <p>The best solution for You!</p>}
                        
                        {loggedIn === false && <Button variant="contained" onClick={() => {setHideButton(null);setLoggedIn(true);googleLogin()}}>log in to leave a rating</Button>}
                        {loggedIn && <Button variant="contained" onClick={() => {setLoggedIn(false);googleLogout()}}>log out</Button>}
                        
                        {communicators.map((communicator, key) => {
                            return (<>
                                <Grid item xs={12}>
                                    <div key={key}>
                                        <Grid container class={classes.paper}>
                                            <Grid item xs={12}>
                                                <h1>{communicator.name}</h1>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <StarRating size="35px" rating={ratings[communicator.id]}/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <p>{Math.round(ratings[communicator.id] * 100) / 100}</p>
                                            </Grid>
                                        </Grid>
                                   
                                        {hideButton !== key && <Button onClick={() => loadComments(communicator.id, key)}>show comments</Button>}
                                        {hideButton === key && <Button onClick={() => setHideButton(null)}>hide comments</Button>}
                                        
                                        {hideButton === key && comments != null && comments.map((comment, key2) => {
                                            return (
                                                <Grid container class={classes.paper}>
                                                    <Grid item xs={12}>
                                                        <h5>{comment.displayName}</h5>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Avatar alt=" " src={comment.photoURL} style={{margin: "0 auto 10px"}}/>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Rating readOnly name="simple-controlled" value={comment.rating} />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <p>{comment.text}</p>
                                                    </Grid>
                                                </Grid>
                                                )
                                        })}

                                        {localStorage.getItem("user") != null && hideButton === key &&
                                        <Grid container class={classes.paper}>
                                            <Grid item xs={12}>
                                                <h5>{localStorage.getItem("displayName")}</h5>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Avatar alt=" " src={localStorage.getItem("photoURL")} style={{margin: "0 auto 10px"}}/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Rating name="simple-controlled" value={ratingValue} onChange={(event, newValue) => {setRatingValue(newValue);}}/>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField 
                                                    id="outlined-full-width"
                                                    label="Your Comment"
                                                    variant="outlined"
                                                    color="secondary"
                                                    style={{ margin: "10px" }}
                                                    onChange={(event)=>{
                                                        setCommentValue(event.target.value);
                                                    }}
                                                />
                                            </Grid>   
                                            <Grid item xs={12}>
                                                <Button onClick={() =>{addComment(communicator, ratingValue, commentValue)}} variant="contained">submit rating</Button>
                                            </Grid>    
                                        </Grid>}
                                        </div>
                                    </Grid></>)
                        })}

                    <Button variant="contained" onClick={() => setRestart(true)}>Let's try again...</Button>
                </Grid>}
            </Grid>
        </>
    )

}

export default Answer