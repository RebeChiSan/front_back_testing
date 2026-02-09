
const express = require("express");
const cors = require('cors');
const loginRouter = require("./src/login");
const webhookRouter = require("./src/webhooks");
const errorRouter = require("./src/errors");

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/auth', loginRouter);
app.use('/api/service', webhookRouter);
app.use('/api/mock', errorRouter);


app.get('/', (req, res) => {
    res.send('{"message": "API is running"}');
})

const PORT = 3000;
app.listen(PORT, () => console.log(`Serve at http://localhost:${PORT}`));

module.exports = app;
