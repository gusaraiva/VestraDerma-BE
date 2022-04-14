'use strict'

const { route } = require('@adonisjs/framework/src/Route/Manager')

const Route = use('Route')

Route.get('/', () => {
  return { message: 'TestApp Vestra' }
})

Route.post('/sessions', 'SessionController.store')
Route.post('/cadastro', 'CadastroController.store')
Route.get('/files/:id', 'FileController.show')
Route.get('/zip/:fileName', 'ZipFileController.show')
Route.post('/listRevendas', 'DashBoardController.listRevendas')
Route.post('/examesLaudados', 'DashBoardController.examesLaudados')
Route.post('/laudar/:id', 'LaudarController.store')

Route.group(() => {
  Route.get('/showExame/:id', 'ShowExameController.show')
  Route.put('/users/:id', 'UserController.update')
  Route.post('/files', 'FileController.store')

  Route.get('/testesCount', 'DashBoardController.testesCount')
  Route.get('/medicosCount', 'DashBoardController.medicosCount')
  Route.get('/laboratoriosCount', 'DashBoardController.laboratoriosCount')
  Route.get('/empresasCount', 'DashBoardController.empresasCount')
  Route.get('/examesCount', 'DashBoardController.examesCount')

  Route.put('/desAssociaExames/:id', 'ExamsByPacienteController.DesAssocia')

  Route.put('/searchExames/:id', 'SearchExameController.search')

  Route.get('/searchLast30dExames/', 'SearchLast30dExames.list')
  Route.get('/searchExamesLaudarByLab/:id', 'SearchExamesLaudarByLabController.list')
  Route.get('/searchExamesByVenda/:id', 'SearchExamesByVendaController.list')
  Route.put('/searchExamesByPacient/:id', 'ExamsByPacienteController.search')
  Route.get('/searchPersonByResp/:doc', 'SearchPersonByRespController.list')
  Route.get('/searchPerson/:doc', 'SearchPersonController.show')
  Route.get('/searchResults/:id', 'SearchResultsController.list')
  Route.get('/searchAssociados/:id', 'SearchAssociadosController.list')
  Route.get('/searchCorrelatas/:id', 'SearchCorrelatasController.list')
  Route.get('/searchExamesParaRevenda/:id', 'SearchExameController.searchExamesParaRevenda')
  Route.get('/searchExamesByRevenda/:id', 'SearchExamesByRevendaController.list')
  Route.post('/zip', 'ZipFileController.store')

  Route.get('/searchTestesCountByComprador/:id', 'SearchTestesCountByCompradorController.list')
  Route.get('/searchTestesCountByCompradorStatus/:id', 'SearchTestesCountByCompradorController.listByStatus')
  Route.get('/searchVendasByComprador/:id', 'SearchVendasByCompradorController.list')
  Route.get('/searchExamesColetarByDoc/:id', 'SearchExamesColetarByDocController.list')
  Route.get('/listMedicEmp', 'ListMedicEmpController.index')
  Route.get('/listRevendedores', 'ListRevendedorController.index')
  Route.put('/listRevendasComprXRev/:id', 'ListRevendasController.index')
  Route.post('/associarExames', 'AssociarExamesController.store')
  Route.put('/laudar/:id', 'LaudarController.update')
  Route.put('/coletar/:id', 'ColetarController.update')
  Route.put('/testesDestroyN/:id', 'TestesDestroyNController.update')
  Route.put('/testesDestroyNRev/:id', 'TestesDestroyNRevController.update')

Route.get('/uploadfuncs', 'ImportFuncionarioController.uploadfuncs')
Route.post('/uploadfuncs', 'ImportFuncionarioController.store')

Route.post('/reenvio', 'ReenvioController.store')
}).middleware('auth', 'userControl')

Route.group(() => {
  Route.resource('teams', 'TeamController').apiOnly()
  Route.resource('pacientes', 'PacienteController').apiOnly()
  Route.resource('associados', 'AssociadoController')
  Route.resource('medicos', 'MedicoController').apiOnly()
  Route.resource('resplab', 'RespLabController').apiOnly()
  Route.resource('labs', 'LaboratorioController').apiOnly()
  Route.resource('empresas', 'EmpresaController').apiOnly()
  Route.resource('correlatas', 'CorrelataController').apiOnly()
  Route.resource('vendedor', 'VendedorController').apiOnly()
  Route.resource('coletador', 'ColetadorController').apiOnly()
  Route.resource('adm', 'AdministrativoController').apiOnly()
  Route.resource('fabricante', 'FabricanteController').apiOnly()
  Route.resource('testes', 'TesteController').apiOnly()
  Route.resource('vendas', 'VendaController').apiOnly()
  Route.resource('revendas', 'RevendaController').apiOnly()
  Route.resource('exames', 'ExameController').apiOnly()
  Route.resource('resultados', 'ResultadoController').apiOnly()
}).middleware('auth', 'userControl')

Route.group(() => {
  Route.post('invites', 'InviteController.store')
}).middleware(['auth', 'team'])
