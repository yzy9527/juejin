const nodeMailer = require('nodemailer')

function sendEmailFromQQ(subject, html,sendEmail=true) {
    if (!sendEmail) return
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('邮箱账户或密码为空')
        return
    }
    const transporter = nodeMailer.createTransport({
        service: '163',
        auth: {user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS}
    });
    transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: subject,
        html: html
    }, (err) => {
        if (err) return console.log(`发送邮件失败：${err}`, true);
        console.log('发送邮件成功')
    })
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
    sendEmailFromQQ,
    getRandomInt
}
