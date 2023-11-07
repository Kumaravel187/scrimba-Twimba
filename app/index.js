import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
// console.log(uuidv4()); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

const getFeedHtml = () => {
  let feedHTML = ``;

  tweetsData.forEach((tweet) => {
    let likeIconClass = ``;
    let retweeetIconClass = ``;
    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    if (tweet.isRetweeted) {
      retweeetIconClass = "retweeted";
    }

    let repliesHTML = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach((reply) => {
        repliesHTML += `
        <div class="tweet-reply">
          <div class="tweet-inner">
            <img src="${reply.profilePic}" class="profile-pic">
              <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
              </div>
          </div>
        </div>`;

        // console.log(repliesHTML);
      });
    }

    feedHTML += `
    <div class="tweet">
        <div class="tweet-inner">
            <img src="${tweet.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${tweet.handle}</p>
                <p class="tweet-text">${tweet.tweetText}</p>
                <div class="tweet-details">
                    <span class="tweet-detail">
                        <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}" ></i>
                        <p class="test">${tweet.replies.length}</p>
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                        <p class="test">${tweet.likes}</p>
                    </span>
                    <span class="tweet-detail">
                        <i class="fa-solid fa-retweet ${retweeetIconClass}" data-retweet="${tweet.uuid}"></i>
                        <p class="test">${tweet.retweets}</p>
                    </span>
                </div>   
            </div>            
        </div>
        <div class="hidden" id="replies-${tweet.uuid}">
          ${repliesHTML}
        </div>   
    </div> 
    `;
  });

  return feedHTML;
};

const render = () => {
  const feedContent = document.getElementById("feed");
  feedContent.innerHTML = getFeedHtml();
};

const handleLikeClick = (tweetId) => {
  const targetTweetObj = tweetsData.filter((tweets) => {
    return tweets.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }

  targetTweetObj.isLiked = !targetTweetObj.isLiked;

  render();
};

const handleRetweetClick = (tweetId) => {
  // console.log(tweetId);
  const tweetDataObj = tweetsData.filter((tweet) => {
    return tweet.uuid === tweetId;
  })[0];

  // console.log(tweetDataObj);

  if (tweetDataObj.isRetweeted) {
    tweetDataObj.retweets--;
  } else {
    tweetDataObj.retweets++;
  }

  tweetDataObj.isRetweeted = !tweetDataObj.isRetweeted;

  render();
};

const handleReplyClick = (replyId) => {
  const reply = document
    .getElementById(`replies-${replyId}`)
    .classList.toggle("hidden");
};

const handleTweetBtnClick = () => {
  const tweetInput = document.getElementById("tweet-input");
  if (tweetInput.value) {
    let tweetObj = {
      handle: `@Apunehneh`,
      profilePic: `../images/seyan.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    };

    tweetsData.unshift(tweetObj);

    tweetInput.value = ``;

    render();
  } else {
    window.alert("Please type in a legitimate tweet");
  }
};

render();

document.addEventListener("click", (e) => {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === `tweet-btn`) {
    handleTweetBtnClick();
  }
});
