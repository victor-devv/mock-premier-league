import express, {Express, Request, Response, Router} from 'express'
export abstract class CommonRoutesConfig {
    app: express.Application;
    name: string;
    prefix: string;
    router: Router;

    constructor(app: express.Application, name: string, prefix: string, router: Router) {
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
    abstract configureRoutes(): express.Application;
}