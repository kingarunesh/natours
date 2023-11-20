const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({
    app: 'Natours',
    message: 'Hello, Arunesh',
  });
});

app.post('/', (req, res) => {
  res.send('Post Request');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
