import axios from 'axios';
import jwt from 'jsonwebtoken';

const SERVER_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";


class xkcdAPI {
  // encapsulated token remains private to this class
  static #token;

  /** Get a token from localStorage, return body */
  static async loadToken() {
    if (!this.#token) {
      if (localStorage.token) {
        this.#token = localStorage.getItem('token');
      }
    }
    // console.log("xkcdAPIToken:", this.#token);
    if (this.#token) return jwt.decode(this.#token);
    else return undefined;
  }


  /** Remove a token from local storage, and from here */
  static async removeToken() {
    localStorage.removeItem('token');
    this.#token = undefined;
  }


  static async request(endpoint, data, method) {
    this.loadToken();
    const url = `${SERVER_URL}/${endpoint}`;
    // assign token to all requests
    const headers = {token: this.#token};
    // if this is a get request, paramater object from data, else empty parameter object
    const params = (method === "get") ? data : {};
    
    try {
      // console.log({url, method, data, params, headers})
      const resp = await axios({url, method, data, params, headers});
      // console.log(resp);
      return resp.data;
    } catch(err) {
      console.log(err);
      console.log(err.response?.status === 401);
      console.log(err.response?.status);
      if (err.response?.status === 401) {
        console.log(localStorage.getItem('token'));
        localStorage.removeItem('token');
        console.log(localStorage.getItem('token'));
      }
      console.error("API Error", err.response);
      let message = err.response.data.error.message;
      // always throw error messages in an array
      throw Array.isArray(message) ? message : [message];
    }
  }

  // auth routes

  /** Sign up a new user, set localStorage token,  */
  static async signup(email, username, password) {
    // console.log(email, username, password);
    const data = await this.request('auth/signup', {email, username, password}, 'POST');
    // console.log(data);
    this.#token = data.token;
    localStorage.setItem('token', data.token);
    return jwt.decode(this.#token);
  }

  /** Login a user, set localStorage token */
  static async login(username, password) {
    const data = await this.request('auth/login', {username, password}, 'POST');
    this.#token = data.token;
    localStorage.setItem('token', data.token);
    return jwt.decode(this.#token);
  }

  /** */
  static async logout() {

  }

  /** Get comic by number */
  static async getComic(comic_num) {
    const data = await this.request(`comics/${comic_num}`);
    return data;
  }

  /** Get random comic */
  static async getRandomComic() {
    const data = await this.request('comics/random');
    return data;
  }

  /** Get last comic (number unknown) */
  static async getLastComic() {
    const data = await this.request('comics/current');
    return data;
  }

  /** Add an upvote to a comic */
  static async addUpvote(comic_num) {
    const data = await this.request(`comics/upvote/${comic_num}`, {}, 'POST');
    return data;
  }

  /** Remove an upvote from a comic */
  static async removeUpvote(comic_num) {
    const data = await this.request(`comics/upvote/${comic_num}`, {}, 'DELETE');
    return data;
  }

  /** Favorite a comic */
  static async addFavorite(comic_num) {
    const data = await this.request(`comics/favorite/${comic_num}`, {}, 'POST');
    return data;
  }

  /** Unfavorite a comic */
  static async removeFavorite(comic_num) {
    const data = await this.request(`comics/favorite/${comic_num}`, {}, 'DELETE');
    return data;
  }

  /** Get user favorites */
  static async getFavorites() {
    const data = await this.request('comics/favorites');
    return data;
  }

  /** Get all upvoted comics ranked by upvotes */
  static async getPopular() {
    const data = await this.request('comics/popular');
    return data;
  }

}


export default xkcdAPI;