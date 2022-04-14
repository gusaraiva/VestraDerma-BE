'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Person extends Model {
  users () {
    return this.hasMany('App/Models/User')
  }

  file () {
    return this.hasMany('App/Models/File')
  }

  associados () {
    return this.hasMany('App/Models/Associado')
  }
   address () {
    return this.hasMany('App/Models/Address')
  }
}

module.exports = Person
