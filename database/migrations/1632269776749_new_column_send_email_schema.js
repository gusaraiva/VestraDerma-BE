'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NewColumnSendEmailSchema extends Schema {
  up () {
     this.alter('send_emails', (table) => {
      table.boolean('welcome').defaultTo(false)
      table.integer('personId')
    })
  }

  down () {
      this.table('send_emails', (table) => {
        table.dropColumn('welcome')
        table.dropColumn('personId')
    })
  }
}

module.exports = NewColumnSendEmailSchema
