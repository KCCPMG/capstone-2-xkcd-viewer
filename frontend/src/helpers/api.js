import axios from 'axios';
import jwt from 'jsonwebtoken';

const SERVER_URL = "http://localhost:5000";


class xkcdAPI {
  // encapsulated token remains private to this class
  static token;

  static async request(endpoint, data, method) {
    const url = `${SERVER_URL}/${endpoint}`;
    // assign token to all requests
    const headers = {token: this.token};
    // if this is a get request, paramater object from data, else empty parameter object
    const params = (method === "get") ? data : {};
    
    try {
      // console.log({url, method, data, params, headers})
      const resp = await axios({url, method, data, params, headers});
      // console.log(resp);
      return resp.data;
    } catch(err) {
      console.log(err);
      console.error("API Error", err.response);
      let message = err.response.data.error.message;
      // always throw error messages in an array
      throw Array.isArray(message) ? message : [message];
    }
  }

  // auth routes

  /** Sign up a new user */
  static async signup(email, username, password) {
    console.log(email, username, password);
    const data = await this.request('auth/signup', {email, username, password}, 'POST');
    console.log(data);
    this.token = data.token;
    return 
  }

  /** */
  static async login(username, password) {
    await this.request('auth/login', {username, password}, 'POST')   
  }

  /** */
  static async logout() {

  }



}


export default xkcdAPI;