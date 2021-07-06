const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');
const project = require('./package.json');

if(!fs.existsSync("configs.json"))
{
    let _defaultConfig = {
        sharedPath: path.join(__dirname, 'share'),
        wsPort: 6969,
        version: project.version
    };
    try{fs.mkdirSync("share");}catch{}
    fs.writeFileSync('configs.json', JSON.stringify(_defaultConfig, null, 4), 'utf8');
}

const cfg = require('./configs.json');

fastify.register(require('fastify-static'), {
    root: cfg.sharedPath,
    prefix: '/',
})


fastify.get('/', async (request, reply) => {
    return { sharedWS: 'Shared WebServer', version: project.version }
})

const start = async () => {
    try {
        await fastify.listen(cfg.wsPort)
    } catch (err) {
        fastify.log.error(err);
        await start();
    }
}

start()