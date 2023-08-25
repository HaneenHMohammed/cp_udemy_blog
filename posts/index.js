const express =  require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const eventBusURL = 'http://localhost:4040/events';
const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title, content } = req.body;

    posts[id] = {
        id, title, content
    };

    await axios.post(eventBusURL, { 
        type: "postCreated", 
        data: {
            id, 
            title, 
            content 
        }
    }).catch(error => {
        console.log(error.message);
    });

    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log("Received event: ", req.body);
    const { type, data } = req.body;

    if (type === "postCreated") {
        // do nothing
    }

    res.status(201).send({});
})

app.listen(4000, () => {
    console.log('App listening on port 4000');
})