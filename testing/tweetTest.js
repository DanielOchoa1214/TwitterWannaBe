describe('Tweet System', function () {
    let newTweet;

    beforeEach(function(){
        newTweet = {
            id : 4,
            content: "Hello",
            likes: 60,
            replies: [],
            retweets: 37,
            owner: "Porky",
            profilePicture: "../resourses/Doggo-profile.jpg"
        };
    });

    it('should create a diferent new ID', function () {  
        expect(octopus.createId()).toBe(4);
    });

    it('should retieve the correct Tweet seaching by its ID', function () {  
        expect(octopus.getTweetById(1)).toBe(tweetsInfo[0]);
        expect(octopus.getTweetById(2)).toBe(tweetsInfo[1]);
        expect(octopus.getTweetById(3)).toBe(tweetsInfo[2]);
    });

    it('should add a new tweet', function () {  
        octopus.addTweet(newTweet);
        expect(tweetsInfo[3]).toBe(newTweet);
    });

    it('should remove a tweet', function () {  
        octopus.removeTweetById(4);
        expect(octopus.getTweetById(4)).toBe(undefined);
        expect(octopus.getTweetsNum()).toBe(3);
    });

    it('should add initial retweets', function () { 
        expect(octopus.getProfile().tweets.length).toBe(0);
        octopus.addRetweets();
        expect(octopus.getProfile().tweets.length).toBe(1);
        expect(octopus.getProfile().retweetedTweetsIds.size).toBe(1);
        expect(octopus.getProfile().retweetedTweetsIds.keys().next().value).toBe(3);
        expect(octopus.getProfile().retweetedTweetsIds.get(3)).toBe(4);
    });

    it('should create retweets', function () {  
        octopus.createRetweet(1, 5);
        expect(tweetsInfo.length).toBe(5);
        expect(tweetsInfo[4].id).toBe(5);
        expect(tweetsInfo[4].content).toBe('Dano retweeted from Lord Petrosky: Sup');
        expect(tweetsInfo[4].likes).toBe(0);
        expect(tweetsInfo[4].replies.length).toBe(0);
        expect(tweetsInfo[4].retweets).toBe(0);
        expect(tweetsInfo[4].owner).toBe('Dano');
        expect(tweetsInfo[4].profilePicture).toBe(octopus.getProfile().profilePhoto);
    });

    it('should reply a given tweet', function () {  
        octopus.addReply(1, 'Hola');
        expect(tweetsInfo[0].replies[2].content).toBe('Hola');
        expect(tweetsInfo[0].replies[2].likes).toBe(0);
        expect(tweetsInfo[0].replies[2].owner).toBe('Dano');
        expect(tweetsInfo[0].replies[2].profilePicture).toBe(octopus.getProfile().profilePhoto);
    });
});

describe('Profiles System', function () {

    beforeEach(function(){
        
    });

    it('should validate the login values', function () {  
        expect(octopus.validateLogin('danielochoa1412', 'AA')).not.toBe(true);
        expect(octopus.validateLogin('brian.fajardo', 'BB')).not.toBe(true);
        expect(octopus.validateLogin('brian.fajardo', 'BAAB')).toBe(false);
        expect(octopus.validateLogin('brian.skmvksjnvjs', 'BAAB')).toBe(false);
        expect(octopus.validateLogin('lkandlkamsdkasASDSDFGH', 'AAASDFG')).not.toBe(true);
    });

    it('should change the current active profile', function () {  
        let currProfile = {
            ...activeProfile
        };
        expect(octopus.getProfile()).toBe(activeProfile);
        let newP = {};
        octopus.setActiveProfile(newP);
        expect(octopus.getProfile()).toBe(newP);
        expect(octopus.getProfile()).not.toBe(currProfile);
        octopus.setActiveProfile(currProfile);
        expect(octopus.getProfile()).toBe(currProfile);
        expect(octopus.getProfile()).not.toBe(newP);
    });

    it('should save every change in the active profile to the profiles data base', function () {  
        expect(profiles[0]).not.toBe(activeProfile);
        octopus.saveProfileChanges();
        expect(profiles[0]).toBe(activeProfile);
        activeProfile.bannerPhoto = '';
        octopus.saveProfileChanges();
        expect(profiles[0].bannerPhoto).toBe(activeProfile.bannerPhoto);
        expect(profiles[0]).not.toBe({});
    });
});