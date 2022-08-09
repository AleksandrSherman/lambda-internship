import 'dotenv/config';

import { MongoClient } from 'mongodb';
import express from 'express';
import sha256 from 'crypto-js/sha256.js';
import jwt from 'jsonwebtoken';

const port = 3000;
const app = express();
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY;

const url = 'mongodb://localhost:27017/';

function randomTokenTime(max, min){
    return Math.floor(Math.random() * (max - min + 1) + min);
}


async function registrationInDataBase(userInformation) {
    const client = await MongoClient.connect(url);

    const db = client.db('authorization-data-base');
    const coll = db.collection('emails-passwords');


    let response = {};
    if (!(await coll.findOne({ email: userInformation.email }))) {
        await coll.insertOne(userInformation);
        response.status = 'Registred successfully';
    } else {
        response = { 'status': 'You are already signed up' }
    }

    await client.close();

    return response;
}

async function authorizationInDataBase(userInformation) {
    const client = await MongoClient.connect(url);

    const db = client.db('authorization-data-base');
    const coll = db.collection('emails-passwords');

    const currentUser = await coll.findOne({ email: userInformation.email, password: userInformation.password });

    let errorStatus;
    if ( !(currentUser) ) {
        errorStatus = { 'status': 'Incorrect email or password' };

        await client.close();
        return errorStatus;

    } 
    if ((typeof currentUser.token === 'undefined')) {

        const token = {$set: { token: jwt.sign( { '_id': currentUser._id }, SECRET_KEY, { expiresIn: randomTokenTime(60, 30) } ) } }
        await coll.updateOne(currentUser, token);

    } 

    await client.close();
    return currentUser;
}

app.post('/sign_up', async (req, res) => {
    const userRegistrationEmail = req.body.email;
    const userRegistrationPassword = sha256(req.body.password).toString();

    if (typeof userRegistrationEmail === 'undefined') {
        return res.status(400).json({ error: 'Body should contain \'email\' parameter' })
    }
    if (typeof userRegistrationPassword === 'undefined') {
        return res.status(400).json({ error: 'Body should contain \'password\' parameter' })
    }

    const userInformation = {
        'email': userRegistrationEmail,
        'password': userRegistrationPassword
    }

    const responseRegistration = await registrationInDataBase(userInformation);

    return res.status(200).json(responseRegistration);
})

app.post('/login', async (req, res) => {
    const userAuthorizationEmail = req.body.email;
    const userAuthorizationPassword = sha256(req.body.password).toString();

    if (typeof userAuthorizationEmail === 'undefined') {
        return res.status(400).json({ error: 'Invalid \'email\' parameter' })
    }
    if (typeof userAuthorizationPassword === 'undefined') {
        return res.status(400).json({ error: 'Invalid \'password\' parameter' })
    }

    const userInformation = {
        'email': userAuthorizationEmail,
        'password': userAuthorizationPassword
    }

    const responseAuthorization = await authorizationInDataBase(userInformation);

    return res.status(200).json(responseAuthorization);
})

function main() {

    app.listen(port, () => {
        console.log(`The server runs on port: ${port}`)
    })
}

main();

