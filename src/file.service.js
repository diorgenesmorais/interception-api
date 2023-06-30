import { promises as fs } from 'fs';

const getFiles = async (name) => {
    return JSON.parse(await fs.readFile(`./mocks/${name}.json`));
}

const getPathname = (text) => {
    return text.split('/')[1].split('?')[0];
}

const getFilename = (request) => {
    return `${request.method}_${getPathname(request.url)}`;
}

const handleRequest = async (request, response) => {
    try {
        const mock = await getFiles(getFilename(request));
        response.status(200).json(mock);
    } catch (error) {
        response.status(400).json({Error: error.message});
    }
}

const saveFiles = async (request, response, body) => {
    try {
        fs.writeFile(
            `./mocks/${getFilename(request)}.json`, 
            JSON.stringify(body, null, 2),
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