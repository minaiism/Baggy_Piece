const Fs = require('fs');
const ReadLine = require('readline');
const GoogleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';

let Authorization = {};

Authorization.authorize = function(callback){
// Load client secrets from a local file.
    Fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }

        // Authorize a client with the loaded credentials
        Authorization.authorizeOauth(JSON.parse(content), function (oauth2Client) {
            callback(oauth2Client);
        });
    });
};

/**
 * Create an OAuth2 client with the given (parsed) token
 *
 * @param {Object} credentials The Authorization client credentials (Parsed token)
 * @param callback Callback that returns OAuth2 client object
 */
Authorization.authorizeOauth = function(credentials, callback) {
    let clientSecret = credentials.installed.client_secret;
    let clientId = credentials.installed.client_id;
    let redirectUrl = credentials.installed.redirect_uris[0];
    let auth = new GoogleAuth();
    let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    Fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
            Authorization.getNewToken(oauth2Client, function (oauth2ClientWithNewToken) {
                callback(oauth2ClientWithNewToken);
            });
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
        }
    });
};

/**
 * Get and store new token after prompting for user Authorization, and then
 * return the updated client
 *
 * @param {Google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param callback Callback that returns an updated OAuth2 client with correct credentials
 */
Authorization.getNewToken = function(oauth2Client, callback) {
    let authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });

    console.log('Authorize this app by visiting this url: ', authUrl);
    let rl = ReadLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the code from that page here: ', function (code) {
        rl.close();
        oauth2Client.getToken(code, function (err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            Authorization.storeToken(token);
            callback(oauth2Client);
        });
    });
};

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
Authorization.storeToken = function(token) {
    try {
        Fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }

    Fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
};

module.exports = Authorization;