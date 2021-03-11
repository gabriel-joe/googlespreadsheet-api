const {google} = require('googleapis');
const dotenv = require('dotenv')
const result = dotenv.config()
const common = require('./common');

if (result.error) {
  throw result.error
}

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorizeAndExecute(callback, params) {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.API_KEY_PATH,
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });
  return await callback(auth, params).catch(e => {
    console.error(e);
    throw e;
  });;
}

function validateFields(params) {
  if(!params.date)
      throw 'Date is required'
  if(!params.paymentType)
      throw 'Payment type is required'
  if(!params.type)
      throw 'Type is required'
  if(!params.value)
      throw 'Value is required'
  if(!params.description)
      throw 'Description is required'

  let expense = {
    month: formatDateMMYYYY(params.date),
    paymentType: common.paymentTypeArray[params.paymentType],
    type: common.typeCastArray[params.type],
    value: Number(params.value),
    description: params.description,
    date: params.date
  }
  return expense;

}

function formatDateMMYYYY(dateValue) {
  const date = new Date(dateValue);
  return `${common.monthArray[date.getMonth()]}/${date.getFullYear()}`
}


async function appendRow(sheets) {
  const res = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: process.env.SPREADSHEET_ID,
    resource: {
      requests: [
        {
          insertDimension: {
            range: {
              dimension: 'ROWS',
              startIndex: 24,
              endIndex: 25,
            },
            inheritFromBefore: true,
          },
        },
      ],
    },
  });
  console.log(res.data);
  return res.data;
}
async function addValue(auth, params) {
  const sheets = google.sheets({version: 'v4', auth: auth});
  await appendRow(sheets).catch(e => { throw e });
  let expense = validateFields(params);
  const res = await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: 'Per Month!A25:F25',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      range: 'Per Month!A25:F25',
      values: [
        [expense.month, expense.paymentType, expense.description, expense.value, expense.date, expense.type]
      ],
    },
  }).catch(e => {
    console.log(e);
    throw e;
  });
  return res.data;
}

async function readBalanceMonth(auth, params) {
  const sheets = google.sheets({version: 'v4', auth: auth});
  let fullDate = formatDateMMYYYY(params.date);
  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: process.env.SPREADSHEET_ID,
    ranges: 'Per Month!A3:F17',
  }).catch(e => {
    console.log(e);
    throw e;
  });
  let value = 0;
  res.data.valueRanges[0].values.forEach(item => {
    if(item[0] == fullDate)
      value = item[5].replace("€","").replace(" ", "");
  })
  return { "value": value };
}

async function readSavingsMonth(auth, params) {
  const sheets = google.sheets({version: 'v4', auth: auth});
  let fullDate = formatDateMMYYYY(params.date);
  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: process.env.SPREADSHEET_ID,
    ranges: 'Per Month!A3:F17',
  }).catch(e => {
    console.log(e);
    throw e;
  });
  let value = 0;
  res.data.valueRanges[0].values.forEach(item => {
    if(item[0] == fullDate)
      value = item[2].replace("€","").replace(" ", "");
  })
  return { "value": value };
}

async function readBalanceMonthType(auth, params) {
  const sheets = google.sheets({version: 'v4', auth: auth});
  let fullDate = formatDateMMYYYY(params.date);
  let type = common.typeCastArray[params.type]
  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: process.env.SPREADSHEET_ID,
    ranges: 'Per Month!A23:F1000',
  }).catch(e => {
    console.log(e);
    throw e;
  });
  let value = 0;
  res.data.valueRanges[0].values.forEach(item => {
    if(item[0] == fullDate && item[5] == type){
      value += parseFloat(item[3].replace(",", "."));
    }
  })
  return { "value": value };
}

app.get('/spreadsheetid', async (req, res) => {
  res.send(process.env.SPREADSHEET_ID);
});

app.post('/readBalanceMonth', async (req, res) => {
  console.log('------------- readBalanceMonth ------------')
  console.log(req.body)
  await authorizeAndExecute(readBalanceMonth, req.body).then(result => {
    res.status(200).send(result)
  })
  .catch(e => {
    res.status(500).send(e)
  });
  console.log('--------------------------')
});

app.get('/readBalanceMonthType', async (req, res) => {
  console.log('------------- readBalanceMonthType ------------')
  console.log(req.body)
  await authorizeAndExecute(readBalanceMonthType, req.body).then(result => {
    res.status(200).send(result)
  })
  .catch(e => {
    res.status(500).send(e)
  });
  console.log('--------------------------')
});

app.post('/readSavingsMonth', async (req, res) => {
  console.log('------------- Read Savings month ------------')
  console.log(req.body)
  await authorizeAndExecute(readSavingsMonth, req.body).then(result => {
    res.status(200).send(result)
  })
  .catch(e => {
    res.status(500).send(e)
  });
  console.log('--------------------------')
});

app.post('/addValues', async (req, res) => {
  console.log(req.body)
  await authorizeAndExecute(addValue, req.body).then(result => {
    res.status(200).send(result)
  })
  .catch(e => {
    res.status(500).send(e);
  });
});

app.listen(5000, (err) => {
  console.log('Listening on port 5000');
});

