const { next } = require('cheerio/lib/api/traversing');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./db');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/products/:id', async (request, response, next) => {
  if(request.params.id != "search"){
    const fetch = await db.find({'_id': request.params.id});
    response.send(fetch[0]);
    console.log(request.params)
    console.log(request.query)
  }
  else{
    next()
  }
});

app.get('/products/search', async (request, response) => {
  let dic = {}
  let limit = 12
  if(request.query.brand){
    dic["brand"] = request.query.brand
  }
  if(request.query.price){
    dic["price"] = {"$lt":parseFloat(request.query.price)}
  }
  if(request.query.limit){
    limit = request.query.limit
  }
  const search = await db.find(dic);
  response.send(search.sort((a,b) => (a.price>b.price)?1:-1).slice(0, limit));
  console.log(request.params)
  console.log(request.query)
  
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
