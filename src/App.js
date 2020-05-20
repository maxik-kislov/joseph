import React, { Component } from "react";
import { observer } from "mobx-react";
import debounce from "lodash/debounce";

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
      // const debounced = debounce(this.getUserPosition, 1000);
      // debounced();
      window.addEventListener("scroll", () => {
        console.log(window);
        // positon bottom of page do x
        if (window.scrollY === 0) {
          this.startTimer();
        }

        // top of page do y
      });
    }
  }

  // getUserPosition() {
  //   window.addEventListener("scroll", this.startTimer);

  //   // positon bottom of page do x

  //   // top of page do y
  // }

  async initialiseStores() {
    const tweets = await TweetService.getInitialTweets();
    const tweetStore = new TweetStore(tweets);
    this.tweetStore = tweetStore;
    // allow page to be ready for interaction
    this.setState({ pageIsReady: true });
    // this.tweetStore.getOldTweets();
  }

  startTimer = () => {
    if (!this.timerId && !this.tweetStore.error) {
      this.timerId = setTimeout(() => {
        if (this.tweetStore.error) {
          this.stopTimer();
        }
        this.tweetStore.getTweets();
      }, 2000);
    }
  };

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
