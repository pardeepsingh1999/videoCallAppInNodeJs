
const socket = io('/');
let url = 'http://localhost:3001'
socket.connect(url, { transports: ['websocket'] });

const videoGrid = document.getElementById('video-grid');

const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(); 

let myVideoStream;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

if (navigator.getUserMedia) {
    // Request the camera.
    navigator.getUserMedia({
        video: true,
        audio: true
    }, (stream) => {
        myVideoStream = stream;
        console.log(stream)
        addVideoStream(myVideo, stream);

        socket.on('user-connected', (userId) => {
            connectToNewUser(userId, stream);
        });

    })
} else {
    alert('Sorry, your browser does not support getUserMedia');
}

let userId;

peer.on('open', id => {
    userId = id;
    socket.emit('join-room', ROOM_ID, id);
});

peer.on('call', call => {
    call.answer(myVideoStream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
})


const connectToNewUser = (userId, stream) => {
    // console.log('new user',userId)
    const call = peer.call(userId, stream)
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
};

const addVideoStream = (video, stream) => {
    try {
        video.srcObject = stream;
    } catch(err) {
        video.src = window.URL.createObjectURL(stream)
    }
    video.addEventListener('loadedmetadata', () => {
        video.play()
    });
    videoGrid.append(video);
};


let text = $('input')

$('html').keydown( (e) => {
    if(e.which == 13 && text.val().length !== 0) {
        socket.emit('message', userId, text.val());
        text.val('')
    }
});

socket.on('createMessage', (userId, message) => {
    console.log('server server')
    $('ul.messages').append(`<li class="message"><b>${userId}</b><br/>${message}</li>`);
    scrollToBottom();
});

const scrollToBottom = () => {
    let d = $('.main__chat__window');
    d.scrollTop(d.prop('scrollHeight'))
};

// Mute our video
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
};

const setUnmuteButton = () => {
    const html = `
        <i class="unmute fas fa-microphone-slash"></i>
        <span>Unmute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
};

const setMuteButton = () => {
    const html = `
        <i class="fas fa-microphone"></i>
        <span>Mute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
};

// stop our video
const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayButton();
    } else {
        setStopButton();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
};

const setPlayButton = () => {
    const html = `
        <i class="stop fas fas fa-video-slash"></i>
        <span>Play Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
};

const setStopButton = () => {
    const html = `
        <i class="fas fas fa-video"></i>
        <span>Stop Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
};