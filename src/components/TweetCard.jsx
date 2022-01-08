import React, { memo, useState } from 'react';
//
import parseDate from '../util/date';
import Avatar from './Avatar';
import EditTweetForm from './EditTweetForm';

const TweetCard = memo(
  ({ tweet, tweetService, owner, onError, onUsernameClick }) => {
    const { id, username, name, url, text, createdAt } = tweet;
    const [editing, setEditing] = useState(false);
    const onClose = () => setEditing(false);
    const onClickUpdate = (id, text) => {
      tweetService.updateTweet(id, text).catch(onError);
    };
    const onClickDelete = (id) => {
      tweetService.deleteTweet(id).catch(onError);
    };

    return (
      <li className="tweet">
        <section className="tweet-container">
          <Avatar url={url} name={name} />
          <div className="tweet-body">
            <span className="tweet-name">{name}</span>
            <span
              className="tweet-username"
              onClick={() => onUsernameClick(tweet)}
            >
              @{username}
            </span>
            <span className="tweet-date"> · {parseDate(createdAt)}</span>
            <p>{text}</p>
            {editing && (
              <EditTweetForm
                tweet={tweet}
                onUpdate={onClickUpdate}
                onClose={onClose}
              />
            )}
          </div>
        </section>
        {owner && (
          <div className="tweet-action">
            <button
              className="tweet-action-btn"
              onClick={(e) => onClickDelete(id)}
            >
              x
            </button>
            <button
              className="tweet-action-btn"
              onClick={() => setEditing(true)}
            >
              ✎
            </button>
          </div>
        )}
      </li>
    );
  }
);

export default TweetCard;
