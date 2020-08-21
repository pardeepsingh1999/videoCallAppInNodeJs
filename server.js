const express = require('express');
const http = require('http');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const socketio = require('socket.io');
const { ExpressPeerServer } = require('peer');

const app = express();
const server = http.Server(app);
const io = socketio(server);

const peerServer = ExpressPeerServer(server, {
    debug: true
});

// port setup
const port = 3001 || process.env.PORT;

// webrtc peer setup
app.use('/peerjs', peerServer);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// public folter setup
app.use(express.static( path.join(__dirname, 'public') ));

//============= routes methods start =============//

app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`)
});

app.get('/:roomId', (req, res) => {
    res.render('room', {
        roomId: req.params.roomId
    })
});

//============= route end =============//

//========================================//

//============= socket io start =============//

io.on('connection', socket => {

    socket.on('join-room', (roomId, userId) => {
        // console.log(roomId,userId)
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
    })

});

//============= socket io end =============//


// server start setup
server.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
})