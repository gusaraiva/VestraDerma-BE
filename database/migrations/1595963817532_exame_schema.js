'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExameSchema extends Schema {
  up () {
    this.create('exames', (table) => {
      table.increments()
      // venda id, tese_id não pode ser nulo
      table.integer('venda_id')
        .unsigned()
        .references('id')
        .inTable('vendas')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.integer('teste_id')
        .unsigned()
        .references('id')
        .inTable('testes')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.integer('paciente_id')
        .unsigned()
        .references('id')
        .inTable('people')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.integer('coletador_id')
        .unsigned()
        .references('id')
        .inTable('people')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.integer('lab_id')
        .unsigned()
        .references('id')
        .inTable('people')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.integer('respLab_id')
        .unsigned()
        .references('id')
        .inTable('people')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.string('loteExame')
      table.date('dataValidadeExame')
      table.boolean('sintomas').defaultTo(0)
      table.date('sintDesde')
      table.boolean('febre').defaultTo(0)
      table.boolean('tosse').defaultTo(0)
      table.boolean('faltadeAr').defaultTo(0)
      table.boolean('dorGarganta').defaultTo(0)
      table.boolean('dorCabeca').defaultTo(0)
      table.boolean('perdaOlfato').defaultTo(0)
      table.boolean('perdaPaladar').defaultTo(0)
      table.boolean('calafrios').defaultTo(false)
      table.boolean('dorCorpo').defaultTo(false)
      table.boolean('diarreia').defaultTo(false)
      table.boolean('contato10d').defaultTo(false)
      table.string('resultadoText')
      table.integer('resultadoType')// 1 positivo, 0 negativo, -1 inválido
      table.integer('status') // vendido 0, associado 1, coletado 2, laudado 3.
      table.dateTime('dataColeta')
      table.dateTime('dataResultado')
      table.string('fileLaudo')
      table.string('fileExame')
      table.timestamps()
    })
  }

  down () {
    this.drop('exames')
  }
}

module.exports = ExameSchema
