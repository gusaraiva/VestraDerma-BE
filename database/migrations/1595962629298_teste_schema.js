'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TesteSchema extends Schema {
  up () {
    this.create('testes', (table) => {
      table.increments()
      table.string('nome')
      table.integer('fabricante_id')
        .unsigned()
        .references('id')
        .inTable('fabricantes')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('tipoAmostra')
      table.string('nomeComercial')
      table.string('metodo')
      table.string('equipamento')
      table.string('orientacoes')
      table.string('sobreTeste')
      table.string('analiseResultado')
      table.timestamps()
    })
  }

  down () {
    this.drop('testes')
  }
}

module.exports = TesteSchema
