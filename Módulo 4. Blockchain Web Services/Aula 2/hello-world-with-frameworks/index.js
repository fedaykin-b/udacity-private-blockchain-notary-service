'use strict';

const express = require('express')
const hapi = require('hapi');

const port = 3000


function test_express() {
    let app = express()
    app.get('/', (req, res) => res.send('Hello World!'))
    app.listen(port, () => console.log(`Example app listening on port ${port}`))
}

function test_hapi() {
    let server = hapi.Server({
        host: 'localhost',
        port: port
    })
    server.route({
        method: 'GET',
        path: '/hello',
        handler: function (request, h) {
            return 'hello world!'
        }
    })
    async function start() {
        try {
            await server.start();
        }
        catch (err) {
            console.log(err);
            process.exit(1);
        }
    };
    start();
}

test_hapi()