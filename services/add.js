const { google } = require('googleapis');
const common = require('./common');

async function appendRow(sheets) {
    const res = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.SPREADSHEET_ID,
      resource: {
        requests: [
          {
            insertDimension: {
              range: {
                dimension: 'ROWS',
                startIndex: 95,
                endIndex: 96,
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
    let expense = common.validateFields(params);
    const res = await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: common.sheetsDefaultRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        range: common.sheetsDefaultRange,
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

async function addDefaultValue(auth, params) {
  const sheets = google.sheets({version: 'v4', auth: auth});
  await appendRow(sheets).catch(e => { throw e });
  let expense = common.getDefaultExpense(params);
  const res = await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: common.sheetsDefaultRange,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      range: common.sheetsDefaultRange,
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

module.exports = {
    addValue: addValue,
    addDefaultValue: addDefaultValue
}
