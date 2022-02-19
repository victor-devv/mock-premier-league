import express, {Express, Request, Response} from 'express'
import {CommonRoutesConfig} from './common.routes';

export class IndexRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'IndexRoutes', '', express.Router());
    }

    configureRoutes(): express.Application {
        //without express.Router
        this.app.route(`/`)
            .get((req: Request, res: Response) => {
                res.status(200).send(`Mock Premier League`);
            })

        //with express.Router
        this.router.get(`/healthcheck`, (req: Request, res: Response) => {
            res.status(200).send(`App Running`);
        })

        //const prefix = config.get<string>('routePrefix')
        const prefix: any = process.env.ROUTE_PREFIX
        this.app.use(prefix, this.router)

        return this.app;
    }

}