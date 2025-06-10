const db = require('../../src/persistence');
const getItems = require('../../src/routes/getItems');

jest.mock('../../src/persistence', () => ({
    getItems: jest.fn(),
}));

test('it fails with unexpected data', async () => {
    const req = {};
    const res = { send: jest.fn() };
    // Simule un retour invalide
    db.getItems.mockReturnValue(Promise.resolve(null));

    await getItems(req, res);

    // Test volontairement faux : on attend un tableau, pas null
    expect(res.send.mock.calls[0][0]).toEqual([]);
});
