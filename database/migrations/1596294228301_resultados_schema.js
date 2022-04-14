'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ResultadosSchema extends Schema {
  up () {
    this.create('resultados', (table) => {
      table.increments()
      table.integer('teste_id')
      .unsigned()
      .references('id')
      .inTable('testes')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
      table.string('resultadoText')
      table.integer('resultadoType')
      table.timestamps()
    })
  }

  down () {
    this.drop('resultados')
  }
}

module.exports = ResultadosSchema
