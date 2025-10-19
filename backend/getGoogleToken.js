const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

async function getAuthToken() {
  const keyFile = path.join(__dirname, 'credentials.json');
  const tokenFile = path.join(__dirname, 'token.json');

  try {
    const keyContent = await fs.readFile(keyFile, 'utf-8');
    const keys = JSON.parse(keyContent);  // ADD THIS LINE
    const credential = keys.web || keys.installed;
    const { client_secret, client_id, redirect_uris } = credential;

    const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    const authUrl = auth.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar']
    });

    console.log('🔗 Visit this URL:', authUrl);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Enter the code from the URL: ', async (code) => {
      rl.close();
      const { tokens } = await auth.getToken(code);
      await fs.writeFile(tokenFile, JSON.stringify(tokens, null, 2));
      console.log('✅ Token saved to token.json');
      process.exit();
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

getAuthToken();