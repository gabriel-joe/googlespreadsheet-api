
const wortenLink = "http://www.worten.pt/gaming/playstation/consolas/ps5/consola-ps5-825gb-7196053"
const fnac = "http://www.fnac.pt/PS5-Standard-Ratchet-et-Clank-Spiderman-Miles-Morales-Consola-Consola/a9173536"
const whatsAppService = require('./whatsapp')

function checkStock() {
    setInterval(() => { checkLink(wortenLink, "Indisponível", "Worten")  },1800000);
    setInterval(() => { checkLink(fnac, "Indisponível online", "Fnac") },1800000);
    return "Finished interval";
}

function checkLink(siteLink, text, store){
  (async(url) => {
      var buf = await httpGet(url);
      if(buf.toString().indexOf(text) != -1){
        console.log(`${new Date().toISOString()} | ${store} | Have stock`);
        whatsAppService.sendWhatsappRuben(`${store} | Have stock`);
      } else {
        console.log(`${new Date().toISOString()} | ${store} | Have not stock`);
      }
    })(siteLink);
}

function httpGet(url) {
    return new Promise((resolve, reject) => {
      const http = require('http'),
        https = require('https');
  
      let client = http;
  
      if (url.toString().indexOf("https") === 0) {
        client = https;
      }
  
      client.get(url, (resp) => {
        let chunks = [];
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          chunks.push(chunk);
        });
  
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
  
      }).on("error", (err) => {
        reject(err);
      });
    });
}

module.exports = { 
    checkStock: checkStock,
}