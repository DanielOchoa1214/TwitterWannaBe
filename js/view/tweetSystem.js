octopus.init();

let inputTweetBtn = document.getElementsByClassName('main-tweet-btn')[0];
tweetFromInput(inputTweetBtn);

// Creando la funcionalidad del boton de devolverse de la pagina grandre de los tweets y respuestas
let backToHomePageBtn = document.getElementsByClassName('home-button')[0];
backToHomePageBtn.addEventListener('click', () => {
    let tweetRepliesPage = document.getElementById('tweet-replies-page');
    tweetRepliesPage.classList.add('hidden');
    tweetRepliesPage.removeChild(document.getElementsByClassName('replies-page')[0]);
    tweetRepliesPage.lastElementChild.innerHTML = '';
    renderTweets();
    document.getElementById('tweets-section').classList.remove('hidden');
});

// Creando la funcionalidad del boton de tweetead del lado de la pantalla
let sideTweetBtn = document.getElementsByClassName('side-tweet-btn')[0];
sideTweetBtn.addEventListener('click', () => {
    let popup = document.getElementById('tweeting-popup');
    document.body.style.position = 'fixed';
    popup.showModal();
});

// Agregando el listener al boton de salir del popup de tweetear
let exitPopUp = document.getElementsByClassName('exit-btn')[0];
exitPopUp.addEventListener('click', () => {
    let popup = document.getElementById('tweeting-popup');
    document.body.style.position = 'initial';
    popup.close();
});

// Agtregando el listener al boton de salir del popup de responder a tweets
let exitReplyPopUp = document.getElementsByClassName('exit-btn')[1];
exitReplyPopUp.addEventListener('click', () => {
    let popup = document.getElementById('replies-popup');
    document.body.style.position = 'initial';

    let replingTweet = document.getElementById('repling-tweet');
    replingTweet.innerHTML = '';

    let replingToSpan = document.getElementById('repling-to');
    replingToSpan.innerHTML = '';

    popup.close();
});

// Creando la funcion de tweetear al boton del popup
let tweetBtnPopUp = document.getElementsByClassName('popup-tweet-btn')[0];
tweetFromInput(tweetBtnPopUp);
tweetBtnPopUp.addEventListener('click', () => {
    let popup = document.getElementById('tweeting-popup');
    document.body.style.position = 'absolute';
    popup.close();
});

// Agregando el listener al boton de respondder a los tweets
let replyBtn = document.getElementsByClassName('reply-tweet-btn')[0];
replyBtn.addEventListener('click', () => {
    let replingId = parseInt(document.getElementById('repling-tweet').getAttribute('data-tweetid'));
    let replyContent = document.getElementsByClassName('tweet-writing-input')[1].value;
    document.getElementsByClassName('tweet-writing-input')[1].value = '';
    exitReplyPopUp.click();
    renderTweets(octopus.addReply, [replingId, replyContent]);
});

// Creando los listeners de los botnes de la seccion de configuracion de la pagina
let sideBtns = document.getElementsByClassName('side-bar-btn');
for(let i = 0; i < sideBtns.length; i++){
    let sideBtn = sideBtns[i];
    if(i === 1){
        sideBtn.addEventListener('click', () => {
            document.getElementById('tweets-section').classList.add('hidden');
            document.getElementById('profile-section').classList.remove('hidden');
        });
    } else {
        sideBtn.addEventListener('click', () => {
            document.getElementById('tweets-section').classList.remove('hidden');
            document.getElementById('profile-section').classList.add('hidden');
            let tweetsDiv = document.getElementById('profile-tweets');
            tweetsDiv.innerHTML = '';
            tweetsProfileBtn.classList.remove('active-profile-page');
            likedTweetsProfileBtn.classList.remove('active-profile-page');
        });
    }
}

// Usando el perfil activo para ver el perfil de la vista
let profile = octopus.getProfile();
updateProfile(profile);

// Agregando los listeners a los botones del perfil
let tweetsProfileBtn = document.getElementById('my-tweets');
let likedTweetsProfileBtn = document.getElementById('my-liked-tweets');

// Listener del boton Tweets
tweetsProfileBtn.addEventListener('click', () => {
    let profile = octopus.getProfile();
    showProfilePage(tweetsProfileBtn, likedTweetsProfileBtn, profile.tweets);
});

// Listener del boton "Liked"
likedTweetsProfileBtn.addEventListener('click', () => {
    let profile = octopus.getProfile();
    showProfilePage(likedTweetsProfileBtn, tweetsProfileBtn, profile.likedTweetsIds);
});

// Listener del boton de cerrar sesion
let closeSesion = document.getElementsByClassName('close-sesion-btn')[0];
closeSesion.addEventListener('click', () => {
    document.getElementById('config-section').classList.add('hidden');
    document.getElementById('tweets-section').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    octopus.saveProfileChanges();
});

let form = document.getElementsByTagName('form')[0];
form.addEventListener('submit', (event) => {
    event.preventDefault();
    let user = document.getElementsByClassName('login-input')[0].value;
    let password = document.getElementsByClassName('login-input')[1].value;
    let validate = octopus.validateLogin(user, password);
    if (validate) {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('config-section').classList.remove('hidden');
        document.getElementById('tweets-section').classList.remove('hidden');
        document.getElementById('error-msg').style.visibility = 'hidden';
        octopus.setActiveProfile(validate);
        octopus.addRetweets();
        updateProfile(validate);
        renderTweets();
    } else {
        document.getElementById('error-msg').style.visibility = 'visible';
    }
    document.getElementsByClassName('login-input')[1].value = '';
});