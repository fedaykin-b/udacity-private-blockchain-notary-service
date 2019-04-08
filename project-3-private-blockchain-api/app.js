const Hapi = require('hapi');
const argv = require('yargs').alias('p', 'populate-data').argv

const PORT = 8000
/**
 * Class Definition for the REST API
 */
class BlockAPI {

    /**
     * Constructor that allows initialize the class
     */
    constructor() {
		this.server = Hapi.Server({
            port: PORT,
            host: 'localhost'
        });
        this.initControllers();
        this.start();
    }

    /**
     * Initialization of all the controllers
     */
	initControllers() {
        require("./BlockchainController.js")(this.server, argv.p);
	}

    async start() {
        await this.server.start();
        console.log(`Server running at: ${this.server.info.uri}`);
    }

}

new BlockAPI();