const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (request, response) =>  response.sendFile(`${__dirname}/trialForm.html`));

app.post('/api/data', (request, response) => {
  const postBody = request.body;
  console.log(postBody);
});

app.listen(3005, () => console.info('Application running on port 3005'));