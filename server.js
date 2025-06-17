const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) => {
    res.json({ description: 'e-commerce REST API using Express, Node.js, and Postgres' });
})



app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
})