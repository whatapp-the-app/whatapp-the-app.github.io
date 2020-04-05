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

// const useStyles = makeStyles((theme) => ({
//     paper: {
//         padding: theme.spacing(2),
//         textAlign: 'center',
//         color: theme.palette.text.secondary,
//         spacing: 10,
//     },
// }));

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      maxWidth: '500px',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
    cover: {
      width: 151,
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    playIcon: {
      height: 38,
      width: 38,
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
    const [ratings] = React.useState(props.ratings);
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
            {restartApp ? <Question questions={questions} communicators={allCommunicators}/> :
                <div>
                    {localStorage.getItem("displayName")!==null && <p>The best solution for {localStorage.getItem("displayName")}!</p>}
                    {localStorage.getItem("displayName")===null && <p>The best solution for You!</p>}
                    

                    {loggedIn === false && <Button variant="contained" onClick={() => {
                        setHideButton(null);
                        setLoggedIn(true);
                        googleLogin()
                    }}>log in to leave a rating</Button>}

                    {loggedIn && <Button variant="contained" onClick={() => {
                        setLoggedIn(false);
                        googleLogout()
                    }}>log out</Button>}
                    {communicators.map((communicator, key) => {
                        return (
                            <div key={key}>
                                <Card className={classes.root}>
                                    <div className={classes.details}>
                                        <CardContent className={classes.content}>
                                            <Typography component="h5" variant="h5">
                                                {communicator.name}
                                            </Typography>
                                            <Typography variant="subtitle1" color="textSecondary">
                                            {Math.round(ratings[communicator.id] * 100) / 100}
                                            </Typography>
                                        </CardContent>
                                        <div className={classes.controls}>
                                            <StarRating rating={ratings[communicator.id]}/>
                                        </div>
                                    </div>
                                    <CardMedia
                                        className={classes.cover}
                                        image="https://www.tabletowo.pl/wp-content/uploads/2019/07/slack.jpg"
                                    />
                                </Card>
                                {hideButton !== key &&
                                <Button onClick={() => loadComments(communicator.id, key)}>show comments</Button>}
                                {hideButton === key &&
                                <Button onClick={() => setHideButton(null)}>hide comments</Button>}
                                {hideButton === key && comments != null && comments.map((comment, key2) => {
                                    return (<div><TextField
                                        disabled
                                        id="filled-disabled"
                                        label={<Chip
                                            size="small"
                                            avatar={<Avatar alt=" " src={comment.photoURL} />}
                                            label={comment.displayName}
                                        />}
                                        defaultValue={comment.text}
                                        variant="filled"
                                      /><Rating
                                      readOnly
                                      name="simple-controlled"
                                      value={comment.rating}
                                  /></div>)
                                })}
                                {localStorage.getItem("user") != null && hideButton === key &&
                                <span>
                                    <TextField
                                        id="outlined-helperText"
                                        label={<Chip
                                            size="small"
                                            avatar={<Avatar alt=" " src={localStorage.getItem("photoURL")} />}
                                            label={localStorage.getItem("displayName")}
                                        />}
                                        helperText="your comment"
                                        variant="outlined"
                                        defaultValue={commentValue}
                                        onChange={(event)=>{
                                            setCommentValue(event.target.value);
                                        }}
                                        on
                                        /><Rating
                                        name="simple-controlled"
                                        value={ratingValue}
                                        precision={0.5}
                                        onChange={(event, newValue) => {
                                            setRatingValue(newValue);
                                            }}
                                    />
                                        <div>
                                        <div></div><div><Button onClick={() =>{addComment(communicator, ratingValue, commentValue)}} variant="contained">submit rating</Button>
                                        </div>
                                    </div>
                                </span>}
                                
                            </div>)
                    })}

                    <Button variant="contained" onClick={() => setRestart(true)}>Let's try again...</Button>
                </div>}
        </>
    )

}

export default Answer