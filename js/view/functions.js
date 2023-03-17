// Funcion para crear cualquier tipo de componente
let createComponent = function(type, className, conteiner, content='', childs = ''){
    let componentContent = document.createElement(type);
    componentContent.className = className;
    if(childs !== '' && content !== ''){
        componentContent.innerHTML = childs + content;
    } else if(childs !== ''){
        componentContent.innerHTML = childs;
    } else if(content !== ''){
        componentContent.innerText = content;
    }
    conteiner.appendChild(componentContent);
    return componentContent;
}

// Funcion para agregar los componentes de un tweet del modelo a un tweet de la vista
let showTweet = function (tweetShowing, tweetDiv) {  
    let profilePicture = document.createElement('img');
    profilePicture.src = tweetShowing.profilePicture;
    tweetDiv.appendChild(profilePicture);

    createComponent('p', 'tweet-owner', tweetDiv, tweetShowing.owner);
    createComponent('p', 'tweet-content', tweetDiv, tweetShowing.content);
    createTweetBtn('retweet-btn', tweetDiv, tweetShowing.retweets, '<svg viewBox="0 0 24 24" aria-hidden="true" class="retweet-icon"><g><path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path></g></svg>', tweetShowing.id);
    createTweetBtn('reply-btn', tweetDiv, tweetShowing.replies.length, '<svg viewBox="0 0 24 24" aria-hidden="true" class="reply-icon"><g><path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path></g></svg>', tweetShowing.id);
    createTweetBtn('like-btn', tweetDiv, tweetShowing.likes, '<svg viewBox="0 0 24 24" aria-hidden="true" class="like-icon"><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path></g></svg>', tweetShowing.id);

}

// Funcion que muestra todos los tweets del modelo
let showTweets = function () {  
    let main = document.getElementsByTagName('main')[0];
    let tweetsSection = document.getElementById('tweets-section');
    let tweetsDiv = document.createElement('div');
    tweetsDiv.id = 'tweets-div';
    let tweets = octopus.getTweets();

    for (let index = 0; index < tweets.length; index++) {
        const element = tweets[index];

        let tweetContent = createComponent('div', 'tweet', tweetsDiv);
        tweetContent.setAttribute('data-tweetid', element.id);

        showTweet(element, tweetContent);
    }

    tweetsSection.appendChild(tweetsDiv);
    main.appendChild(tweetsSection);
}

// Funcion que refresca los tweets despues de correr la funcion changes con los parametros pasados
let renderTweets = function (changes = null, parameters = null) {  
    let tweetsDiv = document.getElementById('tweets-div');
    tweetsDiv.parentElement.removeChild(tweetsDiv);
    if(changes && parameters){
        changes.apply(changes, parameters);
    }
    showTweets();
    createBigTweetListeners();
}

// Crea los botones de cada tweet
let createTweetBtn = function(className, conteiner, content, childs, id = 0){
    let tweetBtn = document.createElement('button');
    tweetBtn.className = className;
    tweetBtn.innerHTML = childs + content;
    let active = octopus.getProfile();
    if(className.includes('like')){
        if(active.likedTweetsIds.has(id)){
            tweetBtn.classList.add('liked');
            likeTweet(tweetBtn, id);
        }
        tweetBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            tweetBtn.classList.toggle('liked');
            likeTweet(tweetBtn, id);
        });
    }
    if(className.includes('retweet')){
        if(active.retweetedTweetsIds.has(id)){
            tweetBtn.classList.add('retweeted');
            retweet(tweetBtn, id);
        }
        tweetBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            tweetBtn.classList.toggle('retweeted'); 
            renderTweets(retweet, [tweetBtn, id, true]);
        });
    }
    if(className.includes('reply')){
        tweetBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            let repling = octopus.getTweetById(id);
            openReplyDialog(repling);
        });
    }
    conteiner.appendChild(tweetBtn);

    return tweetBtn;
}

// Funcion para abrir el popup de las respuestas a los tweets con la informacion correcta
let openReplyDialog = function (repling) {  
    let popup = document.getElementById('replies-popup');
    document.body.style.position = 'fixed';

    let replingTweetDiv = document.getElementById('repling-tweet');
    replingTweetDiv.setAttribute('data-tweetid', repling.id);

    let profilePicture = document.createElement('img');
    profilePicture.src = repling.profilePicture;
    replingTweetDiv.appendChild(profilePicture);

    createComponent('p', 'tweet-owner', replingTweetDiv, repling.owner);
    createComponent('p', 'tweet-content', replingTweetDiv, repling.content);

    let replingSpan = document.getElementById('repling-to');
    replingSpan.innerText = repling.owner;

    popup.showModal();
}

// Funcion que crea las funcionalidades de likes en los tweets
let likeTweet = function (likeBtn, id) {
    let likesNum = likeBtn.innerText;
    let active = octopus.getProfile();
    if(likeBtn.classList.contains('liked')){
        likesNum++;
        likeBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="like-icon-active"><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></path></g></svg>' + likesNum;
        active.likedTweetsIds.add(id);
    }  else {
        likesNum--;
        likeBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="like-icon"><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path></g></svg>' + likesNum;
        active.likedTweetsIds.delete(id);
    }
}

