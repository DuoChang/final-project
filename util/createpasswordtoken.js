const crypto = require('crypto');
module.exports = function (password){

	let token_string = 777  + password + 'hire me';

	let hash = crypto.createHash('sha256');

	let password_token = hash.update(token_string);

	return hash.digest('hex') ;
	
};
