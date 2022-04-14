'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TesteSchema extends Schema {
  up () {
    this.table('testes', (table) => {
      table.text('orientacoes').alter();
      table.text('sobreTeste').alter();
      table.text('analiseResultado').alter();     
    })
  }

  down () {
    this.table('testes', (table) => {
      // reverse alternations
    })
  }
}

module.exports = TesteSchema
