const util = require('./util.js');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2'});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'College_Posts';
const moment = require('moment');

exports.handler = async (event) => {
    try {
      let item = JSON.parse(event.body).Item;
      
     

      let data = await dynamodb.put({
        TableName: tableName,
        Item: item,
        ConditionExpression: '#Timestamp = :Timestamp',
        ExpressionAttributeNames: {
            '#Timestamp': 'Timestamp'
        },
        ExpressionAttributeValues: {
            ':Timestamp': item.Timestamp
        }
    }).promise();

      return {
          statusCode: 200,
          headers: util.getResponseHeaders(),
          body: JSON.stringify(item)
      }
    } 
    catch (err) {
      console.log('Error ', err);
      return {
        statusCode: err.statusCode ? err.statusCode : 500,
        headers: util.getResponseHeaders(),
        body: JSON.stringify({
            error: err.name ? err.name : 'Exception',
            message: err.message ? err.message : 'Unknown Error'
        })
        
      };  
    }

}
    
