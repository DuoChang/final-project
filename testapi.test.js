const fetchUser = require("./test/testapi.js");
// import functions  from './test/testapi.js';

test('Test testapi searchmaster', () => {

	return fetchUser().then(data => {
    expect(data.error).toBe('Invalid request body.');

    })

})