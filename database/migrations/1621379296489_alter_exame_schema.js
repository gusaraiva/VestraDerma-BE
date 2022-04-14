'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterExameSchema extends Schema {
  up () {
    this.alter('exames', (table) => {
      table.boolean('pdfCreate').defaultTo(false)
      table.integer('oId') //oldId
      table.integer('oPacId') // OldPacientId
      table.integer('oExId') // OldExaminadorID
      table.integer('oProfId') // OldProfissionalId
      table.integer('OLabId') // OldLabId
      table.integer('OLabProfId') // OldProfLabId
    })
  }

  down () {
    this.table('exames', (table) => {
      table.dropColumn('pdfCreate')
      table.dropColumn('oId') 
      table.dropColumn('oPacId') 
      table.dropColumn('oExId')
      table.dropColumn('oProfId') 
      table.dropColumn('OLabId') 
      table.dropColumn('OLabProfId') 
    })
  }
}

module.exports = AlterExameSchema
