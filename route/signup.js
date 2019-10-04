const mysql=require("../util/mysqlcon.js");
const createtoken=require("../util/createtoken.js");
const createpasswordtoken=require("../util/createpasswordtoken.js");
const express = require('express');
const expressrouter = express.Router();
const stripe = require('stripe')('sk_test_1UIhmFMbhl0lO9w4Hdp6jNnC00MXi9WabT');

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

expressrouter.post('/api/user/signup',(req,res)=>{

	console.log('get api');

	console.log( req.body );

			/*--Check if http header content is correct--*/

	if( req.header('Content-Type') != "application/json" ){

		console.log('1');

		res.send("{\"error\": \"error\"}");	

	}else{

		console.log('1.5');

		if( req.body.provider == "customer" ){

			console.log('2');


						/*--確認未註冊過--*/
			
			mysql.con.query( 'SELECT phone FROM user WHERE phone=\"' + req.body.phone + '\"' ,(err,result)=>{

				console.log('3');


				if( err || result.length ===0 ){

					console.log('4');

					let token = createtoken(req.body.phone);
					let passwordtoken = createpasswordtoken(req.body.phone) ;
					console.log(passwordtoken);

					/*--資料送入DB--*/

					let usersignupdata={
						access_token:token.access_token,
						access_expired:token.access_expired,
						name:req.body.name,
						phone:req.body.phone,
						password:passwordtoken,
						address:req.body.address,
					};

					mysql.con.query( 'INSERT INTO user SET ?' , usersignupdata , (err,result)=>{

						console.log('5');


						if( err ){

							res.send("{\"error\": \"error\"}");

						}else{

							/*--選取資料送出--*/

							let queryuserdata = "SELECT * FROM user WHERE phone=\"" + req.body.phone + "\"";

							mysql.con.query( queryuserdata ,(err,result)=>{

								console.log('6');

								if( err ){

									res.send("{\"error\": \"error\"}");

								}else{

									let userres = {};
									 userres.userid = result[0].userid;
									 userres.name = result[0].name;
									 userres.phone = result[0].phone;
									 userres.address = result[0].address;

									let userdata = {};
									userdata.access_token = result[0].access_token;
									userdata.access_expired = result[0].access_expired;
									userdata.user = userres;

									let usertotalres = {};
									usertotalres.data = userdata;
									console.log(usertotalres);
									res.json(usertotalres);

								}

							})

						}


					});

					

				}else{

					console.log('7');

					console.log('已註冊過');

					res.send("{\"error\": \"error\"}");
				
				}
			
			});

		}else if( req.body.provider == "master" ){

			console.log('8');


						/*--確認未註冊過--*/
			
			mysql.con.query( 'SELECT phone FROM master WHERE phone=\"' + req.body.phone + '\"' ,(err,result)=>{

				console.log('9');

				if( err ){

					console.log(err);

					res.send("{\"error\": \"error\"}");

				}else if( result.length ===0 ){

					console.log('10');


					/*--新增 Stripe 帳戶--*/

					stripe.accounts.create({
					  country: 'US',
					  type: 'custom',
					  requested_capabilities: ['card_payments', 'transfers']
					}).then(function(acct) {

					  	// asynchronously called

					  	console.log(acct.id);

					  	/*--存 master 基本資料--*/

					  	let passwordtoken = createpasswordtoken(req.body.phone) ;

						let mastersignupdata = {

							access_token:'wait for verify',
							access_expired:'wait for verify',
							name:req.body.name,
							phone:req.body.phone,
							email:req.body.email,
							password:passwordtoken,
							account:acct.id
						
						};

						mysql.con.query( 'INSERT INTO master SET ?' , mastersignupdata , (err,result)=>{

							console.log('11');


							if( err ){

								res.send("{\"error\": \"error\"}");

							}else{

								mysql.con.query('SELECT masterid FROM master WHERE phone=\"' + req.body.phone + '\"',(err,result)=>{

									console.log('12');

									if( err ){

										res.send("{\"error\": \"error\"}");

									}else{

										/*--存 master skill 資料--*/

										let insertmasterskill = {
										
											masterid : result[0].masterid
										
										}

										let skillsize = req.body.skill.length;

										console.log(req.body.skill);

										let skillarray = [];

										for( let i = 0 ; i < skillsize ; i += 1){

											insertmasterskill[req.body.skill[i]] = 1 ;

										}

										console.log(insertmasterskill);

										mysql.con.query( 'INSERT INTO masterskill SET ?', insertmasterskill ,(err,result)=>{

											console.log('12.5',result);

											if( err ){

												res.send("{\"error\": \"error\"}");

											}

										})

										/*--存 master area 資料--*/


										let areasize = req.body.area.length;

										let areaarray = [];

										for( let i = 0 ; i < areasize ; i += 1){

											areaarray[i] = '(' + result[0].masterid + ',\"' + req.body.area[i] + '\")' ;

										}

										mysql.con.query( 'INSERT INTO masterarea(masterid,area) VALUES ' + areaarray.toString(), (err,result)=>{

											console.log('13',result);

											if( err ){

												res.send("{\"error\": \"error\"}");

											}else{

												/*--存 master 驗證資料--*/

												let mailverifytoken = createtoken(req.body.phone);

												let mailstatus = {
													email: req.body.email,
													activecode: mailverifytoken.access_token,
													status: 'inactive'
												};

												console.log(mailstatus);

												mysql.con.query( 'INSERT INTO mailstatus SET ?' , mailstatus , (err,result)=>{

													console.log('14');

													if( err ){

														res.send("{\"error\": \"error\"}");

													}else{

														mailTransport.sendMail({
																	  
														  from: '<deathscythe.ms98@g2.nctu.edu.tw>',
														  
														  to: req.body.email,
														  
														  subject: '在 Find 師傅驗證您的 email ',
														  
														  html: '<p>您好<br>請點選如下連結驗證您的信箱<br><a href=\"https://g777708.com/api/user/mailverify?startfind=' + mailverifytoken.access_token + '\">驗證信箱</a></p>'


														}, function(err){
														
														  if(err) {
														
														    console.log('Unable to send email: ' + err);
														
														  }
														
														});

														res.send("{\"data\": \"已寄信 & 註冊資料OK\"}");

													}

												});

											}

										})

									}

								})

							}

						});
					
					}).catch(err=>{

						console.log(err);

						return res.send("{\"message\": \"error\"}");

					})

				}else{

					console.log('已註冊過');

					res.send("{\"error\": \"error\"}");
				
				}
			
			});

		}

	}

})

module.exports = expressrouter;