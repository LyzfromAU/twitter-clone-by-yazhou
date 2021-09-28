import React from 'react';
import './Widget.css';
import {
    TwitterTimelineEmbed,
    TwitterShareButton,
    TwitterTweetEmbed,
} from 'react-twitter-embed';
import SearchIcon from '@material-ui/icons/Search';

function Widget() {
    return (
        <div className="widget">
            <div className="widget-input">
                <SearchIcon className="widget-search-icon" />
                <input placeholder="Search Twitter" type="text" />
            </div>
            <div className="widget-container">
                <h2>What's happenning</h2>
                <TwitterTweetEmbed tweetId={"1422990222891966466"} />
                <TwitterShareButton
                    url={"http://porscheconfig.netlify.app"}
                    options={{text: "react is awesome", via: "HuyaKite"}}
                />
            </div>
        </div>
    );
};

export default Widget;
