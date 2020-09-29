const util = require('./util.js');
const moment = require('moment');
const uuid = require('uuid/v4');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2'});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'City_Posts';

exports.handler = async (event) => {
    try {
      let item = JSON.parse(event.body).Item;
      item.Username = decodeURIComponent(event.pathParameters.username);;
      item.Timestamp = moment().unix();
      item.Id = item.Username + ':' + uuid();

      let data = await dynamodb.put({
        TableName: tableName,
        Item: item
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
    
