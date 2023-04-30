const axios = require("axios");
const cheerio = require("cheerio");

const checkWooCommerce = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    if ($("body").hasClass("woocommerce") || $("body").hasClass("woocommerce-page")) {
      return { platform: "WooCommerce", detectedElement: "woocommerce body class" };
    }

    if ($("link[rel='stylesheet'][href*='woocommerce']").length) {
      return { platform: "WooCommerce", detectedElement: "woocommerce stylesheet" };
    }

    return { platform: "Unknown", detectedElement: "" };
  } catch (error) {
    return { platform: "Error", detectedElement: "" };
  }
};

module.exports = checkWooCommerce;
