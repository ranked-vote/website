import {getIndex} from '../../reports'

export async function get(req, res, next) {
    let index = await getIndex();

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(index));
}
