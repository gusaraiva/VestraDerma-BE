'use strict'

const File = use('App/Models/File')
const Helpers = use('Helpers')
const fs = require('fs')

class FileController {
  async show ({ params, response }) {
    const file = await File.findOrFail(params.id)

    return response.download(Helpers.publicPath(`uploads/${file.file}`))
  }
  

  async store ({ request, response }) {
    try {
      if (!request.file('file')) return

      const upload = request.file('file', { size: '5mb' })

      const fileName = `${Date.now()}.${upload.subtype}`

      await upload.move(Helpers.publicPath('uploads'), {
        name: fileName,
        overwrite: true
      })

      if (!upload.moved()) {
        throw upload.error()
      }

      const file = File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      })

      return file
    } catch (err) {
      return response.status(err.status)
        .send({ error: { message: 'Erro no Upload do Arquivo' } })
    }
  }
}

module.exports = FileController
