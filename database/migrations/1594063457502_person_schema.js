'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PersonSchema extends Schema {
  up () {
    this.create('people', (table) => {
      table.increments()
      table.string('nome').notNullable()
      table.string('doc')
      table.boolean('dependente').defaultTo(0)
      table.string('docResponsavel')
      table.string('razaoSocial')
      table.string('administrador')
      table.string('filial')
      table.date('birth_date')
      table.string('contato1')
      table.string('contato2')
      table.string('email')
      table.string('codProfissao')
      table.string('tecnico')
      table.string('docTecnico')
      table.string('raca')
      table.string('sexo')
      table.boolean('psaude').defaultTo(0)
      table.boolean('pseg').defaultTo(0)
      table.boolean('pdrespcronica').defaultTo(0)
      table.string('drespcronica')
      table.boolean('pdcromossomica').defaultTo(0)
      table.string('dcromossomica')
      table.boolean('diabetes').defaultTo(0)
      table.boolean('imunossupressao').defaultTo(0)
      table.boolean('pdcardiaca').defaultTo(0)
      table.string('dcardiaca')
      table.boolean('gestanterisco').defaultTo(0)
      table.integer('tempogestacao').defaultTo(0)
      table.boolean('pdrenalcronica').defaultTo(0)
      table.string('drenalcronica')
      table.integer('status').defaultTo(0)
      table.boolean('typePaciente').defaultTo(0)
      table.string('cep')
      table.string('logradouro')
      table.string('numero')
      table.string('complemento')
      table.string('bairro')
      table.string('cidade')
      table.string('uf')
      table.string('url')
      table.integer('lab_id')
        .unsigned()
        .references('id')
        .inTable('people')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.timestamps()
    })
  }

  down () {
    this.drop('people')
  }
}

module.exports = PersonSchema
