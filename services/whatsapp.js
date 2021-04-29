const twilio = require('twilio');

function sendWhatsapp(message) {
    var twilio = require('twilio');
    let message = "Lista de mercado \n";
    console.log(message)
    var client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);
    //sendMessage(client, message, 'whatsapp:+351912818030')
    sendMessage(client, message, 'whatsapp:+351910496453')
}

function sendMessage(client, message, number) {
    client.messages.create({
        //mediaUrl: ['https://images.unsplash.com/photo-1545093149-618ce3bcf49d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80'],
        from: 'whatsapp:+14155238886',
        body: `${message}`,
        to: `${number}`
        })
    .then(message => console.log(message.sid));
}
module.exports = {
  sendWhatsapp: sendWhatsapp
}