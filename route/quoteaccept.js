const mysql=require("../util/mysqlcon.js");
const change_skill=require("../util/changeskill.js");
const change_date_type=require("../util/changedatetype.js");
const express = require('express');
const express_router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const body_parser = require('body-parser');
express_router.use(body_parser.json());
express_router.use(body_parser.urlencoded({extended:true}));

require('dotenv').config();
const nodemailer = require('nodemailer');
const mailTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_PASS
  }
});

express_router.post('/api/quote/accept' ,(req,res)=>{

	if( !req.body.Authorization || req.body.Authorization == ''){

		return res.redirect('../../customerpaidresult.html?status=error');
	
	}else{

		let token_split = req.body.Authorization.split(' ');

		let time_now = Date.now();

		let check_authorization = "SELECT name,phone,access_expired FROM user WHERE access_token=\"" + token_split[1] + "\"";

		mysql.con.query( check_authorization ,(err,result)=>{

			if( err || result.length===0 || token_split[0] !="Bearer" ){

				return res.redirect('../../customerpaidresult.html?status=error');
			
			}else{

				let user_phone = result[0].phone;
				let user_name = result[0].name;

				if( time_now > result[0].access_expired ){

					return res.redirect('../../customerpaidresult.html?status=error');
				
				}else{

					if( req.body.orderid ){

						let query_order_details = 'SELECT code,masterid,workdate,address,ordertext,orderskill FROM orders WHERE indexid=' + req.body.orderid ;

						mysql.con.query( query_order_details , (err,result)=>{

							if( err ){

								return res.redirect('../../customerpaidresult.html?status=error');

							}else{

								result = change_skill( result );

								result = change_date_type( result );

								let code = result[0].code;

								let detail_address = result[0].address;

								let workdate = result[0].workdate;

								let ordertext = result[0].ordertext;

								let skillarray = result[0].orderskill;

								let workdate_detail = {
									masterid:result[0].masterid,
									workdate:result[0].workdate
								};

								let query_get_master_account = 'SELECT email,account FROM master WHERE masterid=' + result[0].masterid ;

								mysql.con.query( query_get_master_account , (err,result)=>{

									let master_email = result[0].email;

									stripe.charges.create({
									  amount: req.body.price*100,
									  currency: "usd",
									  source: req.body.stripeToken,
									  transfer_group: req.body.orderid
									}).then(function(charge) {
									  // asynchronously called

									  	let query_update_order_stauts_paid = 'UPDATE orders SET status=\"paid\",paymentid=\"' + charge.id + '\" WHERE indexid=' + req.body.orderid ;

										mysql.con.query( query_update_order_stauts_paid , (err,result)=>{

											if( err ){

												return res.redirect('../../customerpaidresult.html?status=updatefail');

											}else{

												let query_insert_workdate = 'INSERT INTO masterdate SET ?';

												mysql.con.query( query_insert_workdate , workdate_detail , (err,result)=>{

													if( err || result.length == 0 ){

														return res.redirect('../../customerpaidresult.html?status=updatefail');

													}else{

														mailTransport.sendMail({
												  
														  from: '<deathscythe.ms98@g2.nctu.edu.tw>',
														  
														  to: master_email,
														  
														  subject: 'Find 師傅-消費者已確認報價 訂單編號:' + req.body.orderid,
														  
														  html: '<div style="border: 3px double #A89B8C"><p style="font-family:Microsoft JhengHei">您好<br>需求明細如下，請查閱詳細訊息<br><br>客戶：'+ user_name +'<br>連絡電話：' + user_phone + '<br>地區：' + detail_address + '<br>裝修項目：'+ skillarray.toString() +'<br>裝修日期：' + workdate + '<br>詳細敘述：' + ordertext + '<br>請點選以下連結前往訂單<br><a href="https://g777708.com/masterinputcode.html?status=paid&orderid=' + req.body.orderid + '">查看訂單</a></p></div>'


														}, function(err){
														
														  if(err) {
														
														    console.log('Unable to send email: ' + err);
														
														  }

														})

														res.clearCookie('Authorization');

														res.cookie('code',code);

														return res.redirect('../../customerpaidresult.html?status=success');

													}

												})

											}

										})

									}).catch(err=>{

										console.log(err);

										return res.redirect('../../customerpaidresult.html?status=paidfail');

									});

								})

							}


						} )

					}else{

						return res.redirect('../customerpaidresult.html?status=error');
					
					}

				}

			}

		})

	}

})

module.exports = express_router;