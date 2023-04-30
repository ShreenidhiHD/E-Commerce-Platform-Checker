const fs = require("fs");
const checkWordPress = require("./check-wordpress");
const checkWooCommerce = require("./check-woocommerce");
const checkShopify = require("./check-shopify");

const inputFilePath = "input.txt";
const outputFilePath = "output.csv";

const readUrlsFromFile = async (filePath) => {
  try {
    const fileContent = await fs.promises.readFile(filePath, "utf-8");
    return fileContent.split("\n").filter((url) => url.trim());
  } catch (error) {
    console.error("Error reading the input file:", error);
    return [];
  }
};

const writeOutputToFile = async (filePath, output) => {
  try {
    await fs.promises.appendFile(filePath, output);
  } catch (error) {
    console.error("Error writing to the output file:", error);
  }
};

const checkUrls = async () => {
  console.log("Starting to check URLs...");

  const urls = await readUrlsFromFile(inputFilePath);
  console.log(`Checking ${urls.length} URLs...`);

  // Overwrite the output file with CSV headers
  await fs.promises.writeFile(outputFilePath, "Serial Number,Website URL,Platform,Details\n");

  let serialNumber = 1;

  for (const url of urls) {
    let formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    console.log(`${serialNumber}. Checking URL: ${formattedUrl}`);

    let platformResult = await checkWordPress(formattedUrl);

    if (platformResult.platform === "WordPress") {
      const woocommerceResult = await checkWooCommerce(formattedUrl);
      if (woocommerceResult.platform === "WooCommerce") {
        platformResult = woocommerceResult;
      }
    } else {
      platformResult = await checkShopify(formattedUrl);
    }

    if (platformResult.platform === "Error" &&
      (platformResult.detectedElement.includes("getaddrinfo") ||
        platformResult.detectedElement.includes("ESOCKETTIMEDOUT"))) {
      formattedUrl = url.startsWith("http") ? url : `https://www.${url}`;
      console.log(`Retrying with www: ${formattedUrl}`);
      platformResult = await checkWordPress(formattedUrl);

      if (platformResult.platform === "WordPress") {
        const woocommerceResult = await checkWooCommerce(formattedUrl);
        if (woocommerceResult.platform === "WooCommerce") {
          platformResult = woocommerceResult;
        }
      } else {
        platformResult = await checkShopify(formattedUrl);
      }
    }

    // Update platform name and format output string
    const platform = platformResult.platform === "Unknown" ? "None of the above" : platformResult.platform;
    const output = `${serialNumber},"${formattedUrl}","${platform}","${platformResult.detectedElement}"\n`;

    // Print output to console
    console.log(`${serialNumber}. Checking URL: ${formattedUrl}\n: ${platform} ${url}`);

    try {
      await writeOutputToFile(outputFilePath, output);
    } catch (error) {
      console.error(`Error writing to the output file for ${formattedUrl}:`, error);
    }

    serialNumber++;
  }

  console.log("Finished checking URLs.");
};

checkUrls();
