'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RevendaSchema extends Schema {
  up () {
    this.create('revendas', (table) => {
      table.increments()
      table.integer('comprador_id')
        .unsigned()
        .references('id')
        .inTable('people')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.integer('revendedor_id')
        .unsigned()
        .references('id')
        .inTable('people')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')   
      table.timestamps()
    })
  }

  down () {
    this.drop('revendas')
  }
}

module.exports = RevendaSchema
