import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from '@material-ui/core';
import db from './firebase';
import { storage } from './firebase';


function Profile(props){

    const [displayName, setDisplayName] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [progress, setProgress] = useState(0);

    function sendProfile(e){
        e.preventDefault();
        if(avatar){
           const upload = storage.ref(`images/${avatar.name}`).put(avatar);
            upload.on(
                "state_changed",
                snapshot => {
                    const progress = Math.round(snapshot.bytesTransferred*100/snapshot.totalBytes);
                    setProgress(progress);
                },
                error => {
                    console.log(error)
                },
                ()=>{
                    storage.ref("images").child(avatar.name).getDownloadURL().then(url=>{
                        db.collection("users").add({
                            displayName: displayName,
                            verified: false,
                            avatar: url,
                            email: props.email,
                            joinTime: Date.now(),
                            followers: [],
                            followings: []   
                            });
                        setRedirect(true);
                    });
                }
            ); 
        }else{
            db.collection("users").add({
                displayName: displayName,
                verified: false,
                avatar: null,
                email: props.email,
                joinTime: Date.now(),
                followers: [],
                followings: []     
                });
            setRedirect(true);
        };    
    };
    if(redirect){
        return <Redirect to="/signin"></Redirect>
    };

    return(
        <div className="register">
            <form className="login-form" onSubmit={(e)=>sendProfile(e)}>
                <p className="signup-success">Successfully signed up, please create your profile</p>
                <input type="text" placeholder="Display Name" className="form-input" onChange={(e)=>{
                        setDisplayName(e.target.value);
                    }}/>
                <div className="login-title"><h3>Choose Your Avatar</h3></div>
                <input type="file" onChange={(e)=>{
                    setAvatar(e.target.files[0]);
                }}/>
                {!(progress===0||progress===100)?<progress value={progress} max="100"/>:null}
                <Button type="submit" variant="outlined" className="submit-button">Submit</Button>
            </form>
            
        </div>    
    );
};

export default Profile;