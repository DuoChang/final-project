const createpasswordtoken = require("./util/createpasswordtoken.js");

test('Check create password token length', () => {

    expect(createpasswordtoken('0911111111')).toHaveLength(64);

})
