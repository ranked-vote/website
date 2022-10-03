import {getIndex} from '../../reports'

export async function get(req, res, next) {
    let index = getIndex();

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(index));
}
