import React, { useEffect, useState } from 'react';
import { Avatar, Button } from '@material-ui/core';
import db from './firebase';



function Tweet(props) {
    const [reply, setReply] = useState('');
    const [replyList, setReplyList] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(()=>{
        db.collection("replies").where("belongTo", "==", props.tweet.id)
        .get()
        .then((querySnapshot) => {
            const allReplies = [];
            querySnapshot.forEach((doc) => {
                allReplies.push(doc.data());
            });
            setReplyList(allReplies);
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }, [refresh]);

    function sendReply(){
        db.collection("replies").add({
            displayName: props.userProfile.displayName,
            verified: props.userProfile.verified,
            text: reply,
            avatar: props.userProfile.avatar, 
            belongTo: props.tweet.id   
            });
        setReply('');
        setRefresh(!refresh);   
    };
    return (
        <div className="post">
            <div className="post-avatar">
                <Avatar src={props.tweet.avatar}/>
            </div>
            <div className="post-body">
                <div className="post-header">
                    <div className="post-header-text">
                        <h3>{props.tweet.displayName}</h3>
                    </div>
                    <div className="post-header-description">
                        <p>{props.tweet.text}</p>
                    </div> 
                </div>
                {props.tweet.image?<img src={props.tweet.image} alt="img" className="post-img"/>:null}
                <div className="post-footer">
                    <div>{new Date(props.tweet.createTime).toLocaleString("en-AU")}</div>
                </div>
                <div className="post-footer">
                    <div className="view-tweetBox">
                        <form>
                            <div className="view-tweetBox-input">
                                <Avatar src={props.userProfile.avatar}/>
                                <input
                                    onChange={(e) => setReply(e.target.value)}
                                    value={reply}
                                    type="text"
                                />  
                            </div> 
                            <Button className="view-tweetBox-tweet" onClick={sendReply}>Reply</Button>
                        </form>
                    </div>
                </div>
                <div className="post-footer">
                    <div>
                    {replyList.map((item)=>{ return (<div className="replies">
                        <Avatar src={item.avatar}/>
                        <div className="replies-text-title">{item.displayName}</div>
                        <div className="replies-text">{item.text}</div>
                    </div>)}
                    )}
                    </div>
                </div>
            </div>   
        </div>
    )
};

export default Tweet;