// Funcion que crea las funcionalidades de retweet en los tweets
let retweet = function (retweetBtn, id, clicked=false) {
    let retweetsNum = retweetBtn.innerText;
    let active = octopus.getProfile();
    if(retweetBtn.classList.contains('retweeted')){
        retweetsNum++;
        retweetBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="retweet-icon-active"><g><path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path></g></svg>' + retweetsNum;
        if(clicked){
            active.retweetedTweetsIds.set(id,  octopus.createId());
            octopus.createRetweet(id,  octopus.createId());
        }
    }  else {
        retweetsNum--;
        retweetBtn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" class="retweet-icon"><g><path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path></g></svg>' + retweetsNum;
        if(clicked){
            octopus.removeTweetById(active.retweetedTweetsIds.get(id));
        }
        active.retweetedTweetsIds.delete(id);
    }
}

// Funcion para mostrar en pantalla completa las respuestas de un tweet
let showBigTweetReplies = function (tweetShowing, tweetsReplies) {  
    let repliesDiv = createComponent('div', 'replies-page', tweetsReplies);
    for(let i = 0; i < tweetShowing.replies.length; i++){
        let currentReply = tweetShowing.replies[i];
        let replyDiv = createComponent('div', 'tweet', repliesDiv);
        let profilePicture = document.createElement('img');
        profilePicture.src = currentReply.profilePicture;
        replyDiv.appendChild(profilePicture);
        createComponent('p', 'tweet-owner', replyDiv, currentReply.owner);
        createComponent('p', 'tweet-content', replyDiv, currentReply.content);
        createTweetBtn('like-btn', replyDiv, currentReply.likes, '<svg viewBox="0 0 24 24" aria-hidden="true" class="like-icon"><g><path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path></g></svg>');
    }
}

// Funcion para mostrar en pantalla completa un tweet
let showBigTweet = function (tweetShowing) { 
    let tweetsReplies = document.getElementById('tweet-replies-page');
    let bigTweetDiv = document.querySelector('#tweet-replies-page .tweet');
    showTweet(tweetShowing, bigTweetDiv);
    tweetsReplies.appendChild(bigTweetDiv);
    return tweetsReplies;
}

// Funcion para que los tweets tengan 
let createBigTweetListeners = function () {  
    let tweets = document.getElementsByClassName('tweet');
    for (let i = 0; i < tweets.length; i++) {
        const tweet = tweets[i];
        tweet.addEventListener('click', (event) => {
            let tweetsSection = document.getElementById('tweets-section');
            tweetsSection.classList.add('hidden');
    
            let showingId = parseInt(tweet.getAttribute('data-tweetid'));
            let tweetShowing = octopus.getTweetById(showingId); 
            let tweetsReplies = showBigTweet(tweetShowing);
            tweetsReplies.classList.remove('hidden');
    
            showBigTweetReplies(tweetShowing, tweetsReplies);
        });
    }
}

let tweetFromInput = function (inputTweetBtn) {  
    // Creando la funcion de tweetear para los botones que usen input
    inputTweetBtn.addEventListener('click', () => {
        let inputTweet = inputTweetBtn.previousElementSibling.lastElementChild;
        if (inputTweet.value !== ''){
            renderTweets(createNewTweet, [inputTweet]);
            inputTweet.value = '';
        }
    });
}

// Funcion de apoyo que crea los tweets demendiendo de lo que se escriba en el input
let createNewTweet = function (inputTweetBtn) {  
    let newTweetContent = inputTweetBtn.value;
    let active = octopus.getProfile();
    let newTweet = {
        id : octopus.getTweets().length + 1,
        content: newTweetContent,
        likes: 0,
        replies: [],
        retweets: 0,
        owner: active.name,
        profilePicture: active.profilePhoto
    };
    octopus.addTweet(newTweet);
}

let updateProfile = function (profile) {  
    let banner = document.getElementById('banner-picture');
    banner.src = profile.bannerPhoto; 
    
    let profilePhoto = document.getElementById('profile-picture');
    profilePhoto.src = profile.profilePhoto;

    let name = document.getElementById('name');
    name.innerText = profile.name;

    let userName = document.getElementById('user-name');
    userName.innerText = '@' + profile.userName

    let followInfo = document.getElementsByClassName('follow-ers-num');
    followInfo[0].innerHTML = profile.followers + '<span> Follorers</span>';
    followInfo[1].innerHTML = profile.following + '<span> Following</span>';
}

let showProfilePage = function (clickedBtn, otherBtn, showingTweets) {  
    let tweetsDiv = document.getElementById('profile-tweets');
    clickedBtn.classList.toggle('active-profile-page');
    tweetsDiv.innerHTML = '';
    if(clickedBtn.classList.contains('active-profile-page')){
        showingTweets.forEach((id) => {
            let currTweet = octopus.getTweetById(id);
            let tweetContent = createComponent('div', 'tweet', tweetsDiv);
            tweetContent.setAttribute('data-tweetid', currTweet.id);
            showTweet(currTweet, tweetContent);
        });
        otherBtn.classList.remove('active-profile-page');
    }
}