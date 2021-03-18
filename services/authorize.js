const { google } = require('googleapis');
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

module.exports = {
    authorizeAndExecute: authorizeAndExecute
}