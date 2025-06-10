require('dotenv').config({ path: '.env.staging' });

const request = require('supertest');
const express = require('express');
const bodyParser = require('express').json;
const db = require('../../src/persistence'); // Utilise index.js → SQLite ou MySQL selon les vars

// Routes REST à tester
const getItems = require('../../src/routes/getItems');
const addItem = require('../../src/routes/addItem');
const updateItem = require('../../src/routes/updateItem');
const deleteItem = require('../../src/routes/deleteItem');

// App Express isolée pour les tests fonctionnels
const app = express();
app.use(bodyParser());
app.get('/items', getItems);
app.post('/items', addItem);
app.put('/items/:id', updateItem);
app.delete('/items/:id', deleteItem);

// Préparation : on vide et on réinitialise la base
beforeEach(async () => {
    await db.teardown(); // Supprime toutes les données
    await db.init();     // Réinitialise la base
});

test('POST then GET /items should persist the item', async () => {
    const newItem = { name: 'Functional test item' };

    const postRes = await request(app).post('/items').send(newItem);
    expect(postRes.statusCode).toBe(200);
    expect(postRes.body.name).toBe(newItem.name);
    expect(postRes.body.completed).toBe(false);
    expect(postRes.body.id).toBeDefined();

    const getRes = await request(app).get('/items');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.length).toBe(1);
    expect(getRes.body[0].name).toBe(newItem.name);
});

test('PUT /items/:id should update item', async () => {
    const newItem = { name: 'To be updated' };
    const created = await request(app).post('/items').send(newItem);
    const id = created.body.id;

    const updated = await request(app)
        .put(`/items/${id}`)
        .send({ name: 'Updated item', completed: true });

    expect(updated.statusCode).toBe(200);
    expect(updated.body.name).toBe('Updated item');
    expect(updated.body.completed).toBe(true);
});

test('DELETE /items/:id should remove item', async () => {
    const created = await request(app).post('/items').send({ name: 'To be deleted' });
    const id = created.body.id;

    const deleted = await request(app).delete(`/items/${id}`);
    expect(deleted.statusCode).toBe(200);

    const getRes = await request(app).get('/items');
    expect(getRes.body.find((item) => item.id === id)).toBeUndefined();
});
