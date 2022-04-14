'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FabricantesSchema extends Schema {
  up () {
    this.create('fabricantes', (table) => {
      table.increments()
      table.string('nome')
      table.timestamps()
    })
  }

  down () {
    this.drop('fabricantes')
  }
}

module.exports = FabricantesSchema
