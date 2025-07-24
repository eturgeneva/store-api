const { app } = require('./app');
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
});

// /c/Users/Elena/ngrok http --domain aardvark-cool-weasel.ngrok-free.app 3000