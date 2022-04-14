'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddColumnFileSchema extends Schema {
  up () {
    this.alter('files', (table) => {
      // alter table
      table.integer('exameId')
        .unsigned()
        .references('id')
        .inTable('exames')
        .onUpdate('SET NULL')
        .onDelete('CASCADE')
    })
  }

  down () {
    this.table('files', (table) => {
      table.dropColumn('exameId')
    })
  }
}

module.exports = AddColumnFileSchema
