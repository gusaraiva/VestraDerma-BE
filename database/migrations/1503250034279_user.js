'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username').notNullable()
      table.string('password').notNullable()
      table.boolean('typeRoot').defaultTo(0)
      table.boolean('typeAdministrativo').defaultTo(0)
      table.boolean('typeVendedor').defaultTo(0)
      table.boolean('typeEmpresa').defaultTo(0)
      table.boolean('typeMedico').defaultTo(0)
      table.boolean('typeColetador').defaultTo(0)
      table.boolean('typeLaboratorio').defaultTo(0)
      table.boolean('typeRespLab').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
