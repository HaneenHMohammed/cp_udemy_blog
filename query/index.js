const express =  require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const eventBusURL = 'http://localhost:4040/events';
let posts = {};

const handleEvent = (type, data) => {
    if (type === "postCreated") {

        // add a new post
        posts[data.id] = {
            id: data.id, 
            title: data.title,
            content: data.content,
            comments: []
        };
    }
    else if (type === "commentCreated") {
        // add new comment
        posts[data.postId].comments.push({
            id: data.id,
            status: data.status,
            content: data.content
        });
    }
    else if (type === "commentModerated") {
        // do nothing
    }
    else if (type === "commentUpdated") {
        const comment = posts[data.postId].comments.find( comment => {
            return comment.id == data.id;
        });

        comment.status = data.status;
        comment.content = data.content;
        console.log(comment);
    }
}

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    console.log("Received event: ", req.body);
    const { type, data } = req.body;
    handleEvent(type, data);
    res.status(201).send({});
})

app.listen(4006, async() => {
    console.log('App listening on port 4006');

    const res = await axios.get(eventBusURL);
    res.data.forEach(event => {
        handleEvent(event.type, event.data);
    });
})