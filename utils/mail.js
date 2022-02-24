const nodemailer = require('nodemailer')

module.exports = (from = 'Express', to, subject, body) => {
    const template = `<!DOCTYPE html>
    <html lang="en">
    
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>

                *{
                    font-family: sans-serif !important;
                    color : #828188 !important;
                    margin-left : 250 px
                }
                a{
                    color : #754ffe !important;
                    text-decoration: none !important;
                }
                hr {
                    background-color : #754ffe !important;
                }
            </style>   
        </head>
    
        <body>

                <section>
                    ${body}
                </section>
        
        </body>
    </html>
    `

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'abase.boazar2@gmail.com', // like : abc@gmail.com
            pass: 'vahid1382', // like : pass@123
        },
    })

    let mailOptions = {
        from,
        to,
        subject,
        html: template,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error.message)
        }
        console.log('success')
    })
}
