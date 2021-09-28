import React, { useEffect, useState } from 'react';
import './Feed.css';
import Post from './Post';
import TweetBox from './TweetBox';
import db from './firebase';
import FlipMove from 'react-flip-move';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { removeUser } from './actions/removeUser';
import UserProfile from './UserProfile';
import Tweet from './Tweet';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { putbackView } from './actions/putbackView';


function Feed() {

    const [posts, setPosts] = useState([]);
    const user = useSelector(state=>state.user);
    const view = useSelector(state=>state.view);
    const dispatch = useDispatch();
    const [userProfile, setUserProfile] = useState({
        avatar: null,
        displayName: "",
        email: "",
        verified: false,
        followings: [],
        followers: [],
        joinTime:56
    });
    const [viewProfile, setViewProfile] = useState(false);
    const [viewTweet, setViewTweet] = useState(false);
    const [tweetContent, setTweetContent] = useState({
        avatar: null,
        image: null,
        text: '',
        displayName: ''
    });

    useEffect(()=>{
        db.collection('posts').orderBy("createTime", "desc").onSnapshot(snapshot => (setPosts(snapshot.docs.map(doc=>({...doc.data(), id: doc.id})))));
        db.collection("users").where("email", "==", user.email)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                setUserProfile(doc.data());
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }, [user]);

    function signout(){
        dispatch(removeUser());
        setViewProfile(false);
        setUserProfile({
            avatar: null,
            displayName: "",
            email: "",
            verified: false,
            followings: [],
            followers: [],
            joinTime:56
        });
        localStorage.removeItem('twitter-clone-user-email');
        localStorage.removeItem('twitter-clone-user-id');
        localStorage.removeItem('twitter-clone-user-status');
    };
    return (
        <div className="feed">
            <div className="feed-header">
                {(!viewProfile)&&(!viewTweet)&&(view.view==='home')?<h2>Home</h2>:<ArrowBackIcon className="back-icon" onClick={()=>{
                    setViewProfile(false);
                    setViewTweet(false);
                    dispatch(putbackView());
                }}/>}
                {!user.isLoggedIn?<Link to="/signin" className="signin">Sign In</Link>:(<div className="signout">
                    <h2 className="username" onClick={()=>{setViewProfile(true); dispatch(putbackView());}}>{userProfile.displayName}</h2>
                    <div className="signout-icon" onClick={signout}>
                        <ExitToAppIcon />
                    </div>
                </div>)}
            </div>
            {(!viewProfile)&&(!viewTweet)&&(view.view==='home')?<><TweetBox userProfile={userProfile}/>
            <FlipMove>
                {posts.map((post)=>(<div onClick={()=>{
                    if(post.isRetweet){
                        setTweetContent({
                            avatar: post.avatar,
                            image: post.image,
                            text: post.text,
                            displayName: post.displayName,
                            id: post.originalTweetId,
                            createTime: post.createTime
                        });
                    }else{
                        setTweetContent({
                            avatar: post.avatar,
                            image: post.image,
                            text: post.text,
                            displayName: post.displayName,
                            id: post.id,
                            createTime: post.createTime
                        });
                    }
                    setViewTweet(true);
                }}><Post 
                key={post.id}
                displayName={post.displayName}
                verified={post.verified}
                text={post.text}
                avatar={post.avatar}
                image={post.image}
                userProfile={userProfile}
                id={post.id}
                isRetweet={post.isRetweet}
                retweeterAvatar={post.retweeterAvatar}
                retweeterDisplayName={post.retweeterDisplayName}
                originalTweetId={post.originalTweetId}
                likes={post.likes}
                retweets={post.retweets}
                userNotFromReducer={post.user}
                retweetUser={post.retweetUser}
                originalTweetUser={post.originalTweetUser}
                createTime={post.createTime}
                retweeterVerified={post.retweeterVerified}
                /></div>))} 
            </FlipMove></>:null}
            {viewProfile?<UserProfile email={user.email} isUser={true}/>:null}
            {view.view==='profile'?<UserProfile email={view.profileToView} isUser={view.profileToView===user.email}/>:null}
            {viewTweet?<Tweet tweet={tweetContent} userProfile={userProfile}/>:null}
            <div className="feed-bottom-bar">
                <HomeIcon />
                <SearchIcon />
                <NotificationsNoneIcon />
                <MailOutlineIcon />
            </div>       
        </div>
        
    )
}

export default Feed;
