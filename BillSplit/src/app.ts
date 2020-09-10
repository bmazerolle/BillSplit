
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import errorHandler from "errorhandler";
import express from "express";
import logger from "morgan";
import path from "path";
import {BillController} from "./controller/BillController";
import {GroupController} from "./controller/GroupController";
import {ItemController} from "./controller/ItemController";
import {PageController} from "./controller/PageController";
import {UserController} from "./controller/UserController";

/**
 * The server.
 *
 * @class Server
 */
export class Server {

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }

    public app: express.Application;

    public export = this.app;

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        // create expressjs application
        this.app = express();

        // configure application
        this.config();

        // add routes
        this.routes();
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    public config() {
        // add static paths
        this.app.use(express.static(path.join(__dirname, "../public")));
        this.app.use(express.static(path.join(__dirname, "./scripts")));
        this.app.use(express.static(path.join(__dirname, "./baseClasses")));
        this.app.use(express.static(path.join(__dirname, "../node_modules/chart.js")));

        // add the images
        this.app.use(express.static("assets"));
        this.app.use(express.static("assets/images"));

        // configure pug
        this.app.set("views", path.join(__dirname, "../views"));
        this.app.set("view engine", "pug");

        // mount logger
        this.app.use(logger("dev"));

        // mount json form parser
        this.app.use(bodyParser.json());

        // mount query string parser
        this.app.use(bodyParser.urlencoded({
            extended: true,
        }));

        // mount cookie parser middleware
        this.app.use(cookieParser("SECRET_GOES_HERE"));

        // catch 404 and forward to error handler
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            err.status = 404;
            next(err);
        });

        // error handling
        this.app.use(errorHandler());
    }

    /**
     * Create and return Router.
     *
     * @class Server
     * @method routes
     * @return void
     */
    private routes() {
        let router: express.Router;
        router = express.Router();

        PageController.create(router);
        UserController.create(router);
        ItemController.create(router);
        BillController.create(router);
        GroupController.create(router);

        // use router middleware
        this.app.use(router);

    }

}
