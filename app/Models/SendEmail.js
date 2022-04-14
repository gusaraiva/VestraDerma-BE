'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SendEmail extends Model {
   exame () {
    return this.belongsTo('App/Models/Exame')
  }
}

module.exports = SendEmail
