const util = require('./util.js');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2'});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'City_Posts';

exports.handler = async (event) => {
    try {
      let username = decodeURIComponent(event.pathParameters.username);
      let query = event.queryStringParameters;
      let limit = query && query.limit ? parseInt(query.limit) : 5;

      let params = {
        TableName: tableName,
        IndexName: "Username-Timestamp-index",
        KeyConditionExpression: "Username = :un",
        ExpressionAttributeValues: {
          ":un": username
        },
        Limit: limit,
        ScanIndexForward: false
      };

      let startTimestamp = query && query.start ? parseInt(query.start) : 0;
      let location = query && query.location ? decodeURIComponent(query.location) : '';

      if (startTimestamp > 0) {
        params.ExclusiveStartKey = {
          Location: location,
          Timestamp: startTimestamp,
          Username: username
        }
      }
      
      let data = await dynamodb.query(params).promise();

      return {
          statusCode: 200,
          headers: util.getResponseHeaders(),
          body: JSON.stringify(data)
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
    
