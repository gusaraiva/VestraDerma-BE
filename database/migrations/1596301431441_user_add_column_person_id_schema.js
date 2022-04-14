'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserAddColumnPersonIdSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.integer('person_id')
      .unsigned()
      .references('id')
      .inTable('people')
      .onUpdate('CASCADE')
      .onDelete('SET NULL')    
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('person_id')
    })
  }
}

module.exports = UserAddColumnPersonIdSchema
