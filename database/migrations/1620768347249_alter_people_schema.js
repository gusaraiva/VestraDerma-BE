'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterPeopleSchema extends Schema {
  up () {
    this.alter('people', (table) => {
      table.integer('epk')
    })
  }

  down () {
    table.dropColumn('epk')
  }
}

module.exports = AlterPeopleSchema
