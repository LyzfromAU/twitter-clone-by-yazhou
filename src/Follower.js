import React, { useEffect, useState } from 'react';
import { Avatar, Button } from '@material-ui/core';
import db from './firebase';
import { useSelector } from 'react-redux';
import firebase from 'firebase';

function Follower(props) {
    const [follower, setFollower] = useState({});
    const [followerId, setFollowerId] = useState('');
    const user = useSelector(state=>state.user);
    const [text, setText] = useState('Following');
    const [inthere, setInthere] = useState(false);
    const [localTrigger, setLocalTrigger] = useState(false);
    useEffect(()=>{
        db.collection("users").where("email", "==", props.follower)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                setFollower(doc.data());
                setFollowerId(doc.id);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
        db.collection("users").doc(user.id).get().then((doc) => {
            if(doc.data().followings.includes(props.follower)){
                setInthere(true);
            }else{
                setInthere(false);
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        
    }, [localTrigger]);
    
    function unfollow(){
        db.collection("users").doc(user.id).update({followings: firebase.firestore.FieldValue.arrayRemove(props.follower)});
        db.collection("users").doc(followerId).update({followers: firebase.firestore.FieldValue.arrayRemove(user.email)});
        props.callback(!props.trigger);
        setLocalTrigger(!localTrigger);
    };
    function toFollow(){
        db.collection("users").doc(user.id).update({followings: firebase.firestore.FieldValue.arrayUnion(props.follower)});
        db.collection("users").doc(followerId).update({followers: firebase.firestore.FieldValue.arrayUnion(user.email)});
        props.callback(!props.trigger);
        setLocalTrigger(!localTrigger);
    };
    function hover(){
        setText('Unfollow');
    }
    function leaveHover(){
        setText('Following');
    }
    
    return (
        <div className="flex">
            <div className="flex">
                <Avatar src={follower.avatar} className="follow-list-avatar"/>
                <h3>{follower.displayName}</h3>  
            </div>
            {inthere?<Button className={text==='Following'?"follow-btn":"unfollow-btn"} onClick={unfollow} onMouseOver={hover} onMouseOut={leaveHover}>{text}</Button>
            :<Button onClick={toFollow} className="follow-btn">Follow</Button>}
        </div>
    );
};

export default Follower;
