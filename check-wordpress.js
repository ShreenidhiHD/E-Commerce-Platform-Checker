const axios = require("axios");
const cheerio = require("cheerio");

const checkWordPress = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    if ($("meta[name='generator'][content*='WordPress']").length) {
      return { platform: "WordPress", detectedElement: "WordPress generator meta tag" };
    }

    if ($("link[rel='https://api.w.org/']").length) {
      return { platform: "WordPress", detectedElement: "WordPress API link" };
    }

    if ($("script[src*='wp-content']").length) {
      return { platform: "WordPress", detectedElement: "wp-content script" };
    }

    return { platform: "Unknown", detectedElement: "" };
  } catch (error) {
    return { platform: "Error", detectedElement: "" };
  }
};

module.exports = checkWordPress;
