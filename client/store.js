import { store } from '../lib/store'
import { login } from './service'

let user

try {
  user = JSON.parse(localStorage.getItem('user'))
} catch (e) {
  user = null
}

export const Store = store({ user })

login()