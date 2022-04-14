'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Exame extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeUpdate', 'ExameHook.enviaLaudo')
  }

  teste () {
    return this.belongsTo('App/Models/Teste')
  }

  venda () {
    return this.belongsTo('App/Models/Venda')
  }

  persons () {
    return this.belongsToMany('App/Models/Person')
  }

   historico () {
    return this.belongsToMany('App/Models/Historico')
  }
}

module.exports = Exame
