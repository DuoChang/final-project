const mysql=require("../util/mysqlcon.js");
const express = require('express');
const expressrouter = express.Router();
const moment = require('moment');

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

function paddingLeft(str,lenght){
	if(str.length >= lenght){
		return str;	
	}else{
		return paddingLeft("0" +str,lenght);	
	}
	
}

function randomusefloor(min,max) {
	let num = Math.floor(Math.random()*(max-min+1)+min);
	let result = paddingLeft(num,6);
	return result;
}

function makerandomletter(max) {
  let text = "";
  let possible = "abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < max; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function insertorder( res, receivebodyfromfront , orderdate , userid , skillarray ){

	let num = makerandomletter(2) + randomusefloor(1,999999);

	let queryordercode = 'SELECT code FROM orders WHERE code=\"' + num + '\" AND status <> \"closed\"';
	let code = mysql.con.query( queryordercode, (err,result)=>{
		if( err || result !=0 ){
			console.log('13');
			insertorder( res , receivebodyfromfront , orderdate , userid, skillarray );
		}else{			
			console.log('12',num);
			let orderdetails = {

				status:'created',
				code: num,
				userid:userid,
				masterid:receivebodyfromfront.masterid,
				orderdate:orderdate,
				orderskill:receivebodyfromfront.skill.toString(),
				orderarea:receivebodyfromfront.area,
				ordertext: receivebodyfromfront.text,
				workdate:receivebodyfromfront.workdate

			};

			console.log('11',orderdetails);

			let queryinsertneworder = 'INSERT INTO orders SET ?' ;

			mysql.con.query( queryinsertneworder , orderdetails ,(err,result)=>{

				if( err ){

					console.log('BB8',err);

					res.send("{\"error\": \"Invalid token.\"}");

				}else{

					console.log('insert success');

					let orderid = result.insertId;

					let querymasteremail= 'SELECT email FROM master WHERE masterid=' + receivebodyfromfront.masterid ;

					console.log('7',querymasteremail);

					mysql.con.query(querymasteremail,(err,result)=>{

						if( err ){

							res.send("{\"error\": \"Invalid token.\"}");

						}else{

							console.log('8',result);

							mailTransport.sendMail({
														  
							  from: '<deathscythe.ms98@g2.nctu.edu.tw>',
							  
							  to: result[0].email,
							  
							  subject: 'Find 師傅-新需求通知 訂單編號:' + orderid,
							  
							  html: '<div style="border: 3px double #A89B8C"><p style="font-family:Microsoft JhengHei">您好<br>新需求明細如下，請查閱報價<br><br>地區：' + receivebodyfromfront.area + '<br>裝修項目：'+ skillarray.toString() +'<br>裝修日期：' + receivebodyfromfront.workdate + '<br>詳細敘述：' + receivebodyfromfront.text + '<br>請點選以下連結進行報價<br><a href="https://g777708.com/masterquote.html?status=created&orderid=' + orderid + '">前往報價</a></p></div>'


							}, function(err){
							
							  if(err) {
							
							    console.log('Unable to send email: ' + err);
							
							  }

							})

							let senddata = {};

							senddata.data = orderid;

							res.send(senddata);

						}

					});

				}



			})

		}
	})

}

function changeskillcreate(skillchangetotext){

	let skillarray = [];

	let skillstringtoarray = skillchangetotext.skill;

	for( let i = 0 ; i < skillstringtoarray.length ; i++ ){

		if( skillstringtoarray[i] == 'light' ){
			skillarray.push('燈具維修');
		}else if( skillstringtoarray[i] == 'toilet' ){
			skillarray.push('馬桶裝修');
		}else if( skillstringtoarray[i] == 'waterheater' ){
			skillarray.push('熱水器');
		}else if( skillstringtoarray[i] == 'pipe' ){
			skillarray.push('水管');
		}else if( skillstringtoarray[i] == 'faucet' ){
			skillarray.push('水龍頭');
		}else if( skillstringtoarray[i] == 'bathtub' ){
			skillarray.push('浴缸/淋浴設備');
		}else if( skillstringtoarray[i] == 'wire' ){
			skillarray.push('電線');
		}else if( skillstringtoarray[i] == 'soil' ){
			skillarray.push('補土');
		}else if( skillstringtoarray[i] == 'paint' ){
			skillarray.push('油漆');
		}else if( skillstringtoarray[i] == 'wallpaper' ){
			skillarray.push('壁紙');
		}else if( skillstringtoarray[i] == 'tile' ){
			skillarray.push('磁磚');
		}

	}

	return skillarray;

}


expressrouter.post('/api/order/create',(req,res)=>{

	console.log(req.header('Authorization'));

	console.log(req.body);

	if( !req.header('Authorization') || req.header('Authorization') == ''){
		console.log('898');
		res.send("{\"error\": \"Invalid request body.\"}");
	}else{

		console.log(456);

		let tokensplit = req.header('Authorization').split(' ');

		let timenow = Date.now();

		let checkauthorization = "SELECT userid,access_expired FROM user WHERE access_token=\"" + tokensplit[1] + "\"";

		mysql.con.query(checkauthorization,(err,result)=>{

			if(err || result.length===0 || tokensplit[0] !="Bearer"){

				console.log('title錯誤或未搜尋到內容');
			
				res.send("{\"error\": \"Invalid request body.\"}");
			
			}else{

				console.log('777');

				let userid = result[0].userid ;

				if( timenow > result[0].access_expired ){

					console.log('6868');

					res.send("{\"error\": \"Invalid request body.\"}");
				
				}else{

					console.log('1024');

					let orderdate = moment().format('YYYY-MM-DD');	

					let receivebodyfromfront = req.body ;

					let skillarray = changeskillcreate(req.body);

					console.log('G5',skillarray);

					let insertresult = insertorder( res , receivebodyfromfront , orderdate , userid , skillarray );

				}			

			}

		})
	}	

})

module.exports = expressrouter;