'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AssociadoSchema extends Schema {
  up () {
    this.create('associados', (table) => {
      table.increments()
      table.integer('id_pessoa')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('people')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('id_associado')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('people')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')

      table.timestamps()
    })
  }

  down () {
    this.drop('associados')
  }
}

module.exports = AssociadoSchema
