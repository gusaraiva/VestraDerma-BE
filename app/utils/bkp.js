'use strict'

const schedule = require('node-schedule');


function  job() {  
  
  schedule.scheduleJob('* * 6,17 ? * * *', function(){
    console.log('start Job de Bckp ');
  });
}
module.exports = { job }