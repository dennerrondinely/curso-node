import * as restify from 'restify';
import * as mongoose from 'mongoose';
import { environment } from '../common/environment';
export class Server {
    initializeDb() {
        mongoose.Promise = global.Promise;
        return mongoose.connect(environment.db.url, {
            useMongoClient: true
        });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });
                this.application.use(restify.plugins.queryParser());
                //routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                this.application.listen(environment.server.port, () => {
                    resolve(this.application);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initializeDb().then(() => this.initRoutes(routers).then(() => this));
    }
}
