// Include the server in your file
const server = require('server');
const { get, post } = server.router;
// Importeer de Stellar SDK en Nodemailer
const StellarSdk = require('stellar-sdk');
const nodemailer = require('nodemailer');

// Handle requests to the url "/" ( http://localhost:3000/ )
server([
  get('/', ctx => checBalance())

 ]);



// Configureer de SDK om verbinding te maken met het Stellar-netwerk
const stellarserver = new StellarSdk.Server('https://horizon.stellar.org');

// Stel het Stellar-account in waarvan u het saldo wilt ophalen
const publicKey = 'GBFJJD53YEKDJWGRLADCG6GW76NJWP2G3MCKTKVGG3KDU4HQD7LKPN6B';

// Configureer de e-mailinstellingen
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: 'beansrecoveryquest@outlook.com', // vervang dit met jouw Outlook-adres
        pass: 'FreeBeansRemittance!' // vervang dit met jouw Outlook-wachtwoord
    }
});

function checBalance(){
// Gebruik de server SDK om het account op te halen
    stellarserver.loadAccount(publicKey)
        .then((account) => {
            // Haal het saldo op van het account en converteer het naar XLM
            const balance = account.balances.find((balance) => balance.asset_type === 'native');
            const xlmBalance = parseFloat(balance.balance);

            console.log(`Het XLM-saldo van ${publicKey} is ${xlmBalance}`);

            // Controleer of het saldo minder is dan 400 XLM en stuur een e-mail als dat het geval is
            if (xlmBalance < 400) {
                const mailOptions = {
                    from: 'beansrecoveryquest@outlook.com',
                    to: 'matthijs@beansapp.com', // vervang dit met het e-mailadres van de ontvanger
                    subject: 'Waarschuwing: het XLM-saldo van de funding-wallet laag',
                    text: `Het XLM-saldo van de funding-wallet (${publicKey}) is minder dan 400 XLM (${xlmBalance} XLM).`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error(`Er is een fout opgetreden bij het verzenden van de e-mail: ${error}`);
                    } else {
                        console.log(`E-mail verzonden naar ${mailOptions.to}: ${info.response}`);
                    }
                });
            }
        })
        .catch((error) => {
            console.error(`Er is een fout opgetreden bij het ophalen van het saldo: ${error}`);
        });

    }