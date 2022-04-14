const User = use('App/Models/User')
const TypeUsers = use('App/Constants/TypeUsers')

class UserUtils {



  preparaUserToStore (username, email, password, person_id, type) {
    const dataRet = {}
    dataRet.username = username
    dataRet.email = email
    dataRet.person_id = person_id
    if (password != null) {
      dataRet.password = password
    }
    switch (type) {
      case TypeUsers.typeAdministrativo:
        dataRet[TypeUsers.typeAdministrativo] = true
        break
      case TypeUsers.typeVendedor:
        dataRet[TypeUsers.typeVendedor] = true
        break
      case TypeUsers.typeEmpresa:
        dataRet[TypeUsers.typeEmpresa] = true
        break
      case TypeUsers.typeMedico:
        dataRet[TypeUsers.typeMedico] = true
        break
      case TypeUsers.typeColetador:
        dataRet[TypeUsers.typeColetador] = true
        break
      case TypeUsers.typeLaboratorio:
        dataRet[TypeUsers.typeLaboratorio] = true
        break
      case TypeUsers.typeRespLab:
        dataRet[TypeUsers.typeRespLab] = true
        break
      default:
        break
    }
    return dataRet
  }

  preparapreparaUserToRemove (Type) {
    const dataRet = {}
    switch (type) {
      case TypeUsers.typeAdministrativo:
        dataRet[TypeUsers.typeAdministrativo] = false
        break
      case TypeUsers.typeVendedor:
        dataRet[TypeUsers.typeVendedor] = false
        break
      case TypeUsers.typeEmpresa:
        dataRet[TypeUsers.typeEmpresa] = false
        break
      case TypeUsers.typeMedico:
        dataRet[TypeUsers.typeMedico] = false
        break
      case TypeUsers.typeColetador:
        dataRet[TypeUsers.typeColetador] = false
        break
      case TypeUsers.typeLaboratorio:
        dataRet[TypeUsers.typeLaboratorio] = false
        break
      case TypeUsers.typeRespLab:
        dataRet[TypeUsers.typeRespLab] = false
        break
      default:
        break
    }
    return dataRet
  }

  async storeUser (username, email, password, person_id, type) {
    try {
      let userData = {}
      userData = this.preparaUserToStore(username, email, password, person_id, Type)
      console.table(userData)
      const user = await User.findBy('person_id', person_id)

      if (!user) {
        userData = this.preparaUserToStore(username, email, password, person_id, Type)
        const userNew = await User.create(userData)
        return true
      } else {
        userData = this.preparaUserToStore(username, email, null, person_id, Type)
        user.merge(userData)
        return true
      }
    } catch (err) {
      console.log('storeUser ', err)
    }
  }

  async removeUser (person_id, type) {
    try {
      const user = await User.findBy('person_id', person_id)
      userData = this.preparapreparaUserToRemove(Type)
      user.merge(userData)
    } catch (err) {
      console.log('removeUser ', err)
    }
  }
}
module.exports = UserUtils
