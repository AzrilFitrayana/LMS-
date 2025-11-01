const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello BE');
});

app.listen(port, () => {
    console.log(`BE server running at http://localhost:${port}`);
});