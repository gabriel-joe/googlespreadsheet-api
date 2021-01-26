const {google} = require('googleapis');
const dotenv = require('dotenv')
const result = dotenv.config()
 
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

async function appendRow(sheets) {
  const res = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: process.env.SPREADSHEET_ID,
    resource: {
      requests: [
        {
          insertDimension: {
            range: {
              dimension: 'ROWS',
              startIndex: 25,
              endIndex: 26,
            },
            inheritFromBefore: false,
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
  const res = await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: 'Per Month!A26:F26',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      range: 'Per Month!A26:F26',
      values: [
        [params.month, params.paymentType, params.description, params.value, params.date, params.type]
      ],
    },
  }).catch(e => {
    console.log(e);
    throw e;
  });
  return res.data;
}


app.get('/readValue', async (req, res) => {
  let response = await authorizeAndExecute(readValue);
  res.send(response);
});

app.post('/addValues', async (req, res) => {
  console.log(req.body)
  await authorizeAndExecute(addValue, req.body).then(result => {
    res.send(result)
  })
  .catch(e => {
    res.send(e)
  });
});

app.listen(5000, (err) => {
  console.log('Listening on port 5000');
});

