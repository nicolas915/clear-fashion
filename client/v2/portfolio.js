// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
/*const initialize = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const Allproducts= await fetch(
        `https://clear-fashion-api.vercel.app?size=200`);
        const brands = {}; //final dic
        const brand_name = []; //list with all brand names

        for (let i = 0; i < Allproducts.result.length; i++) {
          brand_name.push( Allproducts.result[i].brand);
        }

        var unique = brand_name.filter((value, index, a) => a.indexOf(value) === index); //contains all distinct brands names
        unique.forEach((element) => create_dic(element));

        function create_dic(brand_name) {
          brands[brand_name] = [];
        }

        for (let i = 0; i <  Allproducts.result.length; i++) {
          brands[Allproducts.result[i].brand].push(Allproducts.result[i]);
        }
      resolve(brands)
    }
    catch (error) {
      console.log('ERROR with promise')
      reject(error);
    }
  })
}

let brands = await initialize()*/

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectBrand = document.querySelector('#brand-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12, brand = null) => {
  try {
    let response = await fetch(
      
      `https://clear-fashion-j1g30766w-nicolas915.vercel.app?page=${page}&size=${size}`);
    let body = await response.json();
    if(brand)
    {
      console.log("je suis dans fetch")
      response = await fetch(
        `https://clear-fashion-api.vercel.app?size=200`);
      body = await response.json();
      //body.data=filter_function(body.data,brand)
    }
  
    
    console.log('DEBUG',response)
    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * 
 * @param {
 * } products 
 */

const filter_function =(Allproducts,brand)=>{
  const brands = {}; //final dic
  const brand_name = []; //list with all brand names

  for (let i = 0; i < Allproducts.result.length; i++) {
    brand_name.push( Allproducts.result[i].brand);
  }

  var unique = brand_name.filter((value, index, a) => a.indexOf(value) === index); //contains all distinct brands names
  unique.forEach((element) => create_dic(element));

  function create_dic(brand_name) {
    brands[brand_name] = [];
  }

  for (let i = 0; i <  Allproducts.result.length; i++) {
    brands[Allproducts.result[i].brand].push(Allproducts.result[i]);
  }
  Allproducts.result=brands[brand]
  return Allproducts
}

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;
  console.log(pagination);

  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
  //console.log("PRODUCT",products)
});

selectBrand.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, currentProducts.currentPage,true);
  products.result=filter_function(products,event.target.value).result
  products.meta.count=products.result.length
  products.meta.pageCount=parseInt(products.result.length/selectShow);
  products.meta.pageSize=selectShow;

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});
