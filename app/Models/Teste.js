'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Teste extends Model {
  fabricante () {
    return this.belongsTo('App/Models/Fabricante')
  }

  vendas () {
    return this.hasMany('App/Models/Venda')
  }

  resultados () {
    return this.hasMany('App/Models/Resultado')
  }
}

module.exports = Teste
