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

app.get('/commits/:userId', async (req,res) => {
  try {
    var params = {
      ExpressionAttributeValues: {
        ":userName": {
          S: req.params.userId
        }
      },
      FilterExpression: "userName = :userName",
      TableName: 'commits'
    };
    const result = await dynamodb.scan(params).promise()
    res.json({count: result.Items.length})
  } catch (error) {
    console.error(error);
  }
})

const port = process.env.PORT || 3003;

app.listen(port, () => {
  console.log(`app is running on PORT ${port}`)
})
