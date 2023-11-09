const url = "http://localhost:5000/api/";

class Auth {
  async login(username, password) {
    //add in try/catch
    try {
      const response = fetch(`${url}/users/signin`, {
        method: "POST",
        mode: "cors",
        body: {
          username,
          password,
        },
        headers: {
          'Content-Type': 'application/json'
      }
      });
      if (!response.ok) {
        throw new Error("Error accessing database");
      } else {
        console.log(response)
        localStorage.setItem("user", JSON.stringify(response));
        return { message: "Logged in", user: response.user };
      }
    } catch(error) {
      console.error("Error", error);
      return { err: "Could not access database" };
    }
  }

  logout() {
    localStorage.removeItem("user");
    return { message: "successfully logged out" };
  }

  async register(body) {
    //maybe take checkPW out of express and just validate in react
    //add try/catch block
    try {
      const response = fetch(`${url}/signup`, {
        method: "POST",
        mode: "cors",
        body,
      });
      if (!response.ok) {
        throw new Error("Error writing to database");
      }
      //should register return the user? should it log you in?
      return { message: "Signed up!" };
    } catch(error) {
      console.error("Error", error);
      return { err: "Could not access database" };
    }
  }

  getUser() {
    let output
    const user = localStorage.getItem("user")
    console.log(user)
    if (user) output = user
    else output = null
    return output;
  }
}

export default new Auth();
