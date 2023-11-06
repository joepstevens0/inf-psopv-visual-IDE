import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Logger from "@/util/logger";

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    status: "",
    token: localStorage.getItem("token") || "",
    user: {},
    username: localStorage.getItem("username") || "",
    isAdmin: localStorage.getItem("isAdmin") == "true" || false
  },
  mutations: {
    authRequest(state) {
      state.status = "loading";
    },
    authSuccess(state, payload) {
      state.status = "success";
      state.token = payload.token;
      //state.user = user
      state.username = payload.username;
      state.isAdmin = payload.isAdmin;
    },
    authError(state) {
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.token = "";
      state.username = "";
      state.isAdmin = false;
    }
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("authRequest");
        axios({
          url: "http://" + window.location.hostname + ":3000/login",
          data: user,
          method: "POST"
        })
          .then(resp => {
            const token = resp.data.token;
            const user = resp.data.user;
            const isAdmin = user.admin == 1 ? true : false;
            const response = {
              token: token,
              username: user.username,
              isAdmin: isAdmin
            };
            localStorage.setItem("token", token);
            localStorage.setItem("username", user.username);
            localStorage.setItem("isAdmin", isAdmin);
            // Add the following line:
            axios.defaults.headers.common["Authorization"] = token;
            commit("authSuccess", response);
            resolve(resp);
          })
          .catch(err => {
            commit("authError");
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("isAdmin");
            reject(err);
          });
      });
    },
    register({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("authRequest");
        axios({
          url: "http://" + window.location.hostname + ":3000/register",
          data: user,
          method: "POST"
        })
          .then(resp => {
            const token = resp.data.token;
            const user = resp.data.user;
            const isAdmin = user.admin == 1 ? true : false;
            const response = {
              token: token,
              username: user.username,
              isAdmin: isAdmin
            };
            localStorage.setItem("token", token);
            localStorage.setItem("username", user.username);
            localStorage.setItem("isAdmin", isAdmin);
            // Add the following line:
            axios.defaults.headers.common["Authorization"] = token;
            commit("authSuccess", response);
            resolve(resp);
          })
          .catch(err => {
            commit("authError", err);
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("isAdmin");
            reject(err);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit("logout");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("isAdmin");
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    },
    save({ commit }, project) {
      Logger.info("sending save data to server...");
      return new Promise((resolve, reject) => {
        //commit('authRequest')
        axios({
          url: "http://" + window.location.hostname + ":3000/project",
          data: project,
          method: "PUT"
        })
          .then(resp => {
            Logger.info("save success");
            resolve(resp);
          })
          .catch(err => {
            Logger.error("save error: ", err);
            commit("authError", err);
            if (
              typeof err.response !== "undefined" &&
              typeof err.response.data !== "undefined" &&
              typeof err.response.data.name !== "undefined"
            ) {
              // jwt error -> logout and ask for re-authentication
              commit("logout");
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              localStorage.removeItem("isAdmin");
              delete axios.defaults.headers.common["Authorization"];
            }
            reject(err);
          });
      });
    },
    saveAs({ commit }, project) {
      Logger.info("sending save data to server...");
      return new Promise((resolve, reject) => {
        //commit('authRequest')
        axios({
          url: "http://" + window.location.hostname + ":3000/project",
          data: project,
          method: "POST"
        })
          .then(resp => {
            Logger.info("save success");
            resolve(resp);
          })
          .catch(err => {
            Logger.error("save error: ", err);
            commit("authError", err);
            if (
              typeof err.response !== "undefined" &&
              typeof err.response.data !== "undefined" &&
              typeof err.response.data.name !== "undefined"
            ) {
              // jwt error -> logout and ask for re-authentication
              commit("logout");
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              localStorage.removeItem("isAdmin");
              delete axios.defaults.headers.common["Authorization"];
            }
            reject(err);
          });
      });
    },
    load({ commit }) {
      return new Promise((resolve, reject) => {
        commit("authRequest");
        axios({
          url: "http://" + window.location.hostname + ":3000/project",
          method: "GET"
        })
          .then(resp => {
            resolve(resp);
          })
          .catch(err => {
            commit("authError", err);
            if (
              typeof err.response !== "undefined" &&
              typeof err.response.data !== "undefined" &&
              typeof err.response.data.name !== "undefined"
            ) {
              // jwt error -> logout and ask for re-authentication
              commit("logout");
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              localStorage.removeItem("isAdmin");
              delete axios.defaults.headers.common["Authorization"];
            }
            reject(err);
          });
      });
    },
    deleteproject({ commit }, project) {
      return new Promise((resolve, reject) => {
        //commit('authRequest')
        axios({
          url: "http://" + window.location.hostname + ":3000/project",
          data: project,
          method: "DELETE"
        })
          .then(resp => {
            //console.log(resp)
            resolve(resp);
          })
          .catch(err => {
            //commit('authError', err)
            if (
              typeof err.response !== "undefined" &&
              typeof err.response.data !== "undefined" &&
              typeof err.response.data.name !== "undefined"
            ) {
              // jwt error -> logout and ask for re-authentication
              commit("logout");
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              localStorage.removeItem("isAdmin");
              delete axios.defaults.headers.common["Authorization"];
            }
            reject(err);
          });
      });
    },
    share({ commit }, project) {
      return new Promise((resolve, reject) => {
        //commit('authRequest')
        axios({
          url: "http://" + window.location.hostname + ":3000/shared/project",
          data: project,
          method: "POST"
        })
          .then(resp => {
            //console.log(resp)
            resolve(resp);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    loadshared({ commit }, project) {
      return new Promise((resolve, reject) => {
        //commit('authRequest')
        axios({
          url: "http://" + window.location.hostname + ":3000/shared/project",
          params: project,
          method: "GET"
        })
          .then(resp => {
            resolve(resp);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    savetutorial({ commit }, tutorial) {
      return new Promise((resolve, reject) => {
        //commit('authRequest')
        axios({
          url: "http://" + window.location.hostname + ":3000/tutorial",
          data: tutorial,
          method: "POST"
        })
          .then(resp => {
            //console.log(resp)
            resolve(resp);
          })
          .catch(err => {
            if (
              typeof err.response !== "undefined" &&
              typeof err.response.data !== "undefined" &&
              typeof err.response.data.name !== "undefined"
            ) {
              // jwt error -> logout and ask for re-authentication
              commit("logout");
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              localStorage.removeItem("isAdmin");
              delete axios.defaults.headers.common["Authorization"];
            }
            reject(err);
          });
      });
    },
    loadtutorials({ commit }) {
      return new Promise((resolve, reject) => {
        //commit('authRequest')
        axios({
          url: "http://" + window.location.hostname + ":3000/tutorial",
          method: "GET"
        })
          .then(resp => {
            resolve(resp);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    updatetutorial({ commit }, tutorial) {
      return new Promise((resolve, reject) => {
        //commit('authRequest')
        axios({
          url: "http://" + window.location.hostname + ":3000/tutorial",
          data: tutorial,
          method: "PUT"
        })
          .then(resp => {
            //console.log(resp)
            resolve(resp);
          })
          .catch(err => {
            if (
              typeof err.response !== "undefined" &&
              typeof err.response.data !== "undefined" &&
              typeof err.response.data.name !== "undefined"
            ) {
              // jwt error -> logout and ask for re-authentication
              commit("logout");
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              localStorage.removeItem("isAdmin");
              delete axios.defaults.headers.common["Authorization"];
            }
            reject(err);
          });
      });
    },
    deletetutorial({ commit }, tutorial) {
      return new Promise((resolve, reject) => {
        //commit('authRequest')
        axios({
          url: "http://" + window.location.hostname + ":3000/tutorial",
          data: tutorial,
          method: "DELETE"
        })
          .then(resp => {
            //console.log(resp)
            resolve(resp);
          })
          .catch(err => {
            //commit('authError', err)
            if (
              typeof err.response !== "undefined" &&
              typeof err.response.data !== "undefined" &&
              typeof err.response.data.name !== "undefined"
            ) {
              // jwt error -> logout and ask for re-authentication
              commit("logout");
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              localStorage.removeItem("isAdmin");
              delete axios.defaults.headers.common["Authorization"];
            }
            reject(err);
          });
      });
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    username: state => state.username,
    isAdmin: state => state.isAdmin
  }
});
