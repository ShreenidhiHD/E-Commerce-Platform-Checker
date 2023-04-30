#-**E-Commerce Platform Checker**
The E-Commerce Platform Checker is a Node.js script that checks a list of websites and identifies the e-commerce platform being used. The script reads a list of websites from a file called input.txt and outputs the results to a CSV file called output.csv.

Installation
To use this script, you need to have Node.js installed on your computer.

Clone the repository or download the ZIP file.
Navigate to the project directory using a command line interface.
Install the required dependencies by running npm install.
Usage
Add the list of websites that you want to check to the input.txt file.
Run the script by running node index command in your command line interface.
The results will be saved to the output.csv file.
Output
The output.csv file will contain the following columns:

Serial Number
Website URL
Platform
Details
The Details column will contain additional information about the detected e-commerce platform.

Supported Platforms
The script currently supports the following e-commerce platforms:

WordPress
WooCommerce
Shopify
If the script is unable to detect any of these platforms, it will output "None of the above" in the Platform column.

Notes
The script will automatically add "https://" to the URL if it is missing.
If the initial check of a website results in an error, the script will retry with the "www" subdomain before marking it as "None of the above".
If a website is unable to be checked due to an error, the Details column will contain information about the error.
