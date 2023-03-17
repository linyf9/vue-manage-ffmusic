import Cookie from 'js-cookie'
const tokenKey = 'token'

export function getToken() {
    return Cookie.get(tokenKey)
    // return localStorage.getItem(tokenKey)
}

export function setToken(token) {
  return Cookie.set(tokenKey, token)
    // return localStorage.setItem(tokenKey, token)
}

export function removeToken() {
  return Cookie.remove(tokenKey)
    // return localStorage.removeItem(tokenKey)
}
