const util = require('./util.js');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2'});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'City_Posts';

exports.handler = async (event) => {
    try {
      let location = decodeURIComponent(event.pathParameters.location);
      

      let params = {
        TableName: tableName,
        KeyConditionExpression: "#loc = :location",
        IndexName: "Location-Bar-index",
        ExpressionAttributeValues: {
          ":location": location
        },
        ExpressionAttributeNames: {
          "#loc": "Location"
        },
        ProjectionExpression : "Bar",
        ScanIndexForward: true
      };

      

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
    
