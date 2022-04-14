'use strict'
const Exame = use('App/Models/Exame')
const Venda = use('App/Models/Venda')


class TestesDestroyNController {
    async update({ params, request, response }) {
        console.log('eeeee')
        try {
            const venda = await Venda.findByOrFail('id', params.id)
            let qtdeExamesAntes = venda.quantidade * 1
            const data = request.only([
                'exames'
            ])
           // console.log('exames', JSON.stringify(data.exames))
            let qtdeExamesDepois = qtdeExamesAntes - data.exames.length
            //console.log('qtdeExamesDepois', JSON.stringify(qtdeExamesDepois));
            for (let index = 0; index < data.exames.length; index++) {
                const element = data.exames[index];
                const exame = await Exame.findByOrFail('id', element)
                exame.delete();
                //console.log(element)
                
            }
            venda.merge({
                quantidade: qtdeExamesDepois
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





}


module.exports = TestesDestroyNController
