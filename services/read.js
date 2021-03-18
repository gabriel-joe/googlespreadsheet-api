const { google } = require('googleapis');
const common = require('./common');

async function readBalanceMonth(auth, params) {
    const sheets = google.sheets({version: 'v4', auth: auth});
    let fullDate = common.formatDateMMYYYY(params.date);
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
    let fullDate = common.formatDateMMYYYY(params.date);
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
    let fullDate = common.formatDateMMYYYY(params.date);
    let type = common.typeCastArray[params.type]
    const res = await sheets.spreadsheets.values.batchGet({
        spreadsheetId: process.env.SPREADSHEET_ID,
        ranges: 'Per Month!A23:F1000',
    }).catch(e => {
        console.log(e);
        throw e;
    });
    let valueMonth = 0;
    res.data.valueRanges[0].values.forEach(item => {
      if(item[0] == fullDate && item[5] == type){
        let valueParse = parseFloat(item[3].replace(",", "."));
        valueMonth += valueParse
      }
    })
    return { 
        "valueMonth": valueMonth,
        "valueTotal": readBalanceMonth(params)
    };
}

async function readComparableBalanceMonthType(auth, params) {
    const sheets = google.sheets({version: 'v4', auth: auth});
    let fullDate = common.formatDateMMYYYY(params.date);
    let type = common.typeCastArray[params.type]
    var dateNow = new Date()
    dateNow.setMonth(dateNow.getMonth() - 1)
    let lastMonth = common.formatDateMMYYYY(dateNow);
    let lastMonthDay = common.formatDateDDMMYYYY(dateNow);
    const res = await sheets.spreadsheets.values.batchGet({
        spreadsheetId: process.env.SPREADSHEET_ID,
        ranges: 'Per Month!A23:F1000',
    }).catch(e => {
        console.log(e);
        throw e;
    });
    let valueMonth = 0;
    let valuePast = 0;
    res.data.valueRanges[0].values.forEach(item => {
        if(item[0] == fullDate && item[5] == type){
          let valueParse = parseFloat(item[3].replace(",", "."));
          valueMonth += valueParse
        }
        if(item[0] == lastMonth && item[5] == type && item[4] <= lastMonthDay){
          let valueParse = parseFloat(item[3].replace(",", "."));
          valuePast += valueParse
        }
    })
    return { 
        "valueMonth": valueMonth,
        "valuePast": valuePast
    };
}

module.exports = {
    readBalanceMonth: readBalanceMonth,
    readBalanceMonthType: readBalanceMonthType,
    readSavingsMonth: readSavingsMonth,
    readComparableBalanceMonthType: readComparableBalanceMonthType
}