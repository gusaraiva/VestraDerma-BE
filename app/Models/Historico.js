'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Historico extends Model {
  
  exame () {
    return this.belongsToMany('App/Models/Exame')
  }
}

module.exports = Historico
