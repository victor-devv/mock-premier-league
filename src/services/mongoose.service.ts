import mongoose from 'mongoose';
import debug from 'debug';
import config from 'config'

const log: debug.IDebugger = debug('app:mongoose-service');
//AOqAE8a17DZwzBu5
class MongooseService {
    private count = 0;
    private mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        //useFindAndModify: false,
    };

    constructor() {
        this.connectWithRetry();
    }

    getMongoose() {
        return mongoose;
    }


    connectWithRetryb = () => {
        const appEnvironment: any = process.env.NODE_ENV;
        let CONNECT_URI;

        if (appEnvironment !== 'test') {
            CONNECT_URI = process.env.MONGO_URI
        } else {
            CONNECT_URI = process.env.MONGO_URI_TEST
        }

     mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost:27017/mock_premier_league", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //serverSelectionTimeoutMS: 5000,
            //useFindAndModify: false,
        });
    }

    connectWithRetry = async () => {

        console.log('Attempting MongoDB connection (will retry if needed)');

        // const MONGO_URI = "mongodb://mock-premier-league-mongo:27017/mock_premier_league"
        // const MONGO_URI_ATLAS: any = process.env.MONGO_URI_ATLAS

        const appEnvironment: any = process.env.NODE_ENV;
        let CONNECT_URI: any;
        if (appEnvironment !== 'test') {
            CONNECT_URI = process.env.MONGO_URI
        } else {
            CONNECT_URI = process.env.MONGO_URI_TEST
        }

        //, this.mongooseOptions
        await mongoose
            .connect(CONNECT_URI, this.mongooseOptions)
            .then(() => {
                console.log('MongoDB is connected');
            })
            .catch((err) => {
                const retrySeconds = 5;
                console.log(
                    `MongoDB connection unsuccessful (will retry #${++this
                        .count} after ${retrySeconds} seconds):`,
                    err
                );
                if (appEnvironment !== 'test') {
                    setTimeout(this.connectWithRetry, retrySeconds * 1000);
                }

            });
    };
}
export default new MongooseService();