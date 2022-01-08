import React, { memo, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
//
import Banner from './Banner';
import NewTweetForm from './NewTweetForm';
import TweetCard from './TweetCard';
import { useAuth } from '../context/AuthContext';

const Tweets = memo(({ tweetService, username, addable }) => {
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState('');
  const history = useHistory();
  const { user } = useAuth();

  useEffect(() => {
    tweetService
      .getTweets(username)
      .then((tweets) => setTweets([...tweets]))
      .catch(onError);

    const stopSync = tweetService.onSync('message', (message) => {
      if (message.action === 'create') {
        onCreated(message.payload);
      } else if (message.action === 'update') {
        onUpdate(message.payload);
      } else if (message.action === 'delete') {
        onDelete(message.payload);
      }
    });

    return () => {
      stopSync();
    };
  }, [tweetService, username, user, tweets]);

  const onCreated = (tweet) => {
    setTweets((tweets) => [tweet, ...tweets]);
  };

  const onDelete = (tweetId) => {
    setTweets((tweets) => tweets.filter((tweet) => tweet.id !== tweetId));
  };

  const onUpdate = (tweet) => {
    setTweets((tweets) =>
      tweets.map((item) => (item.id === tweet.id ? tweet : item))
    );
  };

  const onUsernameClick = (tweet) => history.push(`/${tweet.username}`);

  const onError = (error) => {
    setError(error.toString());
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  return (
    <>
      {addable && (
        <NewTweetForm
          tweetService={tweetService}
          onError={onError}
          // onCreated={onCreated}
        />
      )}
      {error && <Banner text={error} isAlert={true} transient={true} />}
      {tweets.length === 0 && <p className="tweets-empty">No Tweets Yet</p>}
      <ul className="tweets">
        {tweets.map((tweet, index) => (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            tweetService={tweetService}
            owner={tweet.username === user.username}
            onError={onError}
            onUsernameClick={onUsernameClick}
          />
        ))}
      </ul>
    </>
  );
});

export default Tweets;
