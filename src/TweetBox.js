import React, { useState }from 'react';
import './TweetBox.css';
import { Avatar, Button } from '@material-ui/core';
import db from './firebase';
import { storage } from './firebase';
import ImageIcon from '@material-ui/icons/Image';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';



function TweetBox(props) {

    const [tweetMessage, setTweetMessage] = useState("");
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const user = useSelector(state=>state.user);

    function handleChange(e){
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        };
    };
    function sendTweet(){
        if(image){
           const upload = storage.ref(`images/${image.name}`).put(image);
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
                    storage.ref("images").child(image.name).getDownloadURL().then(url=>{
                        db.collection("posts").add({
                            displayName: props.userProfile.displayName,
                            verified: props.userProfile.verified,
                            text: tweetMessage,
                            image: url,
                            avatar: props.userProfile.avatar,
                            retweets: 0,
                            likes: [],
                            user: user.email,
                            createTime: Date.now()
                            });
                        setTweetMessage("");
                    });
                }
            ); 
        }else{
            db.collection("posts").add({
                displayName: props.userProfile.displayName,
                verified: props.userProfile.verified,
                text: tweetMessage,
                image: null,
                avatar: props.userProfile.avatar, 
                retweets: 0,
                likes: [], 
                user: user.email,
                createTime: Date.now()  
                });
            setTweetMessage("");
        };    
    };
    return (
        <div className="tweetBox">
            <form>
                <div className="tweetBox-input">
                    <Avatar src={props.userProfile.avatar}/>
                    <input
                        onChange={(e) => setTweetMessage(e.target.value)}
                        value={tweetMessage}
                        placeholder="What's happening?"
                        type="text"
                    />  
                </div>
                <div>
                    <label for="img-up"className="custom-file-upload"><ImageIcon className="upload-icon"/></label>
                    <input id="img-up" type="file" className="tweetBox-file" onChange={(e)=>handleChange(e)}/>
                    {!(progress===0||progress===100)?<progress value={progress} max="100"/>:null}
                </div>
                {user.isLoggedIn?<Button className="tweetBox-tweet" onClick={sendTweet}>Tweet</Button>:<Link to="/signin" className="signin-to-tweet"><Button className="tweetBox-tweet">Sign In to Tweet</Button></Link>}  
            </form>
        </div>
    )
}

export default TweetBox;
