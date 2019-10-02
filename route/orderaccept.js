const mysql=require("../util/mysqlcon.js");
const changeskill=require("../util/changeskill.js");
const express = require('express');
const expressrouter = express.Router();
const moment = require('moment');
const crypto = require('crypto');
const stripe = require("stripe")("sk_test_1UIhmFMbhl0lO9w4Hdp6jNnC00MXi9WabT");

const bodyParser = require('body-parser');
expressrouter.use(bodyParser.json());
expressrouter.use(bodyParser.urlencoded({extended:true}));

const nodemailer = require('nodemailer');
require('dotenv').config();
const mailTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_PASS
  }
});


expressrouter.post('/api/order/accept' ,(req,res)=>{

	console.log(req.body);

	if( !req.body.Authorization || req.body.Authorization == ''){
		console.log('898');
		return res.redirect('/customer/paidresult?status=error');
	}else{

		let tokensplit = req.body.Authorization.split(' ');

		let timenow = Date.now();

		let checkauthorization = "SELECT name,phone,userid,access_expired FROM user WHERE access_token=\"" + tokensplit[1] + "\"";

		mysql.con.query(checkauthorization,(err,result)=>{

			if(err || result.length===0 || tokensplit[0] !="Bearer"){

				console.log('title錯誤或未搜尋到內容');

				return res.redirect('/customer/paidresult?status=error');
			
			}else{

				var userphone = result[0].phone;
				var username = result[0].name;

				let userid = result[0].userid ;

				if( timenow > result[0].access_expired ){

					return res.redirect('/customer/paidresult?status=error');
				
				}else{

					if( req.body.orderid ){

						let getordermaster = 'SELECT masterid FROM orders WHERE indexid=' + req.body.orderid ;

						mysql.con.query( getordermaster , (err,result)=>{

							if( err ){

								return res.redirect('/customer/paidresult?status=error');

							}else{

								let getmasteraccount = 'SELECT email,account FROM master WHERE masterid=' + result[0].masterid ;

								mysql.con.query( getmasteraccount , (err,result)=>{

									var masteremail = result[0].email;

									stripe.charges.create({
									  amount: req.body.price*100,
									  currency: "usd",
									  source: req.body.stripeToken,
									  transfer_group: req.body.orderid
									}).then(function(charge) {
									  // asynchronously called

									  console.log(charge);

									  	let acceptorderquery = 'UPDATE orders SET status=\"paid\",paymentid=\"' + charge.id + '\" WHERE indexid=' + req.body.orderid ;

										mysql.con.query( acceptorderquery , (err,result)=>{

											if( err ){

												return res.redirect('/customer/paidresult?status=updatefail');

											}else{

												
												let getordercode = 'SELECT code,masterid,workdate,address,ordertext,orderskill FROM orders WHERE indexid=' + req.body.orderid ;

												mysql.con.query( getordercode , (err,result)=>{

													if( err || result.length == 0 ){

														return res.redirect('/customer/paidresult?status=updatefail');

													}else{

														result = changeskill.changeskill(result);

														for(let q = 0 ; q < result.length ; q += 1 ){

															result[q].workdate = moment(result[q].workdate).format("YYYY-MM-DD");

														}

														var code = result[0].code;

														var gotoaddress = result[0].address;

														var gotoworkdate = result[0].workdate;

														var ordertext = result[0].ordertext;

														var skillarray = result[0].orderskill;

														let workdateitem = {
															masterid:result[0].masterid,
															workdate:result[0].workdate
														};

														let insertworkdate = 'INSERT INTO masterdate SET ?';

														mysql.con.query( insertworkdate , workdateitem , (err,result)=>{

															if( err || result.length == 0 ){

																return res.redirect('/customer/paidresult?status=updatefail');

															}else{

																mailTransport.sendMail({
														  
																  from: '<deathscythe.ms98@g2.nctu.edu.tw>',
																  
																  to: masteremail,
																  
																  subject: 'Find 師傅-消費者已確認報價 訂單編號:' + req.body.orderid,
																  
																  html: '<div style="border: 3px double #A89B8C"><p style="font-family:Microsoft JhengHei">您好<br>需求明細如下，請查閱詳細訊息<br><br>客戶：'+ username +'<br>連絡電話：' + userphone + '<br>地區：' + gotoaddress + '<br>裝修項目：'+ skillarray.toString() +'<br>裝修日期：' + gotoworkdate + '<br>詳細敘述：' + ordertext + '<br>請點選以下連結前往訂單<br><a href="https://g777708.com/master/checkorder/inputcode?status=paid&orderid=' + req.body.orderid + '">查看訂單</a></p></div>'


																}, function(err){
																
																  if(err) {
																
																    console.log('Unable to send email: ' + err);
																
																  }

																})

																res.clearCookie('Authorization');

																res.cookie('code',code);

																return res.redirect('/customer/paidresult?status=success');

															}

														})

													}

												} )

											}

										})

									}).catch(err=>{

										console.log(err);

										return res.redirect('/customer/paidresult?status=paidfail');

									});

								})

							}


						} )

					}else{

						return res.redirect('/customer/paidresult?status=error');
					
					}

				}

			}

		})

	}

})

module.exports = expressrouter;