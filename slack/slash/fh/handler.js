'use strict';

var AWS = require('aws-sdk');
var iot = new AWS.IotData({endpoint: process.env.IOT_ENDPOINT});

module.exports.handler = function(event, context) {

  //Ensure the token's right
  if(event.token !== process.env.SLACK_TOKEN){
    context.done("Invalid slack token.");
  }
  else{

    //Parse a subject line / body from the event text
    var text = event.text.split('|');
    var subject = text.length > 1 ? text[0] : '';
    text = text.length > 1 ? text[1] : text[0];

    //Require body text at least
    if(text === ''){
      context.done('No text found');
    }
    else{

      //Make data to send to IoT
      var data = {
        topic: 'rpi',
        payload: JSON.stringify({
          _event: event,
          ctrl: 'gmail',
          action: 'send',
          body: {
            to: 'request@fhands.com',
            subject: subject,
            text: text
          }
        }),
        qos: 0
      };

      iot.publish(data, function(err, result){
        if(err){
          context.done(null, JSON.stringify({msg: 'iot.publish ERROR!', err: err}, 0, 2));
        }
        else{
          console.log('iot.publish result:', result);
          context.done(null, 'Message sent.');
        }
      });

    }

  }


};
