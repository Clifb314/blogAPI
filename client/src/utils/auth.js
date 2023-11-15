const url = "http://localhost:5000/api/";

class Auth {
  async login(body) {
    //add in try/catch
    try {
      const response = await fetch(`${url}users/login`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
      }
      });
      if (!response.ok) {
        throw new Error("Error accessing database");
      } else {
        const data = await response.json()
        localStorage.setItem("user", JSON.stringify(data));
        return { message: "Logged in", user: data.user };
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
      const response = await fetch(`${url}users/signup`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error("Error writing to database");
      } else {
        const consoleOut = await response.json()
        console.log(consoleOut)
        return { message: "Signed up! Now try logging in" };
      }
      //should register return the user? should it log you in?
    } catch(error) {
      console.error("Error", error);
      return { err: "Could not access database" };
    }
  }

  getUser() {
    let output
    const user = localStorage.getItem("user")
    if (user) output = user
    else output = null
    return output;
  }



}

export default new Auth();
