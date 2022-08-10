import 'dotenv/config';

import { MongoClient, ObjectId } from 'mongodb';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const port = 3000;
const app = express();
app.use(express.json());

let usersCollection;

const SECRET_KEY = process.env.SECRET_KEY;

function randomTokenTime(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function getUserByEmail(email) {
    const user = await usersCollection.findOne({ email });
    return user === null ? undefined : user
}

async function getUserById(id) {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    return user === null ? undefined : user
}

async function createUser(userInformation) {
    await usersCollection.insertOne(userInformation);
}

function generateJwtTokens(id) {
    const accessToken = jwt.sign({ _id: id, type: 'access' }, SECRET_KEY, { expiresIn: randomTokenTime(60, 30) });
    const refreshToken = jwt.sign({ _id: id, type: 'refresh' }, SECRET_KEY, { expiresIn: '30d' });
    return { accessToken, refreshToken }
}

async function authMiddleware(authorizationHeader) {
    if (typeof authorizationHeader === 'undefined') {
        throw Error('Unauthorized');
    }

    if (authorizationHeader.split(' ').length !== 2 || authorizationHeader.split(' ')[0] !== 'Bearer') {
        throw Error('Unauthorized');
    }

    const accessToken = authorizationHeader.split(' ')[1];

    let decodedToken;
    try {
        decodedToken = jwt.verify(accessToken, SECRET_KEY);
    } catch (err) {
        throw Error('Token is not valid');
    }

    if (decodedToken.type !== 'access') {
        throw Error('Token is not valid');
    }

    const user = await getUserById(decodedToken._id);

    if (typeof user === 'undefined') {
        throw Error('User is not found');
    }

    return user;
}

app.post('/sign-up', async (req, res) => {
    const { email, password } = req.body;

    if (typeof email === 'undefined') {
        return res.status(400).json({ error: 'Body should contain \'email\' parameter' })
    }
    if (typeof password === 'undefined') {
        return res.status(400).json({ error: 'Body should contain \'password\' parameter' })
    }
    if(email.length < 5 && password.length < 5){
        return res.status(400).json({ error: '\'Email\' and \'password\' should be more than 4 symbols' })
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const userInformation = { email, password: hash };

    const user = await getUserByEmail(userInformation.email);

    if ( typeof user !== 'undefined' ) {
        return res.status(400).json({ error: 'Current email is already registered' })
    }
    await createUser(userInformation);

    const tokens = generateJwtTokens(userInformation._id);

    return res.status(200).json(tokens);
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (typeof email === 'undefined') {
        return res.status(400).json({ error: 'Body should contain \'email\' parameter' });
    }
    if (typeof password === 'undefined') {
        return res.status(400).json({ error: 'Body should contain \'password\' parameter' });
    }

    const user = await getUserByEmail(email);

    if (typeof user === 'undefined') {
        return res.status(400).json({ error: 'This password or email is invalid' });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
        return res.status(400).json({ error: 'This password or email is invalid' });
    }

    const tokens = generateJwtTokens(user._id);

    return res.status(200).json(tokens);
})

app.post('/refresh', async (req, res) => {
    const authorizationHeader = req.headers.authorization;

    if (typeof authorizationHeader === 'undefined') {
        throw Error('Unauthorized');
    }

    if (authorizationHeader.split(' ').length !== 2 || authorizationHeader.split(' ')[0] !== 'Bearer') {
        throw Error('Unauthorized');
    }

    const refreshToken = authorizationHeader.split(' ')[1];

    let decodedToken;
    try {
        decodedToken = jwt.verify(refreshToken, SECRET_KEY);
    } catch (err) {
        throw Error('Token is not valid');
    }

    if (decodedToken.type !== 'refresh') {
        throw Error('Token is not valid');
    }

    const tokens = generateJwtTokens(decodedToken._id);

    return res.status(200).json(tokens);
})

app.get('/me[0-9]', async (req, res) => {

    let user;
    try {
        user = await authMiddleware(req.headers.authorization);
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }

    return res.status(200).json({ request_num: req.url[req.url.length - 1], data: { username: user.email } });
})

async function main() {
    const client = await MongoClient.connect('mongodb://localhost:27017/');

    const db = client.db('authorization-data-base');
    usersCollection = db.collection('emails-passwords');

    app.listen(port, () => {
        console.log(`The server runs on port: ${port}`)
    })
}

main();

