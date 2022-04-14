'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PersonSchema extends Schema {
  up () {
    this.table('people', (table) => {
      table.boolean('obesidade').defaultTo(0)
    })
  }

  down () {
    this.table('people', (table) => {
      table.dropColumn('obesidade')
    })
  }
}

module.exports = PersonSchema
