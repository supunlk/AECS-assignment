const express = require('express');
const AWS = require('aws-sdk');
const request = require('request');

const aws_config = {
  region: '',
  endpoint: '',
  accessKeyId: '',
  secretAccessKey: ''
}

const tables = {
  issues: 'issues',
  pulls: 'pulls',
  commits: 'commits'
}

AWS.config.update(aws_config)
const dynamodb = new AWS.DynamoDB();
const documentClient  = new AWS.DynamoDB.DocumentClient();

const app = express();

app.get('/issues', async (req, res) => {

  request({
    method: 'get',
    uri: 'https://api.github.com/repos/wso2/micro-integrator/issues?per_page=100',
    headers: {
      'User-Agent': 'request'
    }
  }, async (error, response, body) => {
    const data = JSON.parse(response.body);
    data.forEach(issue => {
      const item = {
        url: issue.url,
        id: String(issue.id),
        userId: issue.user.id,
        userName: issue.user.login
      }

      documentClient.put({
        TableName: tables.issues,
        Item: item
      }, (err, data) => {
        if (err) {
          console.error("Can't add issue.", err);
        } else {
          console.log(`Issue ${issue.id} added successfully` );
        }
      }).promise()
    });
    res.send('database updated')
  })


})

app.get('/pulls', (req, res) => {
  request({
    method: 'get',
    uri: 'https://api.github.com/repos/wso2/micro-integrator/pulls?per_page=100',
    headers: {
      'User-Agent': 'request'
    }
  }, async (error, response, body) => {
    const data = JSON.parse(response.body);
    data.forEach(pull => {
      const item = {
        url: pull.url,
        id: String(pull.id),
        userId: pull.user.id,
        userName: pull.user.login
      }

      documentClient.put({
        TableName: tables.pulls,
        Item: item
      }, (err, data) => {
        if (err) {
          console.error("Can't add pull.", err);
        } else {
          console.log(`Pull ${pull.id} added successfully` );
        }
      }).promise()
    });
    res.send('database updated')
  })
})

app.get('/commits', (req, res) => {
  request({
    method: 'get',
    uri: 'https://api.github.com/repos/wso2/micro-integrator/commits?per_page=100',
    headers: {
      'User-Agent': 'request'
    }
  }, async (error, response, body) => {
    const data = JSON.parse(response.body);
    data.forEach(commit => {
      const item = {
        sha: commit.sha,
        userId: commit.author?.id,
        userName: commit.author?.login
      }

      documentClient.put({
        TableName: tables.commits,
        Item: item
      }, (err, data) => {
        if (err) {
          console.error("Can't add pull.", err);
        } else {
          console.log(`commit ${commit.sha} added successfully` );
        }
      }).promise()
    });
    res.send('database updated')
  })
})
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app is running on PORT ${port}`)
})
