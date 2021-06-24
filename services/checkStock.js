
const wortenLink = " http://www.worten.pt/gaming/playstation/consolas/ps5/consola-ps5-825gb-7196053"
const fnac = "http://www.fnac.pt/PS5-Standard-Spideman-Miles-Morales-Sackboy-A-Big-Adventure-Consola-Consola/a9030118#int=S:%C3%9ALTIMOS%20ARTIGOS%20VISITADOS|NonApplicable|NonApplicable|9030118|BL1|L1"
const whatsAppService = require('./whatsapp')

function checkStock() {
    setInterval(() => { checkWorten() },3600000);
    setInterval(() => { checkFnac() },3600000);
    return "Finished interval";
}

function checkWorten(){
    (async(url) => {
        var buf = await httpGet(url);
        if(buf.toString().indexOf("Esgotado") === 0){
            console.log("Worten | Have no stock");
        } else {
            console.log("Worten | Have stock");
            whatsAppService.sendWhatsapp("Worten | Have stock");
        }
      })(wortenLink);
}

function checkFnac(){
    (async(url) => {
        var buf = await httpGet(url);
        if(buf.toString().indexOf("Indisponível online") === 0){
            console.log("Have no stock");
        } else {
            console.log("FNAC | Have stock");
            whatsAppService.sendWhatsapp("FNAC | Have stock");
        }
      })(fnac);
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