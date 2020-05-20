import React, { Component } from "react";
import { observer } from "mobx-react";

import Card from "./components/Card";
import TweetStore from "./stores/TweetStore";
import TweetService from "./services/TweetService";

@observer
class App extends Component {
  state = {
    pageIsReady: false
  };

  async componentDidMount() {
    await this.initialiseStores();

    // as I'm loading initialData within CDM
    // wanna make sure tweetStore is fully initialised before interaction
    if (this.state.pageIsReady) {
      this.startTimer();
    }
  }

  async initialiseStores() {
    const tweets = await TweetService.getInitialTweets();
    const tweetStore = new TweetStore(tweets);
    this.tweetStore = tweetStore;
    // allow page to be ready for interaction
    this.setState({ pageIsReady: true });
  }

  startTimer() {
    if (!this.timerId && !this.tweetStore.error) {
      this.timerId = setInterval(() => {
        if (this.tweetStore.error) {
          this.stopTimer();
        }
        this.tweetStore.getTweets();
      }, 2000);
    }
  }

  stopTimer() {
    clearInterval(this.timerId);
  }

  render() {
    return (
      <div className="App">
        {this.tweetStore?.tweets &&
          this.tweetStore?.tweets.map(tweet => (
            <Card key={tweet.id} tweet={tweet} />
          ))}
      </div>
    );
  }
}

export default App;
