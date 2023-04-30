const axios = require("axios");
const cheerio = require("cheerio");

const checkShopify = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Check for cdn.shopify.com first
    if (
      $("script[src*='cdn.shopify.com']").length ||
      $("link[href*='cdn.shopify.com']").length
    ) {
      return { platform: "Shopify", detectedElement: "cdn.shopify.com" };
    }

    // Check for other Shopify indicators
    if (
      response.data.toLowerCase().includes("shopify") ||
      Object.keys(response.headers).some((header) =>
        header.toLowerCase().startsWith("x-shopify")
      ) ||
      $("meta[property='og:platform']").attr("content") === "Shopify"
    ) {
      return { platform: "Shopify", detectedElement: "Shopify keyword or header" };
    }

    return { platform: "Unknown", detectedElement: "" };
  } catch (error) {
    return { platform: "Error", detectedElement: "" };
  }
};

module.exports = checkShopify;
