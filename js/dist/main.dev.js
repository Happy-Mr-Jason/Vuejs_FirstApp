"use strict";

var eventBus = new Vue();
Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: "\n    <div class=\"product\">\n      \n      <div class=\"product-image\">\n        <!-- Data Binding Same to : <img :src=\"image\"> -->\n        <img v-bind:src=\"image\">\n      </div>\n      \n      <div class=\"product-info\">\n        <h1>{{ title }} </h1>\n        <p v-if=\"inventory > 10\">In Stock</p>\n        <p v-else-if=\"inventory <= 10 && inventory > 0\">Almost sold out</p>\n        <p v-else>Out of Stock</p>\n        <p>Shipping :  {{ shipping }}</p>\n        <ul>\n          <li v-for=\"detail in details\">\n            {{ detail }}\n          </li>\n        </ul>\n    \n        <!-- :style=\"{'background-color' : variant.variantColor}\" -->\n        <div v-for=\"(variant, index) in variants\"\n            :key=\"variant.variantId\"\n            class=\"color-box\"\n            :style=\"{backgroundColor : variant.variantColor}\"\n            @mouseover=\"updateProduct(index)\">\n          <!-- Event using Modifier -->\n          <!-- <p @mouseover=\"updateProduct(variant.variantImage)\">{{variant.variantColor}}</p> -->\n        </div>\n\n        <!-- to Modifier -->\n        <!-- <button @click=\"addToCart\">Add to Cart</button> -->\n        <!-- Bind a class :class -->\n        <button v-on:click=\"addToCart\"\n        :disabled=\"!inStock\" \n        :class=\"{disabledButton : !inStock}\">Add to Cart\n        </button>\n    \n      </div>\n\n      <product-tabs :reviews=\"reviews\"></product-tabs>\n      \n    </div>\n",
  data: function data() {
    return {
      brand: 'Vue Mastery',
      product: 'Socks',
      selectedVariant: 0,
      // image: '../img/vmSocks-green-onWhite.jpg',
      // inStock: false,
      inventory: 100,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      variants: [{
        variantId: 2234,
        variantColor: "green",
        variantImage: '../img/vmSocks-green-onWhite.jpg',
        variantQuantity: 10
      }, {
        variantId: 2235,
        variantColor: "blue",
        variantImage: '../img/vmSocks-blue-onWhite.jpg',
        variantQuantity: 0
      }],
      reviews: []
    };
  },
  methods: {
    addToCart: function addToCart() {
      // this.cart += 1
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
    },
    updateProduct: function updateProduct(index) {
      this.selectedVariant = index; // console.log(index)
    }
  },
  computed: {
    title: function title() {
      return this.brand + ' ' + this.product;
    },
    image: function image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock: function inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    shipping: function shipping() {
      if (this.premium) {
        return "Free";
      }

      return 2.99;
    }
  },
  mounted: function mounted() {
    var _this = this;

    eventBus.$on('review-submitted', function (productReview) {
      _this.reviews.push(productReview);
    });
  }
});
Vue.component('product-review', {
  template: "\n  <form class=\"review-form\" @submit.prevent=\"onSubmit\">\n    <p v-if=\"errors.length\">\n      <b>Please correct the following error(s):</b>\n      <ul>\n        <li v-for=\"error in errors\">{{error}}</li>\n      </ul>\n    </p>\n\n    <p>\n      <label for=\"name\">Name:</label>\n      <input id=\"name\" v-model=\"name\">\n    </p>\n\n    <p>\n      <label for=\"review\">Review:</label>\n      <textarea id=\"review\" v-model=\"review\"></textarea>\n    </p>\n\n    <p>\n      <label for=\"rating\">Rating:</label>\n      <select id=\"rating\" v-model.number=\"rating\">\n        <option>5</option>\n        <option>4</option>\n        <option>3</option>\n        <option>2</option>\n        <option>1</option>\n      </select>\n    </p>\n\n    <p>\n      <input type=\"submit\" value=\"Submit\">\n    </p>\n\n  </form>\n  ",
  data: function data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: []
    };
  },
  methods: {
    onSubmit: function onSubmit() {
      if (this.name && this.review && this.rating) {
        var productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating
        };
        eventBus.$emit('review-submitted', productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.errors = [];
      } else {
        this.errors = [];
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.rating) this.errors.push("Rating required.");
      }
    }
  }
});
Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: "\n    <div>\n      <span class=\"tab\"\n          :class=\"{ activeTab: selectedTab === tab }\"\n          v-for=\"(tab, index) in tabs\"\n          :key=\"index\"\n          @click=\"selectedTab = tab\">\n          {{ tab }}\n      </span>\n\n      <div v-show=\"selectedTab === 'Reviews'\">\n        <p v-if=\"!reviews.length\">There are no reviews yet.</p>\n        <ul>\n          <li v-for=\"review in reviews\">\n          <p> {{ review.name }} </p>\n          <p>Rating: {{ review.rating }} </p>\n          <p> {{ review.review }} </p>\n          </li>\n        </ul>\n      </div>\n\n      <product-review v-show=\"selectedTab === 'Make a Review'\"\n      ></product-review>\n\n    </div>\n  ",
  data: function data() {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews'
    };
  }
});
var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart: function updateCart(id) {
      this.cart.push(id);
    }
  }
});