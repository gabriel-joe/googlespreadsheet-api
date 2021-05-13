const { google } = require('googleapis');
const common = require('./common');
const whatsapp = require('./whatsapp');

async function readBalanceMonth(auth, params) {
  let value = await calculateBalanceMonth(auth, params);
  let message = `${params.date}: ${value}`
  whatsapp.sendMessage(message)
  return { "value": await calculateBalanceMonth(auth, params) };
}
  
async function readSavingsMonth(auth, params) {
  let fullDate = common.formatDateMMYYYY(params.date);
  const res = await getSheetsResponse(auth, 'Per Month!A3:F17')
  let value = 0;
  res.data.valueRanges[0].values.forEach(item => {
    if(item[0] == fullDate)
      value = item[2].replace("€","").replace(" ", "");
  })
  return { "value": value };
}
  
async function readBalanceMonthType(auth, params) {
  let fullDate = common.formatDateMMYYYY(params.date);
  let type = common.typeCastArray[params.type]
  const res = await getSheetsResponse(auth, 'Per Month!A23:F1000')
  let valueMonth = 0;
  res.data.valueRanges[0].values.forEach(item => {
    if(item[0] == fullDate && item[5] == type){
      let valueParse = parseFloat(item[3].replace(",", "."));
      valueMonth += valueParse
    }
  })
  let value = await calculateBalanceMonth(auth, params);
  let message = `${params.date}/${params.type}: ${value}, valueMonth: ${valueMonth}`
  whatsapp.sendWhatsapp(message)
  return { 
      "valueMonth": valueMonth,
      "valueTotal": await calculateBalanceMonth(auth, params)
  };
}
async function calculateBalanceMonth(auth, params) {
  let fullDate = common.formatDateMMYYYY(params.date);
  const res = await getSheetsResponse(auth, 'Per Month!A3:F17')
  let value = 0;
  res.data.valueRanges[0].values.forEach(item => {
    if(item[0] == fullDate)
      value = item[5].replace("€","").replace(" ", "");
  })
  return value;
}

async function getSheetsResponse(auth, range) {
  const sheets = google.sheets({version: 'v4', auth: auth});
  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: process.env.SPREADSHEET_ID,
    ranges: range,
  }).catch(e => {
      console.log(e);
      throw e;
  });
  return res
}

async function readComparableBalanceMonthType(auth, params) {  
  let fullDate = common.formatDateMMYYYY(params.date);
  let type = common.typeCastArray[params.type]
  var dateNow = new Date()
  dateNow.setMonth(dateNow.getMonth() - 1)
  let lastMonth = common.formatDateMMYYYY(dateNow);
  let lastMonthDay = common.formatDateDDMMYYYY(dateNow);
  const res = await getSheetsResponse(auth, 'Per Month!A23:F1000')
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
  let message = `${params.date}/${params.type}: ${valueMonth}, valuePast: ${valuePast}`
  whatsapp.sendWhatsapp(message)
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