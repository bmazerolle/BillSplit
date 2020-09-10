import { NextFunction, Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import {BaseRoute} from "../baseClasses/route";
import DbClient = require("../DbClient");

export class PageController extends BaseRoute {
    public static create(router: Router) {
        // Get landing page
        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            new PageController().index(req, res);
        });
        // add home page route
        router.get("/home", (req: Request, res: Response, next: NextFunction) => {
            new PageController().home(req, res);
        });
        // Get profile page
        router.get("/profile", (req: Request, res: Response, next: NextFunction) => {
            new PageController().renderUserPage(req, res, "profile");
        });
        // Get previous bills page
        router.get("/bills/view", (req: Request, res: Response, next: NextFunction) => {
            new PageController().viewBillsPage(req, res);
        });
        // Get upcoming bills page
        router.get("/bills/pay", (req: Request, res: Response, next: NextFunction) => {
            new PageController().payBillsPage(req, res);
        });
        // Get purchase page
        router.get("/purchase/add", (req: Request, res: Response, next: NextFunction) => {
            new PageController().addPurchasePage(req, res);
        });
        // Get purchase page
        router.get("/purchase/view", (req: Request, res: Response, next: NextFunction) => {
            new PageController().viewPurchasePage(req, res);
        });
        // Get request for login page
        router.get("/login", (req: Request, res: Response, next: NextFunction) => {
            new PageController().loginPage(req, res);
        });
        // Get request for register page
        router.get("/register", (req: Request, res: Response, next: NextFunction) => {
            new PageController().registerPage(req, res);
        });
        // Get request for group create page
        router.get("/group/create", (req: Request, res: Response, next: NextFunction) => {
            new PageController().renderUserPage(req, res, "groupCreate");
        });
        // Get request for group create page
        router.get("/group/join", (req: Request, res: Response, next: NextFunction) => {
            new PageController().renderUserPage(req, res, "groupJoin");
        });
        router.get("/group/view", (req: Request, res: Response, next: NextFunction) => {
            new PageController().renderUserPage(req, res, "groupView");
        });
        router.get("/group/home", (req: Request, res: Response, next: NextFunction) => {
            new PageController().groupHomePage(req, res);
        });
        router.get("/notifications/view", (req: Request, res: Response, next: NextFunction) => {
            new PageController().renderUserPage(req, res, "notifications");
        });
    }

    public loginPage(req: Request, res: Response) {

        // render template
        this.render(req, res, "login");
    }

    // returns the landing page for the site
    public index(req: Request, res: Response) {
        this.render(req, res, "index");
    }

    // Renders the register page for the site
    public registerPage(req: Request, res: Response) {

        // render template
        this.render(req, res, "register", {regerror: "", title: "Register"});
    }

    /**
     * The home page route.
     *
     * @class IndexRoute
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
    public home(req: Request, res: Response) {
        // set message
        DbClient.connect()
            .then((db) => {
                return db!.collection("users").findOne({UserName: req.query.user});
            })
            .then((results) => {
                if (results === null) {
                    res.redirect("/login");
                } else {
                    this.render(req, res, "home", {userInfo: results});
                }
            })
            .catch(() => {
                res.redirect("/login");
            });

    }

    /**
     * The group home page route.
     *
     * @class IndexRoute
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     */
    public groupHomePage(req: Request, res: Response) {
        DbClient.getGroup(new ObjectId(req.query.group))
            .then((result) => {
                this.render(req, res, "groupHome", {
                    err: "", groupInfo: result[0],
                    userInfo: {
                        UserName: req.query.user,
                        _id: req.query["user-id"],
                    },
                });
            })
            .catch(() => {
                this.render(req, res, "groupHome", {
                    err: "Could not connect to database", groupInfo: "",
                    userInfo: {UserName: req.query.user},
                });
            });
    }

    /**
     * The profile page route.
     *
     * @class IndexRoute
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     */
    public profilePage(req: Request, res: Response) {
        if (req.query.user === undefined) {
            res.redirect("/login");
        }
        DbClient.getUser(req.query.user)
            .then((results) => {
                this.render(req, res, "profile", {
                    userInfo: results[0],
                });
            })
            .catch(() => {
                res.json({status: "Unable to connect to database"});
            });
    }

    /**
     * Renders the purchase page for the site
     *
     * @class IndexRoute
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     */
    public addPurchasePage(req: Request, res: Response) {
        DbClient.getUser(req.query.user)
            .then((result) => {
                this.render(req, res, "addPurchase", {
                    Message: "", userInfo: result[0],
                });
            })
            .catch(() => {
                this.render(req, res, "addPurchase",
                    {
                        err: "Could not connect to database",
                        userInfo: {
                            UserName: "none",
                        },
                    });
            });
    }

    /**
     * Renders the view purchase page for the site
     *
     * @class IndexRoute
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
    public viewPurchasePage(req: Request, res: Response) {
        DbClient.getUser(req.query.user)
            .then((result) => {
                this.render(req, res, "viewPurchase", {
                    Message: "", userInfo: result[0],
                });
            })
            .catch(() => {
                this.render(req, res, "viewPurchase", {
                        err: "Could not connect to database",
                        userInfo: {
                            UserName: "none",
                        },
                    });
            });
    }

    /**
     * Renders the view purchase page for the site
     *
     * @class IndexRoute
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
    public viewBillsPage(req: Request, res: Response) {
        DbClient.getUser(req.query.user)
            .then((result) => {
                this.render(req, res, "billsView", {
                    Message: "", userInfo: result[0],
                });
            })
            .catch(() => {
                this.render(req, res, "billsView", {
                    err: "Could not connect to database",
                    userInfo: {
                        UserName: "none",
                    },
                });
            });
    }

    /**
     * Renders the view purchase page for the site
     *
     * @class IndexRoute
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
    public payBillsPage(req: Request, res: Response) {
        DbClient.getUser(req.query.user)
            .then((result) => {
                this.render(req, res, "billsPay", {
                    Message: "", userInfo: result[0],
                });
            })
            .catch(() => {
                this.render(req, res, "billsPay", {
                    err: "Could not connect to database",
                    userInfo: {
                        UserName: "none",
                    },
                });
            });
    }

    /**
     * Queries user info and generates given page
     *
     * @class IndexRoute
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @param page
     * @next {NextFunction} Execute the next method.
     */
    public renderUserPage(req: Request, res: Response, page: string) {
        if (undefined === req.query.user) {
            res.redirect("/login");
        }
        DbClient.getUser(req.query.user)
            .then((results) => {
                this.render(req, res, page, {
                    err: "",
                    userInfo: results[0],
                });
            })
            .catch(() => {
                this.render(req, res, page, {
                    err: "Could not connect to the database",
                    userInfo: {
                        userName: req.query.user,
                    },
                });
            });
    }
}
