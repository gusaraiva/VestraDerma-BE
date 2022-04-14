'use strict'

const Revenda = use('App/Models/Revenda')
const Exame = use('App/Models/Exame')
const Database = use('Database')

/**
 * Resourceful controller for interacting with revendas
 */
class RevendaController {
  /**
   * Show a list of all revendas.
   * GET revendas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    try {

      const revendas = await Revenda.all()

      return revendas
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }


  async store({ request, response }) {
    try {
      const revenda = request.only([
        'comprador_id',
        'revendedor_id',
        'exames'
      ])
      console.log('revenda', JSON.stringify(revenda))



      const revend = await Revenda.create({
        comprador_id: revenda.comprador_id,
        revendedor_id: revenda.revendedor_id
      })


      let SQL = `update exames set revenda_id= ${revend.id} where id in (`;
      for (let index = 0; index < revenda.exames.length; index++) {
        if (index > 0)
          SQL += ' union ';
        SQL += `
          (select e.id 
            from exames e
            inner join vendas v on v.id=e.venda_id
            where v.comprador_id=${revenda.revendedor_id}
            and status=0
            and e.revenda_id is null
            and e.teste_id=${revenda.exames[index].id} limit ${revenda.exames[index].revender})`

      }
      SQL += ')'
      // console.log('SQL ',JSON.stringify(SQL))
      let ret = await Database
        .raw(SQL)
      console.log('ret', JSON.stringify(ret))

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


  async show({ params, request, response, view }) {
    try {
      const revenda = Revenda.findByOrFail('id', params.id)

      return revenda
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: err } })
    }
  }

  /**
   * Render a form to update an existing revenda.
   * GET revendas/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update revenda details.
   * PUT or PATCH revendas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a revenda with id.
   * DELETE revendas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = RevendaController
