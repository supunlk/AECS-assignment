const express = require('express');
const axios = require('axios');

const app = express();

app.get('/', (req,res) => {
  res.send('test');
  console.log('test')
})

app.get('/productivity/:userId', (req,res) => {

  const issue_service_url = `http://issues-service:3001/issues/${req.params.userId}`;
  const pulls_service_url = `http://pulls-service:3002/pulls/${req.params.userId}`;
  const comments_service_url = `http://commits-service:3003/commits/${req.params.userId}`;

  const issues_req = axios.get(issue_service_url);
  const pulls_req = axios.get(pulls_service_url);
  const commits_req = axios.get(comments_service_url);

  axios.all([issues_req, pulls_req, commits_req]).then(axios.spread((...response) => {
    const totalDataCount = 100;
    res.json({
      Commits: (response[2].data.count / totalDataCount) * 100 + '%',
      Issues: (response[1].data.count / totalDataCount) * 100 + '%',
      Pulls: (response[0].data.count / totalDataCount) * 100 + '%'
    });
  })).catch(err => res.status(400).send(err))

})

const port = process.env.PORT || 3004;

app.listen(port, () => {
  console.log(`app is running on PORT ${port}`)
})
