import cli from '@vbarbarosh/node-helpers/src/cli';
import express from 'express';
import express_routes from '@vbarbarosh/express-helpers/src/express_routes';
import express_run from '@vbarbarosh/express-helpers/src/express_run';
import fs_path_basename from '@vbarbarosh/node-helpers/src/fs_path_basename';
import fs_path_resolve from '@vbarbarosh/node-helpers/src/fs_path_resolve';
import fs_rm from '@vbarbarosh/node-helpers/src/fs_rm';
import fs_write_stream from '@vbarbarosh/node-helpers/src/fs_write_stream';
import stream_promise from '@vbarbarosh/node-helpers/src/stream_promise';

cli(main);

async function main()
{
    const app = express();

    express_routes(app, [
        {req: 'GET /', fn: home},
        {req: 'GET /:uid', fn: pages_get},
        {req: 'PUT /:uid', fn: pages_put},
        {req: 'DELETE /:uid', fn: pages_remove},
        {req: 'ALL *', fn: page404},
    ]);

    await express_run(app);
}

function home(req, res)
{
    res.type('text').send(`Current time is: ${new Date()}\n`);
}

async function pages_get(req, res)
{
    const basename = fs_path_basename(req.path);
    res.sendFile(fs_path_resolve(__dirname, '../uploads', basename));
}

async function pages_put(req, res)
{
    const basename = fs_path_basename(req.path);
    await stream_promise(req.pipe(fs_write_stream(fs_path_resolve(__dirname, '../uploads', basename))));
    res.status(200).send();
}

async function pages_remove(req, res)
{
    const basename = fs_path_basename(req.path);
    await fs_rm(fs_path_resolve(__dirname, '../uploads', basename));
    res.status(200).send();
}

async function page404(req, res)
{
    res.status(404).send(`Page not found: ${req.path}`);
}
