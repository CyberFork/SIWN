const TOKEN_KEY = 'token'
const REGRESH_TOKEN_KEY = 'rtoken'

export const getToken = () => {
    console.log("localStorage:", localStorage)
    return localStorage.getItem(TOKEN_KEY)
}
export const getRefreshToken = () => localStorage.getItem(REGRESH_TOKEN_KEY)

export const setToken = (token, params = {}) => {
    localStorage.setItem(TOKEN_KEY, token)
}

export const setRefreshToken = (token) => {
    localStorage.setItem(REGRESH_TOKEN_KEY, token)
}