//import fetch from 'node-fetch';

function fetch() {}

const { Request, Response, Headers } = fetch;

fetch.Promise = Promise;

export { Request, Response, Headers }
export default fetch;
