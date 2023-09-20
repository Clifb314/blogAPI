import { localsName } from "ejs"

const url = 'http://localhost:5000/api/'

class Auth {
    async login(username, password) {
        //add in try/catch
        try {
            const response = fetch(`${url}/users/signin`, {
                method: 'POST',
                mode: 'cors',
                body: {
                    username,
                    password,
                }
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else {
                localStorage.setItem('user', JSON.stringify(response.data))
            }

        } catch {
            console.error('Error', error)
        }
    }

    logout() {
        localStorage.removeItem('user')
    }

    async register(username, email,  password, checkPW) {
        //maybe take checkPW out of express and just validate in react
        //add try/catch block
        try {
            const response = fetch(`${url}/signup`, {
                method: 'POST',
                mode: 'cors',
                body: {
                    username,
                    email,
                    password,
                    checkPW
                }
            })
            if (!response.ok) {
                throw new Error('Error writing to database')
            }
            //does register return the user?
        } catch {
            console.error('Error', error)
        }
    }

    getUser() {
        return JSON.parse(localStorage.getItem('user'))
    }
}

export default new Auth()