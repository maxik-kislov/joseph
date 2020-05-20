import { observable, action } from "mobx";

import { checkMissingKeys } from "../utils/checkMissingKeys";
import TweetService from "../services/TweetService";

export class TweetStore {
  @observable tweets = [];

  @observable lastTweetId = null;

  @observable error = false;

  constructor(tweets) {
    // should the initial call of Tweets be missing ID's
    const missingTweets = checkMissingKeys(tweets);

    if (missingTweets.length) {
      this.fetchMissingTweets(missingTweets);
    } else {
      this.tweets = tweets;
    }
  }

  // Uses LastTweetID as basis
  @action async getTweets() {
    if (!this.lastTweetId && !!this.tweets) {
      // re-order to get last ID (only on initial load)
      const order = this.tweets.sort((a, b) => b.id - a.id);
      this.lastTweetId = order[0]["id"];
    }

    const latestTweet = await TweetService.fetchNewTweet(this.lastTweetId);

    // helper to ensure order is correct
    if (latestTweet) {
      await this.sanitizeTweets(latestTweet);
    }
  }

  /**
   * @param {object} lastTweet - e.g. { id: 5, title: 'hello world' } etc...
   */
  async sanitizeTweets(lastTweet) {
    // returns and array of objects - e.g [{ id: 5, diff: 3}]
    const missingTweets = checkMissingKeys([...this.tweets, lastTweet]);

    if (missingTweets.length) {
      await this.fetchMissingTweets(missingTweets);
    }

    // handling latest tweet call is the same as the last one
    if (lastTweet.id === this.lastTweetId) {
      this.setError(true);
      const skipToLatest = await TweetService.fetchNewTweet(this.lastTweetId);

      this.tweets.unshift(...skipToLatest);
      this.lastTweetId = skipToLatest.id;
      this.setError(false);
    }

    // if all is well.
    this.tweets.unshift(...lastTweet);
    this.lastTweetId = lastTweet.id;
  }

  /**
   * @param {array} missedTweets - e.g [6, 9, 12] tweetId's
   */
  @action async fetchMissingTweets(missedTweets) {
    // pause fetching by setting error state
    this.setError(true);

    // creating an ID's array to get min/max vals
    const getIds = missedTweets.map(tweet => tweet.id);
    const max = Math.max.apply(null, getIds);
    const min = Math.min.apply(null, getIds);

    // purely getting this for the diff
    const minDiff = missedTweets.filter(tweet => tweet.id === min);

    // min +1 as the min will always be the last correct tweet
    for (let i = min + 1 - minDiff[0].diff; i < max; i++) {
      const newTweet = await TweetService.fetchNewTweet(i);
      this.tweets.push(newTweet);
    }

    // highest possible lastId
    this.tweets.lastTweetId = max;
    // restart fetching
    this.setError(false);
  }

  /**
   * @param {bool} condition - e.g true/false
   */
  @action setError(condition) {
    this.error = condition;
  }
}

export default TweetStore;
