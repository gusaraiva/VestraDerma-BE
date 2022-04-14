'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Revenda extends Model {
    person () {
        return this.belongsTo('App/Models/Person')
      }
    
      testes () {
        return this.hasMany('App/Models/Teste')
      }
}

module.exports = Revenda
