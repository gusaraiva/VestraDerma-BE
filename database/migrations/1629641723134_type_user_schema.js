'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TypeUserSchema extends Schema {
  up () {
    this.create('type_users', (table) => {
      table.increments()
      table.integer('userId')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.boolean('isRoot').defaultTo(false)
      table.boolean('isAdmin').defaultTo(false)
      table.boolean('isVendedor').defaultTo(0)
      table.boolean('isEmpresa').defaultTo(0)
      table.boolean('isMedico').defaultTo(0)
      table.boolean('isColetador').defaultTo(0)
      table.boolean('isLaboratorio').defaultTo(0)
      table.boolean('isRespLab').defaultTo(0)
      table.boolean('isRevendedor').defaultTo(0)
      table.boolean('isPaciente').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('type_users')
  }
}

module.exports = TypeUserSchema
