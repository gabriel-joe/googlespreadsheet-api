const { google } = require('googleapis');
const common = require('./common');
const whatsAppService = require('./whatsapp')
  
async function listRemainMarketOptions(auth, params) {
  let date = common.formatDateMMYYYY(params.date);
  let field = common.monthsMarket[date];
  const res = await getSheetsResponse(auth, 'Market!A3:I100')
  let listToSend = []
  res.data.valueRanges[0].values.forEach(item => {
    if(item[3] > item[field]) {
      let itemList = {
        "item": item[0],
        "type": item[1],
        "required": item[2],
        "quantity": item[3] - item[field]
      }
      listToSend.push(itemList)
    }
  })
  console.log(listToSend);
  let message = '';
  listToSend.forEach(it => {
    message += `Item: ${it.item}, Quantidade: ${it.quantity} \n`
  });
  whatsAppService.sendWhatsapp(message)
  return { "marketList": listToSend };
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
  
module.exports = {
  listRemainMarketOptions: listRemainMarketOptions
}