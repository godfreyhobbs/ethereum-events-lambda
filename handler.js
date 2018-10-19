'use strict';

require('dotenv').load();
const fetch = require('node-fetch');
const uuid = require('node-uuid');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// For specific linnia function
const simpleHexToAscii = function (hex) {
  var str = '';
  var i = 2 + 64 * 2; var l = hex.length;

  for (; i < l; i += 2) {
    var code = parseInt(hex.substr(i, 2), 16);
    str += String.fromCharCode(code);
  }
  return str;
};

exports.fetchEvents = (event, context, callback) => {
  console.log(JSON.stringify(event));
  // TODO: make topic a parameter
  var requestBody = {
    'jsonrpc': '2.0',
    'method': 'eth_getLogs',
    'params': [
      {
        'topics': [
          '0xc43a6d939953ea9a051678d790c075583daddbeddbda07e2226e5a31c9a50af0'
        ],
        'fromBlock': '0x3ff74F'
      }
    ],
    'id': 1
  };

  fetch('https://ropsten.infura.io/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  })
    .then((response) => {
      if (response.ok) {
        return response;
      }
      return Promise.reject(new Error(
        `Failed to fetch ${response.url}: ${response.status} ${response.statusText}`));
    })
    .then(response => response.json())
    .then(jsonRespone => {
      console.log(event.requestContext.requestTimeEpoch);
      console.log('))))))))))))');
      console.log(JSON.stringify(jsonRespone));

      // For specific linnia function
      for (let i = 0; i < jsonRespone.result.length; i++) {
        console.log(jsonRespone.result[i].topics[1])
        console.log(simpleHexToAscii(jsonRespone.result[i].data));
      }

      let putParams = {
        Bucket: process.env.BUCKET_ID,
        Key: uuid.v1(),
        Body: JSON.stringify(jsonRespone)
      };
      console.log(JSON.stringify(putParams));
      return s3.putObject(putParams).promise()
    })
    .then(v => callback(null, v), callback);
};
