const changedatetype = require("./util/changedatetype.js");

test('Check change date type', () => {

    expect(changedatetype([{workdate:'2019-10-02T16:00:00.000Z'}])).toStrictEqual([{'workdate':'2019-10-03'}])
    expect(changedatetype([{commentdate:'2019-10-02T16:00:00.000Z'}])).toStrictEqual([{'commentdate':'2019-10-03'}])
    expect(changedatetype([{orderdate:'2019-10-02T16:00:00.000Z'}])).toStrictEqual([{'orderdate':'2019-10-03'}])

})