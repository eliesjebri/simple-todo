const db = require('../../src/persistence/mysql');
const ITEM = {
    id: '7aef3d7c-d301-4846-8358-2a91ec9d6be3',
    name: 'Test MySQL',
    completed: false,
};

beforeAll(async () => {
    await db.init();
});

afterAll(async () => {
    await db.teardown();
});

beforeEach(async () => {
    const items = await db.getItems();
    for (const item of items) {
        await db.removeItem(item.id);
    }
});

test('it initializes correctly (MySQL)', async () => {
    expect(typeof db.init).toBe('function');
});

test('it can store and retrieve items (MySQL)', async () => {
    await db.storeItem(ITEM);
    const items = await db.getItems();
    expect(items.length).toBe(1);
    expect(items[0]).toEqual(ITEM);
});

test('it can update an existing item (MySQL)', async () => {
    await db.storeItem(ITEM);
    await db.updateItem(
        ITEM.id,
        Object.assign({}, ITEM, { completed: !ITEM.completed }),
    );
    const items = await db.getItems();
    expect(items[0].completed).toBe(!ITEM.completed);
});

test('it can remove an existing item (MySQL)', async () => {
    await db.storeItem(ITEM);
    await db.removeItem(ITEM.id);
    const items = await db.getItems();
    expect(items.length).toBe(0);
});

test('it can get a single item (MySQL)', async () => {
    await db.storeItem(ITEM);
    const item = await db.getItem(ITEM.id);
    expect(item).toEqual(ITEM);
});
