import { promises as fs } from 'fs';

let proxy;

(async () => {
    proxy = JSON.parse(await fs.readFile('./proxy.conf.json'));
})();

const getTarget = (choice) => {
    return proxy[choice].target;
}

const getBaseUrl = (url = '') => {
    return getTarget('/'.concat(url.split('/')[1])).concat(url);
}

export {
    getBaseUrl
}