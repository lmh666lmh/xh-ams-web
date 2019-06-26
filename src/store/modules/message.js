import { api } from '@/api/index'

const message = {
  state: {
    messageNumber: ''
  },
  mutations: {
    CHANGE_MESSAGE_NUMBER: (state, number) => {
      state.messageNumber = number
    }
  },
  actions: {
    ChangeMessageNumber: ({ commit }, number) => {
      return new Promise((resolve, reject) => {
        api.getSchoolList({}, response => {
          if (number) {
            commit('CHANGE_MESSAGE_NUMBER', number)
          } else {
            commit('CHANGE_MESSAGE_NUMBER', 999)
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default message
