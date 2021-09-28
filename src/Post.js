import React, { forwardRef, useEffect, useState } from 'react';
import './Post.css';
import { Avatar, Button } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import RepeatIcon from '@material-ui/icons/Repeat';
import PublishIcon from '@material-ui/icons/Publish';
import { useDispatch, useSelector } from 'react-redux';
import 'reactjs-popup/dist/index.css';
import Popup from 'reactjs-popup';
import db from './firebase';
import firebase from 'firebase';
import FavoriteTwoToneIcon from '@material-ui/icons/FavoriteTwoTone';
import { changeView } from './actions/changeView';
import TimeAgo from 'timeago-react';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';



const Post = forwardRef(({ displayName, verified, createTime, text, image, avatar, userProfile, id, isRetweet, retweeterAvatar, retweeterDisplayName, retweeterVerified, originalTweetId, likes, retweets, userNotFromReducer, originalTweetUser, retweetUser}, ref) => {
    const [showPopup, setShowPopup] = useState(false);
    const user = useSelector(state=>state.user);
    const [reply, setReply] = useState('');
    const [liked, setLiked] = useState(false);
    const [numberOfReply, setNumberOfReply] = useState(0);
    const dispatch = useDispatch();

    useEffect(()=>{
        setLiked(likes.includes(user.email));
        db.collection("replies").where("belongTo", "==", id)
        .get()
        .then((querySnapshot) => {
            setNumberOfReply(querySnapshot.size);
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }, [showPopup]);
    
    function sendReply(){
        db.collection("replies").add({
            displayName: userProfile.displayName,
            verified: userProfile.verified,
            text: reply,
            avatar: userProfile.avatar, 
            belongTo: id   
            });
        setReply(''); 
        setShowPopup(false);   
    };
    function sendReplyToRetweet(){
        db.collection("replies").add({
            displayName: userProfile.displayName,
            verified: userProfile.verified,
            text: reply,
            avatar: userProfile.avatar, 
            belongTo: originalTweetId   
            });
        setReply(''); 
        setShowPopup(false);   
    };
    function retweet(e){
        e.stopPropagation();
        db.collection("posts").add({
            displayName: displayName,
            verified: verified,
            text: text,
            image: image,
            avatar: avatar, 
            isRetweet: true,
            retweeterAvatar: userProfile.avatar,
            retweeterDisplayName: userProfile.displayName,
            retweeterVerified: userProfile.verified,
            originalTweetId: id, 
            retweetUser: user.email,
            originalTweetUser: userNotFromReducer,
            likes: [],
            createTime: Date.now(),
            retweeterVerified: userProfile.verified
        });
        db.collection("posts").doc(id).update({retweets: firebase.firestore.FieldValue.increment(1)});
    };
    function like(e){
        e.stopPropagation();
        if(!liked){
            db.collection("posts").doc(id).update({likes: firebase.firestore.FieldValue.arrayUnion(user.email)}); 
            setLiked(!liked);
        }else{
            db.collection("posts").doc(id).update({likes: firebase.firestore.FieldValue.arrayRemove(user.email)}); 
            setLiked(!liked);
        };    
    };
    function deleteTweet(e){
        e.stopPropagation();
        db.collection("posts").doc(id).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    return (
        <>
        {!isRetweet?(<div className="post" ref={ref}>
            <div className="post-avatar" onClick={(e)=>{
                e.stopPropagation();
                dispatch(changeView(userNotFromReducer));
                }}>
                <Avatar src={avatar} />
            </div>
            <div className="post-body">
                <div className="post-header">
                    <div className="post-header-text">
                        <h3>{displayName}<span className="post-special">
                            {verified?<VerifiedUserIcon className="post-badge" />:null}
                            <TimeAgo datetime={createTime} locale='en_AU' className="time-ago"/>
                            </span></h3>
                    </div>
                    <div className="post-header-description">
                        <p>{text}</p>
                    </div> 
                </div>
                {image?<img src={image} alt="img" className="post-img"/>:null}
                <div className="post-footer">
                    <div className="post-counter"><ChatBubbleOutlineIcon fontSize="small" onClick={(e)=>{
                        e.stopPropagation();
                        setShowPopup(true);
                        }} /><span className="post-counter-number">{numberOfReply===0?null:numberOfReply}</span></div>
                    <div className="post-counter">
                        <RepeatIcon fontSize="small" onClick={(e)=>{retweet(e)}}/>
                        <span className="post-counter-number">{retweets===0?null:retweets}</span>
                    </div>
                    <div className="post-counter">
                        <FavoriteTwoToneIcon fontSize="small" onClick={(e)=>{like(e)}} className={liked?"liked":"unliked"}/>
                        <span className="post-counter-number">{likes.length===0?null:likes.length}</span>
                    </div>
                    {user.email===userNotFromReducer?<DeleteOutlinedIcon fontSize="small" onClick={(e)=>{
                        deleteTweet(e);
                    }}/>:<PublishIcon fontSize="small" />}
                </div>
            </div>
            <Popup open={showPopup} position="right center" closeOnDocumentClick={false}>
                <div className="tweetBox">
                    <form>
                        <div className="tweetBox-input">
                            <Avatar src={user.avatar}/>
                            <input
                                onChange={(e) => setReply(e.target.value)}
                                value={reply}
                                type="text"
                            />  
                        </div> 
                        <Button className="tweetBox-tweet" onClick={sendReply}>Reply</Button>
                    </form>
                </div> 
            </Popup> 
        </div>):(<div className="post" ref={ref}>
            <div className="post-avatar" onClick={(e)=>{
                e.stopPropagation();
                dispatch(changeView(retweetUser));
                }}>
                <Avatar src={retweeterAvatar} />
            </div>
            <div className="post-body">
                <div className="post-header">
                    <div className="post-header-text">
                        <h3>{retweeterDisplayName}<span className="post-special">
                            {retweeterVerified?<VerifiedUserIcon className="post-badge" />:null}
                            <TimeAgo datetime={createTime} locale='en_AU' className="time-ago"/>
                            </span></h3>
                    </div>
                </div>
                <div className="post" ref={ref}>
                    <div className="post-avatar" onClick={(e)=>{
                        e.stopPropagation();
                        dispatch(changeView(originalTweetUser));
                        }}>
                        <Avatar src={avatar} />
                    </div>
                    <div className="post-body">
                        <div className="post-header">
                            <div className="post-header-text">
                                <h3>{displayName}<span className="post-special">
                                    {verified?<VerifiedUserIcon className="post-badge" />:null}
                                    </span></h3>
                            </div>
                            <div className="post-header-description">
                                <p>{text}</p>
                            </div> 
                        </div>
                        {image?<img src={image} alt="img" className="post-img"/>:null}
                        <div className="post-footer">
                            <div className="post-counter">
                                <ChatBubbleOutlineIcon fontSize="small"/>
                            </div>
                            <div className="post-counter">
                                <RepeatIcon fontSize="small"/>
                            </div>
                            <div className="post-counter">
                                <FavoriteTwoToneIcon fontSize="small" className={liked?"liked":"unliked"}/>
                            </div>
                            <PublishIcon fontSize="small" />
                        </div>
                    </div>
                </div> 
            </div>
            <Popup open={showPopup} position="right center" closeOnDocumentClick={false}>
                <div className="tweetBox">
                    <form>
                        <div className="tweetBox-input">
                            <Avatar src={user.avatar}/>
                            <input
                                onChange={(e) => setReply(e.target.value)}
                                value={reply}
                                type="text"
                            />  
                        </div> 
                        <Button className="tweetBox-tweet" onClick={(e)=>sendReplyToRetweet(e)}>Reply</Button>
                    </form>
                </div> 
            </Popup> 
        </div>)}
        </>    
    );
})

export default Post;
