import Vue from "vue";
import robonomicsVC from "robonomics-vc";
import "robonomics-vc/dist/robonomics-vc.css";

Vue.use(robonomicsVC);

Vue.filter("urlChainExplorer", robonomicsVC.filters.urlChainExplorer);
Vue.filter("urlIpfsExplorer", robonomicsVC.filters.urlIpfsExplorer);
