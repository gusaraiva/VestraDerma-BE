'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SendEmailSchema extends Schema {
  up () {
    this.create('send_emails', (table) => {
      table.increments()
      table.string('email_paciente')
      table.string('email_comprador')
      table.string('email_revendedor')
      table.string('data_envio')
      table.string('exame')
      table.boolean('status').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('send_emails')
  }
}

module.exports = SendEmailSchema
