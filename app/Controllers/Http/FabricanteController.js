'use strict'
const Fabricante = use('App/Models/Fabricante')

class FabricanteController {
  // list
  async index ({ response }) {
    try {
      const fabricantes = await Fabricante.all()
      const obj = {}
      obj.ret = 'ok'
      obj.list = fabricantes
      return obj
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: 'Erro ao Listar Fabricantes' } })
    }
  }

  // store - criar
  async store ({ request, response }) {
    try {
      const data = request.only(['nome'])
      const FabricanteExists = await Fabricante.findBy('nome', data.nome)
      if (FabricanteExists) {
        return response
          .status(400)
          .send({ error: { message: 'Fabricante Já cadastrado' } })
      }

      const fabricante = await Fabricante.create(data)
      const obj = {}
      obj.ret = 'ok'
      obj.fabricante = fabricante
      return obj
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: 'Erro ao Criar Fabricante' } })
    }
  }

  // update
  async update ({ request, response }) {
    try {
      const data = request.only(['id', 'nome'])
      const fabricante = await Fabricante.findBy('id', data.id)
      if (!fabricante) {
        return response
          .status(400)
          .send({ error: { message: 'Não existe esse Fabricante no banco' } })
      }

      fabricante.merge(data)
      await fabricante.save()
      const obj = {}
      obj.ret = 'ok'
      obj.fabricante = fabricante
      return obj
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: 'Erro ao atualizar Fabricante' } })
    }
  }

  // delete
  async destroy ({ params, request, response }) {
    try {
      const fabricante = await Fabricante.findBy('id', params.id)
      if (!fabricante) {
        return response
          .status(400)
          .send({ error: { message: 'Não existe esse Fabricante no banco' } })
      }

      await fabricante.delete()
      return response
        .status(200)
        .send({ message: 'Fabricante Excluído com sucesso' })
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: 'Erro ao Excluir Fabricante' } })
    }
  }

  // show - 1
  async show ({ params, request, response }) {
    try {
      const fabricante = await Fabricante.findBy('id', params.id)
      if (!fabricante) {
        return response
          .status(400)
          .send({ error: { message: 'Não existe esse Fabricante no banco' } })
      }
      const obj = {}
      obj.ret = 'ok'
      obj.fabricante = fabricante
      return obj
    } catch (err) {
      console.log(err)
      return response
        .status(400)
        .send({ error: { message: 'Erro ao Carregar Fabricante' } })
    }
  }
}

module.exports = FabricanteController
