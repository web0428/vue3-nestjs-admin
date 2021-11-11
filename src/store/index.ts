import { createStore } from 'vuex';

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user') as string)
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    }
  },
  actions: {
    setUser(context, user) {
      localStorage.setItem('user', JSON.stringify(user));
      context.commit('setUser', user)
    }
  },
  modules: {
  },
});
