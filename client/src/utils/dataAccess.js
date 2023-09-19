import authHeader from "./authHeader";

const APIurl = 'http://localhost:5000/api/users/'
const postsURL = 'http://localhost:5000/api/posts/'


class UserService {
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
}

export default new UserService