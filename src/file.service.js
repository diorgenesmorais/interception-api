import { promises as fs } from 'fs';

const getFiles = async (name) => {
    return JSON.parse(await fs.readFile(`./mocks/${name}.json`));
}

const handleText = (text) => {
    return text.split('/')[1];
}

const getFilename = (request) => {
    return `${request.method}_${handleText(request.url)}.json`;
}

const handleRequest = async (request, response) => {
    try {
        const mock = await getFiles(`${request.method}_${handleText(request.url)}`);
        response.status(200).json(mock);
    } catch (error) {
        response.status(400).json({Error: error.message});
    }
}

const saveFiles = async (request, response, body) => {
    try {
        fs.writeFile(
            `./mocks/${getFilename(request)}`, 
            JSON.stringify(body),
            'utf-8'
        );
    } catch (error) {
        response.status(400).json({Error: error.message});
    }
}

export {
    getFiles,
    handleRequest,
    saveFiles
}