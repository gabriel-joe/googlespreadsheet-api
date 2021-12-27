const {google} = require('googleapis');
const dotenv = require('dotenv')
const result = dotenv.config()
const authorize = require('./services/authorize');
const addService = require('./services/add');
const readService = require('./services/read');
const marketService = require('./services/market');
const checkStockService = require('./services/checkStock');
const pathRead = '/read'
const pathAdd = '/add'
const pathMarket = '/market'

if (result.error) {
  throw result.error
}

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/spreadsheetid', async (req, res) => {
  res.send(process.env.SPREADSHEET_ID);
});

app.post(`${pathRead}/balanceMonth`, async (req, res) => {
  console.log('------------- balanceMonth ------------')
  console.log(req.body)
  await authorize.authorizeAndExecute(readService.readBalanceMonth, req.body).then(result => {
    res.status(200).send(result)
  })
  .catch(e => {
    res.status(500).send(e)
  });
  console.log('--------------------------')
});

app.post(`${pathRead}/balanceMonthType`, async (req, res) => {
  console.log('------------- balanceMonthType ------------')
  console.log(req.body)
  await authorize.authorizeAndExecute(readService.readBalanceMonthType, req.body).then(result => {
    res.status(200).send(result)
  })
  .catch(e => {
    res.status(500).send(e)
  });
  console.log('--------------------------')
});

app.post(`${pathRead}/comparableBalanceMonthType`, async (req, res) => {
  console.log('------------- comparableBalanceMonthType ------------')
  console.log(req.body)
  await authorize.authorizeAndExecute(readService.readComparableBalanceMonthType, req.body).then(result => {
    res.status(200).send(result)
  })
  .catch(e => {
    res.status(500).send(e)
  });
  console.log('--------------------------')
});

app.post(`${pathRead}/savingsMonth`, async (req, res) => {
  console.log('------------- Read Savings month ------------')
  console.log(req.body)
  await authorize.authorizeAndExecute(readService.readSavingsMonth, req.body).then(result => {
    res.status(200).send(result)
  })
  .catch(e => {
    res.status(500).send(e)
  });
  console.log('--------------------------')
});

app.post(`${pathAdd}/addValues`, async (req, res) => {
  console.log('------------- addValues ------------')
  console.log(req.body)
  await authorize.authorizeAndExecute(addService.addValue, req.body).then(result => {
    res.status(200).send(result)
  })
  .catch(e => {
    res.status(500).send(e);
  });
  console.log('--------------------------')
});

app.post(`${pathAdd}/addDefaultValue`, async (req, res) => {
  console.log('------------- addDefaultValue ------------')
  console.log(req.body)
  await authorize.authorizeAndExecute(addService.addDefaultValue, req.body).then(result => {
    res.status(200).send(result)
  })
  .catch(e => {
    res.status(500).send(e);
  });
  console.log('--------------------------')
});

app.post(`${pathMarket}/sendList`, async (req, res) => {
  console.log('------------- sendList ------------')
  console.log(req.body)
  await authorize.authorizeAndExecute(marketService.listRemainMarketOptions, req.body).then(result => {
    res.status(200).send(result)
  })
  .catch(e => {
    res.status(500).send(e);
  });
  console.log('--------------------------')
});

//checkStockService.checkStock();

app.listen(5000, (err) => {
  console.log('Listening on port 5000');
});

