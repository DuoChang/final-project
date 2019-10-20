const crypto = require('crypto');
module.exports = function (phone){

	let token_string = phone + Date.now() + 'aaa';

	let hash = crypto.createHash('sha256');

	let user_token = hash.update(token_string);

	let expired_time = Date.now()+ 7.2e+6 ;

	return {access_token:hash.digest('hex'),access_expired:expired_time} ;
	
};
