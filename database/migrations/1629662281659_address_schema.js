'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddressSchema extends Schema {
  up () {
    this.create('addresses', (table) => {
      table.increments()
      table.integer('peopleId')
        .unsigned()
        .references('id')
        .inTable('people')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.string('cep')
      table.string('logradouro')
      table.string('numero')
      table.string('complemento')
      table.string('bairro')
      table.string('cidade')
      table.string('uf')
      table.timestamps()
    })
  }

  down () {
    this.drop('addresses')
  }
}

module.exports = AddressSchema
