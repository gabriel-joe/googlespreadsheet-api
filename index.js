const {google} = require('googleapis');
const dotenv = require('dotenv')
const result = dotenv.config()

let monthArray = new Array();
monthArray[0] = "01";
monthArray[1] = "02";
monthArray[2] = "03";
monthArray[3] = "04";
monthArray[4] = "05";
monthArray[5] = "06";
monthArray[6] = "07";
monthArray[7] = "08";
monthArray[8] = "09";
monthArray[9] = "10";
monthArray[10] = "11";
monthArray[11] = "12";

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

  const date = new Date(params.date)
  let expense = {
    month: `${monthArray[date.getMonth()]}/${date.getFullYear()}`,
    paymentType: params.paymentType,
    type: params.type,
    value: params.value,
    description: params.description,
    date: params.date
  }
  return expense;

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

app.get('/spreadsheetid', async (req, res) => {
  res.send(process.env.SPREADSHEET_ID);
});

app.post('/addValues', async (req, res) => {
  console.log(req.body)
  await authorizeAndExecute(addValue, req.body).then(result => {
    res.send(result)
  })
  .catch(e => {
    next(e)
  });
});

app.listen(5000, (err) => {
  console.log('Listening on port 5000');
});

