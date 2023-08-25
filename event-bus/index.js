const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const services = [
    'http://localhost:4000/events',
    'http://localhost:4002/events',
    'http://localhost:4006/events',
    'http://localhost:4008/events'
];

const app = express();
app.use(bodyParser.json());

const events = [];
let counter = 0;


app.get('/events', (req, res) => {
    res.status(201).send(events);
})

app.get('/events/:order', (req, res) => {
    res.status(201).send(events.slice(req.params.order));
})

app.post('/events', (req, res) => {
    let event = req.body;
    console.log("Received event: ", event.type);

    event['order'] = counter++;
    events.push(event);

    services.map(service => {
        axios.post(service, event ).catch((error) => {
            console.log(error.message);
        });
        console.log("Dispatched event to : ", service);
    })
    res.status(201);
})

app.listen(4040, () => {
    console.log("App listening on port 4040");
})