'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddEncriptUserSchema extends Schema {
  up () {
    this.alter('users', (table) => {
      table.boolean('encript').defaultTo(false)
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('encript')
    })
  }
}

module.exports = AddEncriptUserSchema
