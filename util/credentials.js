require('dotenv').config();

module.exports = {
  cookieSecret: 'your cookie secret goes here',
  gmail: {
    user: 'deathscythe.ms98@g2.nctu.edu.tw',
    pass: process.env.MAIL_PASS
  }
};
