<template>
  <Page>
    <RCard class="section-centered">
      <h2>Robonomics subscribe</h2>
      <section v-if="currentPrice > 0">
        <select v-model="type" class="container-full">
          <option value="1">XRT</option>
          <option value="2">DAI</option>
          <option value="3">ETH</option>
        </select>
        <hr />
        <XRT v-if="type == 1" :currentPrice="currentPrice" />
        <DAI v-if="type == 2" :currentPrice="currentPrice" />
        <ETH v-if="type == 3" :currentPrice="currentPrice" />
      </section>
    </RCard>
  </Page>
</template>

<script>
import Page from "@/components/layout/Page";
import XRT from "@/components/XRT";
import DAI from "@/components/DAI";
import ETH from "@/components/ETH";
import config from "../config";
import SubscribeABI from "../abi/Subscribe.json";

export default {
  components: { Page, XRT, DAI, ETH },
  created() {
    this.getCurrentPrice();
  },
  data() {
    return {
      type: 1,
      currentPrice: 0
    };
  },
  methods: {
    getCurrentPrice() {
      const contract = new this.$web3.eth.Contract(
        SubscribeABI,
        config.SUBSCRIBE
      );
      return contract.methods
        .currentPrice()
        .call()
        .then(r => {
          this.currentPrice = Math.ceil(
            Number(r) + (Number(r) * config.OVER_PERCENT) / 100
          ).toString();
        });
    }
  }
};
</script>
