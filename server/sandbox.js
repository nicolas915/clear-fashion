/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const brand = require("./brands.json");
const { testElement } = require('domutils');
const fs = require("fs");

async function sandbox (eshop) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await dedicatedbrand.scrape(eshop);
    return products
    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

let [,, eshop] = process.argv;
console.log(brand);
if (eshop){
  sandbox(eshop);
}
else{
  for(let i = 0; i<brand.length; i++){
    test(brand, i)    
  }
}

async function test(brand, i){
  try{
    if (brand[i].link){
      eshop = brand[i].link;
      let product = await sandbox(eshop)
      fs.writeFile(`${brand[i].brand}.json`, JSON.stringify(product), function(err){
        if(err) throw err;
        console.log('Fichier fait');
      })
      console.log(product)
      //await sandbox(eshop);
    }
  }
  catch(e)
  {
    console.log(e);
  }
}
