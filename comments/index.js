const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const eventBusURL = 'http://localhost:4040/events';
const comments = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(comments[req.params.id] || []);
});

app.post('/posts/:id/comments', async(req, res) => {
    const postId = req.params.id;
    const { content } = req.body;
    const status = "PENDING";
    const id = randomBytes(6).toString('hex');
    console.log(req.body);

    const commentsOfPost = comments[postId] || [];
    commentsOfPost.push({id, status, content});
    comments[postId] = commentsOfPost;

    await axios.post(eventBusURL, {
        type: "commentCreated", 
        data: {
            id,
            postId,
            status,
            content
        }
    }).catch(error => {
        console.log(error.message);
    });
    
    res.status(201).send(commentsOfPost);
});


app.post('/events', async (req, res) => {
    console.log("Received event: ", req.body);
    const { type, data } = req.body; 

    if (type === "postCreated") {
        // do nothing
    }
    else if (type === "commentCreated") {
        // do nothing
    }
    else if (type === "commentModerated") {
        const comment = comments[data.postId].find(comment => {
            return comment.id === data.id;
        });
        comment.status = data.status;
        console.log(comment);
        await axios.post(eventBusURL, {
            type: "commentUpdated",
            data
        }).catch( error => {
            console.log(error.message);
        })
    }

    res.status(201).send({});
})

app.listen(4002, () => {
    console.log('App listening on port 4002');
})