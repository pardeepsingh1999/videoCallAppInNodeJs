const express = require('express');
const http = require('http');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.Server(app);
const port = 3001 || process.env.PORT;

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

// server start setup
server.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
})