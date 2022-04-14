'use strict'
const Venda = use('App/Models/Venda')
const Exame = use('App/Models/Exame')
const Database = use('Database')

class VendaController {
  async index ({ request, response, view }) {
    try {
      const vendas = await Venda.all()

      return vendas
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async store ({ request, response }) {
    try {
      const venda = request.only([
        'comprador_id',
        'vendedor_id',
        'quantidade',
        'formaPagamento',
        'valorTotal',
        'exames'
      ])

      const vend = await Venda.create({
        comprador_id: venda.comprador_id,
        vendedor_id: venda.vendedor_id,
        quantidade: venda.quantidade,
        formaPagamento: venda.formaPagamento,
        valorTotal: venda.valorTotal
      })
      for (let index = 0; index < venda.exames.length; index++) {
        const element = venda.exames[index]
        const data = {
          venda_id: vend.id,
          teste_id: element.teste_id,
          lab_id: element.lab_id,
          status: element.status
        }
        if (element.paciente_id) { data.paciente_id = element.paciente_id }
        await Exame.create(data)
      }
      return response
        .status(200)
        .send({ message: 'Incluido com sucesso' })
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: 'Erro ao inserir' } })
    }
  }

  async show ({ params, request, response, view }) {
    try {
      const venda = Venda.findByOrFail('id', params.id)

      return venda
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async update ({ params, request, response }) {
    try {
      const venda = await Venda.findByOrFail('id', params.id)

      const vendaU = request.only([
        'comprador_id',
        'vendedor_id',
        'quantidade',
        'formaPagamento',
        'valorTotal'
      ])

      venda.merge({
        comprador_id: vendaU.comprador_id,
        vendedor_id: vendaU.vendedor_id,
        quantidade: vendaU.quantidade,
        formaPagamento: vendaU.formaPagamento,
        valorTotal: vendaU.valorTotal
      })

      await venda.save()

      return response
        .status(200)
        .send({ message: 'Atualizado com sucesso' })
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  async destroy ({ params, request, response }) {
    try {
      console.log('venda id ', params.id)

      const count = await Database
        .from('exames')
        .where('venda_id', params.id)
        .where('status', '>', 0)
        .count('* as total')

      console.log('count ' + JSON.stringify(count))
      if (count[0].total && count[0].total > 0) {
        return response
          .status(400)
          .send({ message: 'Impossível Excluir Venda com Exames já Associados a Pacientes' })
      } else {
        const affectedRows = await Database
          .table('exames')
          .where('venda_id', params.id)
          .del()

        const venda = await Venda.findByOrFail('id', params.id)

        await venda.delete()

        return response
          .status(200)
          .send({ message: 'Excluido com sucesso' })
      }
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: 'Erro ao Excluir' } })
    }
  }
}

module.exports = VendaController
