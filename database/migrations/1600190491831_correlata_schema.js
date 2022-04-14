'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CorrelataSchema extends Schema {
  up () {
    this.create('correlatas', (table) => {
      table.increments()
      table.integer('EmpresaId')
      table.integer('CorrelatId')
      table.timestamps()
    })
  }

  down () {
    this.drop('correlatas')
  }
}

module.exports = CorrelataSchema
