import React, { useEffect, useState } from 'react';
import { Avatar, Button } from '@material-ui/core';
import DateRangeIcon from '@material-ui/icons/DateRange';
import './UserProfile.css';
import db from './firebase';
import Follow from './Follow';
import { useSelector } from 'react-redux';
import firebase from 'firebase';

function UserProfile(props) {

    const [userProfile, setUserProfile] = useState({
        avatar: null,
        displayName: "",
        email: "",
        verified: false,
        followings: [],
        followers: [],
        joinTime:0
    });
    const [f, setF] = useState('');
    const [id, setId] = useState('');
    const [inthere, setInthere] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const user = useSelector(state=>state.user);
    function callback(e){
        setTrigger(e); 
    }

    useEffect(()=>{
        db.collection("users").where("email", "==", props.email)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                setUserProfile(doc.data());
                setId(doc.id);
                if(!props.isUser){
                    db.collection("users").doc(user.id).get().then((doc) => {
                        if(doc.data().followings.includes(props.email)){
                            setInthere(true);
                        }else{
                            console.log('Not Followed');
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
                }  
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }, [trigger, inthere]);

    function toFollow(){
        db.collection("users").doc(user.id).update({followings: firebase.firestore.FieldValue.arrayUnion(props.email)});
        db.collection("users").doc(id).update({followers: firebase.firestore.FieldValue.arrayUnion(user.email)});
        setInthere(true);
    };
    return (
        <div>
            <Avatar src={userProfile.avatar} className="profile-avatar-lg"/>
            <div className="flex">
                <h2 className="profile-displayName">{userProfile.displayName}</h2>
                {!props.isUser&&!inthere?<Button className="follow-btn" onClick={toFollow}>Follow</Button>:null}
            </div>
            <div className="profile-joinTime"><DateRangeIcon /><h4 className="profile-joinTime-text">Joined {new Date(userProfile.joinTime).toLocaleDateString("en-AU")}</h4></div>
            <div className="profile-follow-sum">
                <h4 className="profile-follow" onClick={()=>setF('following')}><span>{userProfile.followings.length}</span> followings</h4>
                <h4 className="profile-follow" onClick={()=>setF('follower')}><span>{userProfile.followers.length}</span> followers</h4>
            </div>
            {f==='following'||f==='follower'?<div className="profile-follow-bar">
                <div className={f==='following'?'profile-follow-option profile-follow-active':'profile-follow-option'} onClick={()=>setF('following')}>Followings</div>
                <div className={f==='follower'?'profile-follow-option profile-follow-active':'profile-follow-option'} onClick={()=>setF('follower')}>Followers</div>
            </div>:null}
            {f==='following'?<Follow data={userProfile.followings} isUser={props.isUser} follow={'following'} callback={callback} trigger={trigger}/>:null}
            {f==='follower'?<Follow data={userProfile.followers} isUser={props.isUser} follow={'follower'} callback={callback} trigger={trigger}/>:null}
        </div>
    );
};

export default UserProfile;
