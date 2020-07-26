import {getReport} from '../../../reports'

export async function get(req, res, next) {
    const {path} = req.params;

    let report = await getReport(path.join('/'));

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(report));
}
