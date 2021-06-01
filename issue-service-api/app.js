const express = require('express');

const AWS = require('aws-sdk');

const aws_config = {
  region: '',
  endpoint: '',
  accessKeyId: '',
  secretAccessKey: ''
}

AWS.config.update(aws_config)
const dynamodb = new AWS.DynamoDB();
const documentClient  = new AWS.DynamoDB.DocumentClient();

const app = express();

app.get('/', (req,res) => {
  res.json({body: 'app is running'})
})

app.get('/issues/:userId', async (req,res) => {
  try {
    var params = {
      ExpressionAttributeValues: {
        ":userName": {
          S: req.params.userId
        }
      },
      FilterExpression: "userName = :userName",
      TableName: 'issues'
    };
    const result = await dynamodb.scan(params).promise()
    res.json({count: result.Items.length})
  } catch (error) {
    console.error(error);
  }
})

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`app is running on PORT ${port}`)
})
