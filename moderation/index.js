const express =  require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const eventBusURL = 'http://localhost:4040/events';
const prohibitedWords = ["orange", "apple"];

app.get('/moderation', (req, res) => {
    res.send(prohibitedWords);
});

app.post('/events', async (req, res) => {
    console.log("Received event: ", req.body);
    const { type, data } = req.body;

    if ( type === "postCreated" ) {

        // do nothing
    }
    else if ( type === "commentCreated" ) {
        // check new comment
        const status = prohibitedWords.some( word => {
            return data.content.toLowerCase().includes(word);
        })? 'REJECTED' : 'APPROVED';

        setTimeout(async () => {
            await axios.post(eventBusURL, {
                type: "commentModerated",
                data: {
                    id: data.id,
                    status,
                    postId: data.postId,
                    content: data.content
                }
                }).catch(error => {
                    console.log(error.message);
                });
        }, 4000) 
    }
    else if ( type === "commentModerated" ) {
        // do nothing
    }

    res.status(201).send({});
})

app.listen(4008, () => {
    console.log('App listening on port 4008');
})