'use strict'

const schedule = require('node-schedule');

class Bckp {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'Bckp-job'
  }

  // This is where the work is done.
  async handle (data) {
    console.log('Bckp-job started')
  }
}

module.exports = Bckp

