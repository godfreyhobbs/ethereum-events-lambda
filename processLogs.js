"use strict";

const fetch = require("node-fetch");

// For specific linnia function
const simpleHexToAscii = function(hex) {
  var str = "";
  var i = 2 + 64 * 2;
  var l = hex.length;

  for (; i < l; i += 2) {
    var code = parseInt(hex.substr(i, 2), 16);
    if (code > 0) {
      str += String.fromCharCode(code);
    }
  }
  return str;
};

var process = jsonResponse => {
  // For specific linnia function
  for (let i = 0; i < jsonResponse.result.length; i++) {
    let dataHash = jsonResponse.result[i].topics[1];
    let metaData = simpleHexToAscii(jsonResponse.result[i].data);
    console.log(dataHash);
    console.log("[" + metaData + "]");
    // call IRIS Score provider to update score on chain
    fetch(
      "https://3h867xtb9a.execute-api.us-east-1.amazonaws.com/dev2/validateJSON?dataHash=" +
        dataHash,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: metaData
      }
    ).then(response => {
      if (response.ok) {
        return response;
      }
      return Promise.reject(
        new Error(
          `Failed to fetch ${response.url}: ${response.status} ${
            response.statusText
          }`
        )
      );
    });
  }
};

exports.process = process;

process(require("./testJSON.json"));
