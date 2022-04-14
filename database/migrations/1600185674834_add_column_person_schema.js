'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddColumnPersonSchema extends Schema {
  up () {
    this.alter('people', (table) => {
      table.boolean('revendedor').defaultTo(0)
    })
  }

  down () {
    this.alter('people', (table) => {
      // reverse alternations
      table.dropColumn('revendedor')
    })
  }
}

module.exports = AddColumnPersonSchema
