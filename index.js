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
async function authorizeKey(callback, res) {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.API_KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return await callback(auth, res);
}

function listMajors(auth, response) {
  console.log(process.env.SPREADSHEET_ID)
  const sheets = google.sheets({version: 'v4', auth: auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: 'Per Month!A23:F',
  }, (err, res) => {
    if (err) response.send('The API returned an error: ');
    const rows = res.data.values;
    if (rows.length) {
      console.log('Month, Type:');
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
        console.log(`${row[0]}, ${row[4]}`);
      });
      response.send(rows);
    } else {
      response.send('No data found!')
    }
  });
}

app.get('/version', async (req, res) => {
  await authorizeKey(listMajors, res);
});

app.post('/values', async (req, res) => {
  
});

app.listen(5000, (err) => {
  console.log('Listening on port 5000');
});

