const mysql=require("../util/mysqlcon.js");
const change_date_type=require("../util/changedatetype.js");
const express = require('express');
const express_router = express.Router();

const body_parser = require('body-parser');
express_router.use(body_parser.json());
express_router.use(body_parser.urlencoded({extended:true}));

express_router.post('/checktype/checktoken/checkuserexpire/api/search/master',(req,res)=>{

	let select_by_area = new Promise(function(resolve,reject){

		let query_get_master_by_area = 'SELECT masterid FROM masterarea WHERE area=\"' + req.body.area + '\"';
		
		mysql.con.query( query_get_master_by_area ,(err,result)=>{

			if( err ){

				res.send("{\"error\": \"Invalid token.\"}");

			}else if( result.length ===0 ){

				res.send("{\"message\": \"No result\"}");
			
			}else{

				resolve(result);

			}
		
		});

		return ;

	})

	let select_by_mail_status = new Promise(function(resolve,reject){

		select_by_area.then((masterid)=>{

			let master_array = [] ;

			for( let i = 0 ; i < masterid.length ; i++ ){

				master_array[i] = masterid[i].masterid ;

			}

			let query_get_email_status = 'SELECT masterid,email FROM master WHERE masterid IN (' + master_array.toString() + ')'

			mysql.con.query( query_get_email_status ,(err,result)=>{

				if( err ){

					res.send("{\"error\": \"Invalid token.\"}");

				}else{

					let email_array = [];

					let email_arrayforcheck = [] ;

					let masterid_array = [];

					for( let i = 0 ; i < result.length ; i++ ){

						email_array[i] = '\"' + result[i].email + '\"' ;
						email_arrayforcheck[i] = result[i].email;
						masterid_array[i] = result[i].masterid;

					}

					let query_check_email_status = 'SELECT email FROM mailstatus WHERE email IN (' + email_array.toString() + ') AND status=\"active\"' ;

					mysql.con.query( query_check_email_status ,(err,result)=>{

						if( err ){

							res.send("{\"error\": \"Invalid token.\"}");

						}else{

							let masterid_by_status = [];

							let count = 0 ;

							for( let i = 0 ; i < email_arrayforcheck.length ; i++ ){

								for( let j = 0 ; j < result.length ; j++ ){

									if( email_arrayforcheck[i] == result[j].email ){

										masterid_by_status.push( masterid_array[i] );

									}

								}

								count += 1;

								if( count == (email_arrayforcheck.length) ){

									if( masterid_by_status.length == 0 ){

										res.send("{\"message\": \"No result\"}");

									}else{

										resolve(masterid_by_status);

									}

								}

							}
							
						}

					})

				}

			})

			return select_by_area; 

		})

		return ;

	})

	let select_by_date = new Promise(function(resolve,reject){

		select_by_mail_status.then((masterid)=>{

			let query_master_date = 'SELECT masterid FROM masterdate WHERE workdate=\"' + req.body.workdate + '\" AND masterid IN (' + masterid.toString() + ')';

			mysql.con.query( query_master_date ,(err,result)=>{

				if( err ){

					res.send("{\"error\": \"Invalid token.\"}");

				}else{

					let result_array = [];

					for( let j = 0 ; j < result.length ; j++ ){

						result_array[j] = result[j].masterid ;

					}

					let masterid_array_by_date = [] ;

					for( let i = 0 ; i < masterid.length ; i++ ){

						if( result_array.indexOf(masterid[i]) == -1 ){

							masterid_array_by_date.push(masterid[i]);						

						}

					}

					resolve(masterid_array_by_date);

				}

			})

			return select_by_mail_status;

		})

		return ;

	})

	let select_by_skill = new Promise(function(resolve,reject){

		select_by_date.then((masterid_array_by_date)=>{

			
			if( masterid_array_by_date.length == 0 ){

				res.send("{\"message\": \"No result\"}");

			}else{

				let skill_size = req.body.skill.length;
				
				let skill_array = [];

				let check_skill_array = [];

				for( let i = 0 ; i < skill_size ; i += 1){

					skill_array[i] = req.body.skill[i] ;
					check_skill_array[i] = 1;

				}

				let query_master_by_skill = 'SELECT masterid FROM masterskill WHERE (' + skill_array.toString() + ') IN ((' + check_skill_array.toString() + '))';

				mysql.con.query( query_master_by_skill ,(err,result)=>{

					if( err ){

						res.send("{\"error\": \"Invalid token.\"}");

					}else if( result.length ===0 ){

						res.send("{\"message\": \"No result\"}");
					
					}else{

						let master_array = [] ;

						for( let i = 0 ; i < masterid_array_by_date.length ; i++ ){

							for( let j = 0 ; j < result.length ; j++ ){

								if( masterid_array_by_date[i] == result[j].masterid ){

									master_array.push(masterid_array_by_date[i]);

								}

							}

							if( i == ( masterid_array_by_date.length - 1 ) ){

								resolve(master_array);

							}

						}


					}


				})

			}

			return select_by_area;

		})

		return ;

	})

	select_by_skill.then((master_array)=>{

		let master_average_rate = new Promise(function(resolve,reject){

			if( master_array.length == 0 ){

				res.send("{\"message\": \"No result\"}");

			}else{

				let query_get_master_rate = 'SELECT masterid,COUNT(*) AS count,SUM(heartrate)/COUNT(*) AS ave FROM comments WHERE masterid IN(' + master_array.toString() + ') GROUP BY masterid ORDER BY ave DESC';

				mysql.con.query( query_get_master_rate ,(err,result)=>{

					if( err ){

						res.send("{\"error\": \"Invalid token.\"}");

					}else if( result.length == 0 ){

						let master_rate = [];

						for( let l = 0 ; l < master_array.length ; l++ ){								

							let no_comment_obj = {};
							no_comment_obj.masterid = master_array[l];
							no_comment_obj.rate = 'no';
							no_comment_obj.count = 0 ;
							no_comment_obj.comments = 'no';
							master_rate.push(no_comment_obj);

						}
						
						let search_master_result = {};

						search_master_result.result = master_rate;	

						return res.send(search_master_result);

					}else{

						resolve(result);

					}

				})

			}				

			return ;

		})

		master_average_rate.then((count_rate)=>{

			let query_get_comments = 'SELECT * FROM comments WHERE masterid IN(' + master_array.toString() + ')';

			mysql.con.query( query_get_comments ,(err,result)=>{

				if( err ){

					res.send("{\"error\": \"Invalid token.\"}");

				}else{

					result = change_date_type(result);

					let master_rate = [];

					for( let i = 0 ; i < count_rate.length ; i++ ){

						let master_comments= [];

						for( let j = 0 ; j < result.length ; j++ ){

							if( count_rate[i].masterid == result[j].masterid ){

								master_comments.push(result[j]);

							}

						}

						let master_data = {};

						master_data.masterid = count_rate[i].masterid;
						
						let average_rate = count_rate[i].ave ;

						average_rate = average_rate.toFixed(1);

						master_data.rate = average_rate;

						master_data.count = count_rate[i].count;

						master_data.comments = master_comments;

						master_rate.push(master_data);

					}

					let check_commentid_array = [];

					for( let a = 0 ; a < count_rate.length ; a++ ){

						check_commentid_array[a] = count_rate[a].masterid;

					}

					for( let l = 0 ; l < master_array.length ; l++ ){

						if(check_commentid_array.indexOf(master_array[l]) == -1){

							let no_comment_obj = {};
							no_comment_obj.masterid = master_array[l];
							no_comment_obj.rate = 'no';
							no_comment_obj.count = 0 ;
							no_comment_obj.comments = 'no';
							master_rate.push(no_comment_obj);

						}

					}			

					let search_master_result = {};

					search_master_result.result = master_rate;

					res.send(search_master_result);

				}

			})

		})

	})

})


module.exports = express_router;