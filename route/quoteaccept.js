const mysql=require("../util/mysqlcon.js");
const changeskill=require("../util/changeskill.js");
const changedatetype=require("../util/changedatetype.js");
const express = require('express');
const expressrouter = express.Router();
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

expressrouter.post('/api/quote/accept' ,(req,res)=>{

	console.log(req.body);

	if( !req.body.Authorization || req.body.Authorization == ''){

		console.log('898');
	
		return res.redirect('https://g777708.com/customerpaidresult.html?status=error');
	
	}else{

		let tokensplit = req.body.Authorization.split(' ');

		let timenow = Date.now();

		let checkauthorization = "SELECT name,phone,access_expired FROM user WHERE access_token=\"" + tokensplit[1] + "\"";

		mysql.con.query( checkauthorization ,(err,result)=>{

			if( err || result.length===0 || tokensplit[0] !="Bearer" ){

				console.log('title錯誤或未搜尋到內容');

				return res.redirect('https://g777708.com/customerpaidresult.html?status=error');
			
			}else{

				let userphone = result[0].phone;
				let username = result[0].name;

				if( timenow > result[0].access_expired ){

					return res.redirect('https://g777708.com/customerpaidresult.html?status=error');
				
				}else{

					if( req.body.orderid ){

						let queryorderdetails = 'SELECT code,masterid,workdate,address,ordertext,orderskill FROM orders WHERE indexid=' + req.body.orderid ;

						mysql.con.query( queryorderdetails , (err,result)=>{

							if( err ){

								return res.redirect('https://g777708.com/customerpaidresult.html?status=error');

							}else{

								result = changeskill( result );

								result = changedatetype( result );

								let code = result[0].code;

								let detailaddress = result[0].address;

								let workdate = result[0].workdate;

								let ordertext = result[0].ordertext;

								let skillarray = result[0].orderskill;

								let workdatedetail = {
									masterid:result[0].masterid,
									workdate:result[0].workdate
								};

								let querygetmasteraccount = 'SELECT email,account FROM master WHERE masterid=' + result[0].masterid ;

								mysql.con.query( querygetmasteraccount , (err,result)=>{

									let masteremail = result[0].email;

									stripe.charges.create({
									  amount: req.body.price*100,
									  currency: "usd",
									  source: req.body.stripeToken,
									  transfer_group: req.body.orderid
									}).then(function(charge) {
									  // asynchronously called

									  console.log(charge);

									  	let queryupdateorderstautspaid = 'UPDATE orders SET status=\"paid\",paymentid=\"' + charge.id + '\" WHERE indexid=' + req.body.orderid ;

										mysql.con.query( queryupdateorderstautspaid , (err,result)=>{

											if( err ){

												return res.redirect('https://g777708.com/customerpaidresult.html?status=updatefail');

											}else{

												let queryinsertworkdate = 'INSERT INTO masterdate SET ?';

												mysql.con.query( queryinsertworkdate , workdatedetail , (err,result)=>{

													if( err || result.length == 0 ){

														return res.redirect('https://g777708.com/customerpaidresult.html?status=updatefail');

													}else{

														mailTransport.sendMail({
												  
														  from: '<deathscythe.ms98@g2.nctu.edu.tw>',
														  
														  to: masteremail,
														  
														  subject: 'Find 師傅-消費者已確認報價 訂單編號:' + req.body.orderid,
														  
														  html: '<div style="border: 3px double #A89B8C"><p style="font-family:Microsoft JhengHei">您好<br>需求明細如下，請查閱詳細訊息<br><br>客戶：'+ username +'<br>連絡電話：' + userphone + '<br>地區：' + detailaddress + '<br>裝修項目：'+ skillarray.toString() +'<br>裝修日期：' + workdate + '<br>詳細敘述：' + ordertext + '<br>請點選以下連結前往訂單<br><a href="https://g777708.com/master/checkorder/inputcode?status=paid&orderid=' + req.body.orderid + '">查看訂單</a></p></div>'


														}, function(err){
														
														  if(err) {
														
														    console.log('Unable to send email: ' + err);
														
														  }

														})

														res.clearCookie('Authorization');

														res.cookie('code',code);

														return res.redirect('https://g777708.com/customerpaidresult.html?status=success');

													}

												})

											}

										})

									}).catch(err=>{

										console.log(err);

										return res.redirect('https://g777708.com/customerpaidresult.html?status=paidfail');

									});

								})

							}


						} )

					}else{

						return res.redirect('https://g777708.com/customerpaidresult.html?status=error');
					
					}

				}

			}

		})

	}

})

module.exports = expressrouter;