'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.boolean('typeRevendedor').defaultTo(0)
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('typeRevendedor')
    })
  }
}

module.exports = UsersSchema
