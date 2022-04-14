'use strict'

const fs = require('fs')
const Helpers = use('Helpers')

class Zip {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'Zip-job'
  }

  // This is where the work is done.
  async handle ({ nomezip }) {
    console.log('Zip-job started', nomezip)
    const pathZip = Helpers.publicPath(nomezip)
    try {
      if (fs.existsSync(pathZip)) {
        console.log('Arquivo Encontrado')

        setTimeout(() => {
          fs.unlink(pathZip, (err) => {
            if (err) {
              return console.error(err)
            } else {
              console.log('Excluido')
            }
          })
        }, 900000)
      }
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = Zip
