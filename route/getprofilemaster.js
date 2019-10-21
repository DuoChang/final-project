const mysql=require("../util/mysqlcon.js");
const express = require('express');
const express_router = express.Router();

express_router.get('/checktoken/checkmasterexpire/api/userprofile/master',(req,res)=>{

	let query_master_all_data_obj = new Promise(function(resolve,reject){

		let query_master_all = "SELECT master.account AS account,master.masterid AS masterid,master.name AS name,master.phone AS phone,master.email AS email,master.access_token AS access_token,master.access_expired AS access_expired,GROUP_CONCAT(DISTINCT masterarea.area) AS area FROM master,masterarea WHERE master.masterid=" + req.masterid + " AND masterarea.masterid=" + req.masterid ;
	
		mysql.con.query( query_master_all ,(err,result)=>{

			if( err ){

				res.send("{\"error\": \"Invalid token.\"}");

			}else{
				
				let master_res = {};
				master_res.id = result[0].masterid;
				master_res.name = result[0].name;
				master_res.phone = result[0].phone;
				master_res.email = result[0].email;
				master_res.area = result[0].area;
				master_res.account = result[0].account;

				let master_data = {};
				master_data.access_token = result[0].access_token;
				master_data.access_expired = result[0].access_expired;
				master_data.provider = 'master';
				master_data.basic = master_res;

				resolve(master_data);

			}									

		})

		return ;

	})

	query_master_all_data_obj.then((master_data)=>{

		let query_master_skill = 'SELECT * FROM masterskill WHERE masterid=' + req.masterid;

		mysql.con.query( query_master_skill ,(err,result)=>{

			if( err ){

				res.send("{\"error\": \"Invalid token.\"}");

			}else{

				let master_skill_array = [];

				if( result[0].light == 1){
					master_skill_array.push('light');
				}
				if( result[0].toilet ==1 ){
					master_skill_array.push('toilet');
				}
				if( result[0].waterheater ==1 ){
					master_skill_array.push('waterheater');
				}
				if( result[0].pipe ==1 ){
					master_skill_array.push('pipe');
				}
				if( result[0].faucet ==1 ){
					master_skill_array.push('faucet');
				}
				if( result[0].bathtub ==1 ){
					master_skill_array.push('bathtub');
				}
				if( result[0].wire ==1 ){
					master_skill_array.push('wire');
				}
				if( result[0].soil ==1 ){
					master_skill_array.push('soil');
				}
				if( result[0].paint ==1 ){
					master_skill_array.push('paint');
				}
				if( result[0].wallpaper ==1 ){
					master_skill_array.push('wallpaper');
				}
				if( result[0].tile ==1 ){
					master_skill_array.push('tile');
				}

				master_data.skill = master_skill_array;

				let master_total_res = {};
				master_total_res.data = master_data;
				res.json(master_total_res);

			}

		})

	})

})




module.exports = express_router;