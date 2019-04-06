const express = require('express')
const port = 3000


function test_express() {
    let app = express()
    app.get('/', (req, res) => res.send('Hello World!'))
    app.listen(port, () => console.log(`Example app listening on port ${port}`))
}

test_express()