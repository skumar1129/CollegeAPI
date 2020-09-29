const util = require('./util.js');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2'});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'College_Posts';

exports.handler = async (event) => {
    try {
      let schoolReg = decodeURIComponent(event.pathParameters.schoolReg);
      let query = event.queryStringParameters;
      let limit = query && query.limit ? parseInt(query.limit) : 5;

      let params = {
        TableName: tableName,
        KeyConditionExpression: "#sch = :school",
        IndexName: "SchoolReg-Rating-index",
        ExpressionAttributeValues: {
          ":school": schoolReg
        },
        ExpressionAttributeNames: {
          "#sch": "SchoolReg"
        },
        Limit: limit,
        ScanIndexForward: false
      };

      let startTimestamp = query && query.start ? parseInt(query.start) : 0;
      let school = query && query.school ? decodeURIComponent(query.school): '';
      let rating = query && query.rating ? parseInt(query.rating) : 0;

      if (startTimestamp > 0) {
        params.ExclusiveStartKey = {
          School: school,
          Timestamp: startTimestamp,
          Rating: rating,
          SchoolReg: schoolReg
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
    
