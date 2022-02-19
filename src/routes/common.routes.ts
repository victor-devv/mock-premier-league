import {Express, Request, Response, Router} from 'express'
export abstract class CommonRoutesConfig {
    app: Express;
    name: string;
    prefix: string;
    router: Router;

    constructor(app: Express, name: string, prefix: string, router: Router) {
        this.app = app;
        this.name = name;
        this.prefix = prefix;
        this.router = router;
        this.configureRoutes();
    }
    getName() {
        return this.name;
    }
    getPrefix() {
        return this.prefix;
    }
    abstract configureRoutes(): Express;
}