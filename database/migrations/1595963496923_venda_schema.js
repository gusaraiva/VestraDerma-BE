'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VendaSchema extends Schema {
  up () {
    this.create('vendas', (table) => {
      table.increments()
      table.integer('comprador_id')
        .unsigned()
        .references('id')
        .inTable('people')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.integer('vendedor_id')
        .unsigned()
        .references('id')
        .inTable('people')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.integer('quantidade')
      table.integer('formaPagamento')
      table.float('valorTotal')
      table.timestamps()
    })
  }

  down () {
    this.drop('vendas')
  }
}

module.exports = VendaSchema
