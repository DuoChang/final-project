const crypto = require('crypto');
module.exports = function (password){

	let tokenstring = 777  + password + 'hire me';

	let hash = crypto.createHash('sha256');

	let passwordtoken = hash.update(tokenstring);

	return hash.digest('hex') ;
	
};
