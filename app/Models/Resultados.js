'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Resultado extends Model {
  teste () {
    return this.belongsTo('App/Models/Teste')
  }
}

module.exports = Resultado