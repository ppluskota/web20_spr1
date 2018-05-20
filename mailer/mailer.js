var nodemailer = require('nodemailer');

let selfSignedConfig = {
    host: 't.pl', port: 465,
    secure: true, // użwa TLS
    auth: {
        user: 'web20@t.pl', pass: 'stud234'
    },
    tls: {
        // nie przerywa przy błędnym certyfikacie
        rejectUnauthorized: false
    }
};

let transporter = nodemailer.createTransport(selfSignedConfig);

let mailOptions = {
    from: 'pluskot94@gmail.com',
    to: ''
};

var CustomMailer = {
    selfSignedConfig: selfSignedConfig,
    transporter: transporter,
    mailOptions: mailOptions
};

module.exports = CustomMailer;
