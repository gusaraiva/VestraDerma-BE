'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AgendaSchema extends Schema {
  up () {
    this.create('agendas', (table) => {
      table.increments()
      table.integer('paciente_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('people')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
        table.integer('medico_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('people')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.timestamp('data_agendamento').notNullable()
      table.integer('status').defaultTo(0)// 0 -> Agendado / 1 -> Atendido / 2 -> Remarcado
      table.string('motivo_remarcacao')
      table.decimal('valor_consulta')
      table.timestamps()
    })
  }

  down () {
    this.drop('agendas')
  }
}

module.exports = AgendaSchema
