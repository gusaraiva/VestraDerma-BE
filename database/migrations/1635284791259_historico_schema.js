'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HistoricoSchema extends Schema {
  up () {
    this.create('historicos', (table) => {
      table.increments()
      table.integer('exameId')
        .unsigned()
        .references('id')
        .inTable('exames')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.timestamp('dataAssociacao')
      table.timestamp('dataExame')
      table.timestamp('dataColeta')
      table.timestamp('dataLaudar')
      table.string('status')
      table.integer('userId')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.timestamps()
    })
  }

  down () {
    this.drop('historicos')
  }
}

module.exports = HistoricoSchema
