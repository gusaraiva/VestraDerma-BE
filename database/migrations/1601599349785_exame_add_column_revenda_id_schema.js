'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExameAddColumnRevendaIdSchema extends Schema {
  up () {
    this.table('exames', (table) => {
      table.integer('revenda_id')
      .unsigned()
      .references('id')
      .inTable('revendas')
      .onUpdate('CASCADE')
      .onDelete('SET NULL')
    })
  }

  down () {
    this.table('exames', (table) => {
      // reverse alternations
      table.dropColumn('revenda_id')
    })
  }
}

module.exports = ExameAddColumnRevendaIdSchema
