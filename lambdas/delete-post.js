const util = require('./util.js');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2'});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'City_Posts';

exports.handler = async (event) => {
    try {
      let loc = decodeURIComponent(event.pathParameters.location);
      let postTs = parseInt(event.pathParameters.timestamp);
      let params = {
        TableName: tableName,
        Key: {
          Location: loc,
          Timestamp: postTs
        }
      };

      let data = await dynamodb.delete(params).promise();

      return {
          statusCode: 200,
          headers: util.getResponseHeaders()
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
    
