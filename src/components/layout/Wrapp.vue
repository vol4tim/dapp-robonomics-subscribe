<template>
  <fragment>
    <slot />
  </fragment>
</template>

<script>
import Vue from "vue";

export default {
  props: ["account", "web3"],
  watch: {
    account(account, old) {
      if (old !== null && account !== old) {
        window.location.reload(false);
      }
    },
  },
  created() {
    Vue.prototype.$account = this.account;
    Vue.prototype.$web3 = this.web3;
  },
};
</script>
