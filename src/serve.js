import express from "express";
import cors from "cors";
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { handleRequest, saveFiles } from './file.service';

dotenv.config();
const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(cors());

const hasBody = (body) => {
    for (let prop in body) {
        if (body.hasOwnProperty(prop)) return true;
    }
    return false;
}

const getUrl = (uri) => {
    if (process.env.BASE_URL == 'undefined') {
        throw Error('BASE_URL variable undefined');
    }
    return process.env.BASE_URL + uri;
}

app.use(async (req, res) => {
    try {
        const requestInit = {
            method: req.method,
            headers: req.headers
        };
        if (hasBody(req.body)) {
            requestInit['body'] = JSON.stringify(req.body);
        }
        const responseFetch = await fetch(getUrl(req.url), requestInit);
        const text = await responseFetch.text();
        if (text.includes('{')) {
            const payload = JSON.parse(text);
            saveFiles(req, res, payload);
            return res.status(responseFetch.status).send(payload);
        }
        return res.status(responseFetch.status).send(text);
    } catch (error) {
        await handleRequest(req, res);
    }
});

app.get('/', (req, res, next) => {
    res.status(200).send('Welcome the API');
});

app.listen(process.env.PORT || 4100, () => console.log('API started'));