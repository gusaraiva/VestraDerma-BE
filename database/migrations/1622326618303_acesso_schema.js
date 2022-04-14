'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AcessoSchema extends Schema {
  up () {
    this.create('acessos', (table) => {
      table.increments()
      table.integer('userId')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.string('dataAcesso')
      table.boolean('firstAccess').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('acessos')
  }
}

module.exports = AcessoSchema
