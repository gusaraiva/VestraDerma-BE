'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExameSchema extends Schema {
  up () {
    this.table('exames', (table) => {
      table.boolean('fadiga').defaultTo(0)
      table.boolean('coriza').defaultTo(0)
    })
  }

  down () {
    this.table('exames', (table) => {
      // reverse alternations
      table.dropColumn('fadiga')
      table.dropColumn('coriza')
    })
  }
}

module.exports = ExameSchema
