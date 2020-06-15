<template>
  <div>
    <RButton
      size="big"
      fullWidth
      @click="run"
      :disabled="proccess > 0 || (step1 && step2)"
      style="margin-bottom:25px"
    >
      <div class="loader-ring" v-if="proccess > 0"></div>&nbsp;Subscribe
    </RButton>
    <p>
      <b>Price</b>
      : {{ priceInDAIView }} DAI
    </p>
    <p>
      <b>Approve</b>:
      <span v-if="step1">+</span>
      <span v-else>-</span>
    </p>
    <p>
      <b>Subscribe</b>:
      <span v-if="step2">+</span>
      <span v-else>-</span>
    </p>
    <p v-if="proccess === 3">Success</p>
    <p v-if="tx">
      <b>Watch Tx:&nbsp;</b>
      <a :href="`https://etherscan.io/tx/${tx}`" target="_blank">{{ tx }}</a>
    </p>
  </div>
</template>

<script>
import config from "../config";
import TokenABI from "../abi/Token.json";
import SubscribeABI from "../abi/Subscribe.json";

const STATUS = {
  EMPTY: 0,
  BTN: 1,
  TX: 2,
  SUCCESS: 3
};

export default {
  async created() {
    await this.getPriceInDAI();
    await this.getAllowance();
  },
  data() {
    return {
      step1: false,
      step2: false,
      priceInDAI: 0,
      priceInDAIView: 0,
      allowance: 0,
      proccess: STATUS.EMPTY,
      tx: null
    };
  },
  methods: {
    getPriceInDAI() {
      const contract = new this.$web3.eth.Contract(
        SubscribeABI,
        config.SUBSCRIBE
      );
      return contract.methods
        .priceInDAI()
        .call()
        .then(r => {
          this.priceInDAI = Math.ceil(
            Number(r) + (Number(r) * config.OVER_PERCENT) / 100
          ).toString();
          this.priceInDAIView = this.$web3.utils.fromWei(this.priceInDAI);
        });
    },
    getAllowance() {
      const contract = new this.$web3.eth.Contract(TokenABI, config.DAI);
      return contract.methods
        .allowance(this.$account, config.SUBSCRIBE)
        .call()
        .then(r => {
          this.allowance = r;
          if (Number(this.allowance) >= Number(this.priceInDAI)) {
            this.step1 = true;
          } else if (!this.step2) {
            this.step1 = false;
          }
        });
    },
    run() {
      if (this.step1 === false) {
        this.approve();
      } else if (this.step2 === false) {
        this.subscribe();
      }
    },
    approve() {
      this.proccess = STATUS.BTN;
      const contract = new this.$web3.eth.Contract(TokenABI, config.DAI);
      return contract.methods
        .approve(config.SUBSCRIBE, this.priceInDAI)
        .send(
          {
            from: this.$account
          },
          (error, transactionHash) => {
            if (error) {
              return;
            }
            this.proccess = STATUS.TX;
            this.tx = transactionHash;
          }
        )
        .then(() => {
          setTimeout(() => {
            this.getAllowance();
            this.tx = null;
            this.proccess = STATUS.SUCCESS;
            this.subscribe();
          }, 3000);
        })
        .catch(() => {
          this.proccess = STATUS.EMPTY;
        });
    },
    subscribe() {
      this.proccess = STATUS.BTN;
      const contract = new this.$web3.eth.Contract(
        SubscribeABI,
        config.SUBSCRIBE
      );
      return contract.methods
        .subscribe(Math.round(Date.now() / 1000 + 1000 * 60 * 24))
        .send({ from: this.$account }, (error, transactionHash) => {
          if (error) {
            return;
          }
          this.proccess = STATUS.TX;
          this.tx = transactionHash;
        })
        .then(() => {
          setTimeout(() => {
            this.getAllowance();
            this.tx = null;
            this.step2 = true;
            this.proccess = STATUS.SUCCESS;
            setTimeout(() => {
              this.proccess = STATUS.EMPTY;
            }, 3000);
          }, 3000);
        })
        .catch(() => {
          this.proccess = STATUS.EMPTY;
        });
    }
  }
};
</script>
