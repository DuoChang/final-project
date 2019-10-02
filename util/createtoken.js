const crypto = require('crypto');
module.exports = function (phone){

	let tokenstring = phone + Date.now() + 'aaa';

	let hash = crypto.createHash('sha256');

	let usertoken = hash.update(tokenstring);

	let expiredtime = Date.now()+ 7.2e+6 ;

	return {access_token:hash.digest('hex'),access_expired:expiredtime} ;
	
};
