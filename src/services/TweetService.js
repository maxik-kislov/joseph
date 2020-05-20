import axios from "axios";

// is CORS truty enabled ? - the below doesn't work.
// const URL = "http://magiclab-twitter-interview.herokuapp.com/jozef-bartanus";

// workarounds ----
//first -> your own generic candidate
const URL = "https://magiclab-twitter-interview.herokuapp.com/candidate-name";

// second
// having to use this -> it's limited to 200 calls an hour.
// const URL =
//   "https://cors-anywhere.herokuapp.com/http://magiclab-twitter-interview.herokuapp.com/jozef-bartanus";

// choose whichever url from the the workarounds
/**
 * @param {string} url
 * @param {number} n
 */
export const getData = async (url, n) => {
  try {
    const { data } = await axios({
      method: "get",
      url
    });
    return data;
  } catch (e) {
    if (n === 1) {
      return console.log(e);
    }
    // recursively calling data
    return await getData(url, n - 1);
  }
};

export async function getInitialTweets() {
  const data = getData(`${URL}/api?count=5`, 5);
  return data;
}

/**
 * @param {number} id
 */
export async function fetchNewTweet(id) {
  // get the next ID directly
  // fucntion doesn't have to be called recusrsively in getData
  // if it fails -> tweetstore will not overwrite the last checked tweet
  // so it will be recalled
  let data = await getData(`${URL}/api?count=1&id=${id}&direction=1`, 1);
  let correctTweet;

  if (data) {
    correctTweet = data.filter(tweet => tweet.id === id + 1);
  }

  if (!correctTweet) {
    return null;
  } else {
    return correctTweet;
  }
}

export default {
  getInitialTweets,
  fetchNewTweet
};
