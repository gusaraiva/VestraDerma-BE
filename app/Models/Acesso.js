'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Acesso extends Model {
  user () {
    return this.hasMany('App/Models/User')
  }
}

module.exports = Acesso
