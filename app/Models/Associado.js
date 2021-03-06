'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Associado extends Model {
  person () {
    return this.hasOne('App/Models/Person')
  }
}

module.exports = Associado
