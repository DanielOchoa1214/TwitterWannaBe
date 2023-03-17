let octopus = {
    init : function () {
        showTweets();
        createBigTweetListeners();
    },
    createId : function () { 
        return tweetsInfo[tweetsInfo.length - 1].id + 1;
    },
    getTweets : function () {
        return tweetsInfo;
    },
    getTweetsNum : function () {  
        return tweetsInfo.length;
    },
    getProfile : function () {
        return activeProfile;
    },
    getTweetById : function (id) {
        for (let i = 0; i < tweetsInfo.length; i++){
            if(tweetsInfo[i].id === id){
                return tweetsInfo[i]
            }
        }
    },
    addTweet : function (newTweet) {
        tweetsInfo.push(newTweet);
        activeProfile.tweets.push(newTweet.id);
    },
    removeTweetById : function (id) {
        for (let i = 0; i < tweetsInfo.length; i++){
            if(tweetsInfo[i].id === id){
                tweetsInfo.splice(i, 1);
                activeProfile.tweets = activeProfile.tweets.filter((val) => {val !== id});
                activeProfile.likedTweetsIds.delete(id);
                return;
            }
        }
    },
    addRetweets : function(){
        activeProfile.retweetedTweetsIds.forEach((retweetedId, originId) => {
            this.createRetweet(originId, retweetedId);
        });
    },
    createRetweet : function (originId, retweetedId) {
        let retweeting = tweetsInfo[originId - 1];
        let newTweet = {
            id : retweetedId,
            content: `${activeProfile.name} retweeted from ${retweeting.owner}: ${retweeting.content}`,
            likes: 0,
            replies: [],
            retweets: 0,
            owner: activeProfile.name,
            profilePicture: activeProfile.profilePhoto
        };
        this.addTweet(newTweet);
    },
    addReply : function (replingId, replyContent) {  
        let repling = octopus.getTweetById(replingId);
        let reply = {
            content: replyContent,
            likes: 0,
            owner: activeProfile.name,
            profilePicture: activeProfile.profilePhoto
        }
        repling.replies.push(reply);
    },
    validateLogin : function (user, password) {  
        for (let i = 0; i < profiles.length; i++) {
            const profile = profiles[i];
            if(profile.userName === user && profile.password === password){
                return profile;
            }
        }
        return false;
    },
    setActiveProfile : function (newProfile) {  
        activeProfile = newProfile;
    },
    saveProfileChanges : function () {  
        let i = 0;
        while (activeProfile.userName !== profiles[i].userName) {
            i++;
        }
        profiles[i] = activeProfile;
    }
}