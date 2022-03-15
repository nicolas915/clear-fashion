const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parseDedicated = data => {
  const $ = cheerio.load(data);

  return $('.productList-container .productList')
    .map((i, element) => {
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      );

      return {name, price};
    })
    .get();
};

const parseMontlimart = data => {
  const $ = cheerio.load(data);

  return $('.category-products .product-info')
    .map((i, element) => {
      const name = $(element)
        .find('.product-name')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.regular-price')
          .text()
      );

      return {name, price};
    })
    .get();
};

const parseAdresse = data => {
  const $ = cheerio.load(data);

  return $('.product-container .right-block')
    .map((i, element) => {
      const name = $(element)
        .find('.product-reference')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.content_price')
          .text()
      );

      return {name, price};
    })
    .get();
};
/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const body = await response.text();
      if(url[12]=='m'){
        return parseMontlimart(body);
      }
      if(url[12]=='d'){
        return parseDedicated(body);
      }
      if(url[8]=='a'){
        return parseAdresse(body);
      }
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
