import authHeader from "./authHeader";

const APIurl = 'http://localhost:5000/api/users/'
const postsURL = 'http://localhost:5000/api/posts/'
const comURL = 'http://localhost:5000/api/comments/'



class UserService {
//User data

    async getAllUsers() {
        try {
            const response = fetch(APIurl, {
                method: `GET`,
                mode: "cors",
                headers: authHeader()
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return response
        } catch {
            console.error('Error', error)
        }
    }

    async getUserPage(userID) {
        try {
            const response = fetch(`${APIurl}${userID}`, {
                method: `GET`,
                mode: "cors",
                headers: authHeader()
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return response
        } catch {
            console.error('Error', error)
        }
    }

    async getUserHome() {
        try {
            //set up a seperate homepage from user detail page
            const response = fetch(`${APIurl}/home`, {
                method: 'GET',
                mode: 'cors',
                headers: authHeader(),
            })
            if (!response.ok) throw new Error('Error accessing database')
            else return response
        } catch {
            console.error('Error', error)
        }
    }

    async editAccount(body) {
        //body will have to be FormData object?
        try {
            const response = fetch(`${APIurl}/edit`, {
                method: 'PUT',
                mode: 'cors',
                headers: authHeader(),
                body,
            })
            if (!response.ok) throw new Error('Error posting to database')
            else return response
        } catch {
            console.error('Error', error)
        }
    }
//Post data
    async getAllPosts() {
        try {
            const response = fetch(postsURL, {
                method: `GET`,
                mode: "cors",
                headers: authHeader()
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return response
        } catch {
            console.error('Error', error)
        }    
    }

    async getTopPosts() {
        try {
            const response = fetch(`${postsURL}top`, {
                method: `GET`,
                mode: "cors",
                headers: authHeader()
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return response
        } catch {
            console.error('Error', error)
        }    
    }

    async getPostDetail(postID) {
        try {
            const response = fetch(postsURL + postID, {
                method: `GET`,
                mode: "cors",
                headers: authHeader()
            })
            if (!response.ok) {
                throw new Error('Error accessing database')
            } else return response
        } catch {
            console.error('Error', error)
        }
    }
//Comment data
}

export default new UserService