const mysql=require("../util/mysqlcon.js");
const express = require('express');
const express_router = express.Router();
const moment = require('moment');

const body_parser = require('body-parser');
express_router.use(body_parser.json());
express_router.use(body_parser.urlencoded({extended:true}));

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

function random_use_floor(min,max) {
	let num = Math.floor(Math.random()*(max-min+1)+min);
	let result = paddingLeft(num,6);
	return result;
}

function make_random_letter(max) {
  let text = "";
  let possible = "abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < max; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function insert_order( res, receive_body_from_front , order_date , userid , skill_array ){

	let num = make_random_letter(2) + random_use_floor(1,999999);

	let query_order_code = 'SELECT code FROM orders WHERE code=\"' + num + '\" AND status <> \"closed\"';
	let code = mysql.con.query( query_order_code, (err,result)=>{

		if( err || result !=0 ){

			insert_order( res , receive_body_from_front , order_date , userid, skill_array );
		
		}else{			

			let order_details = {

				status:'created',
				code: num,
				userid:userid,
				masterid:receive_body_from_front.masterid,
				orderdate:order_date,
				orderskill:receive_body_from_front.skill.toString(),
				orderarea:receive_body_from_front.area,
				ordertext: receive_body_from_front.text,
				workdate:receive_body_from_front.workdate

			};

			let query_insert_new_order = 'INSERT INTO orders SET ?' ;

			mysql.con.query( query_insert_new_order , order_details ,(err,result)=>{

				if( err ){

					res.send("{\"error\": \"Invalid token.\"}");

				}else{

					let orderid = result.insertId;

					let query_master_email= 'SELECT email FROM master WHERE masterid=' + receive_body_from_front.masterid ;

					mysql.con.query(query_master_email,(err,result)=>{

						if( err ){

							res.send("{\"error\": \"Invalid token.\"}");

						}else{

							mailTransport.sendMail({
														  
							  from: '<deathscythe.ms98@g2.nctu.edu.tw>',
							  
							  to: result[0].email,
							  
							  subject: 'Find 師傅-新需求通知 訂單編號:' + orderid,
							  
							  html: '<div style="border: 3px double #A89B8C"><p style="font-family:Microsoft JhengHei">您好<br>新需求明細如下，請查閱報價<br><br>地區：' + receive_body_from_front.area + '<br>裝修項目：'+ skill_array.toString() +'<br>裝修日期：' + receive_body_from_front.workdate + '<br>詳細敘述：' + receive_body_from_front.text + '<br>請點選以下連結進行報價<br><a href="https://g777708.com/masterquote.html?status=created&orderid=' + orderid + '">前往報價</a></p></div>'


							}, function(err){
							
							  if(err) {
							
							    console.log('Unable to send email: ' + err);
							
							  }

							})

							let send_data = {};

							send_data.data = orderid;

							res.send(send_data);

						}

					});

				}



			})

		}
	})

}

function change_skill_create(skill_change_to_text){

	let skill_array = [];

	let skill_string_to_array = skill_change_to_text.skill;

	for( let i = 0 ; i < skill_string_to_array.length ; i++ ){

		if( skill_string_to_array[i] == 'light' ){
			skill_array.push('燈具維修');
		}else if( skill_string_to_array[i] == 'toilet' ){
			skill_array.push('馬桶裝修');
		}else if( skill_string_to_array[i] == 'waterheater' ){
			skill_array.push('熱水器');
		}else if( skill_string_to_array[i] == 'pipe' ){
			skill_array.push('水管');
		}else if( skill_string_to_array[i] == 'faucet' ){
			skill_array.push('水龍頭');
		}else if( skill_string_to_array[i] == 'bathtub' ){
			skill_array.push('浴缸/淋浴設備');
		}else if( skill_string_to_array[i] == 'wire' ){
			skill_array.push('電線');
		}else if( skill_string_to_array[i] == 'soil' ){
			skill_array.push('補土');
		}else if( skill_string_to_array[i] == 'paint' ){
			skill_array.push('油漆');
		}else if( skill_string_to_array[i] == 'wallpaper' ){
			skill_array.push('壁紙');
		}else if( skill_string_to_array[i] == 'tile' ){
			skill_array.push('磁磚');
		}

	}

	return skill_array;

}


express_router.post('/checktype/checktoken/checkuserexpire/api/order/create',(req,res)=>{

	let order_date = moment().format('YYYY-MM-DD');	

	let receive_body_from_front = req.body ;

	let skill_array = change_skill_create(req.body);

	let insert_result = insert_order( res , receive_body_from_front , order_date , req.userid , skill_array );

})

module.exports = express_router;