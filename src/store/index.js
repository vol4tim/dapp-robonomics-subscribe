import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger";
import chain from "./modules/chain";

Vue.use(Vuex);

const debug = false;

export default new Vuex.Store({
  modules: {
    chain
  },
  strict: true, // debug,
  plugins: debug ? [createLogger()] : [],
});
