import React from 'react';
import Follower from './Follower';

function Follow(props) {
    
    return (
        <div>
            {props.data.map((followerEmail)=>(<Follower key={followerEmail} follower={followerEmail} callback={props.callback} trigger={props.trigger}/>))}
        </div>
    );
};

export default Follow;
