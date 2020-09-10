import {ObjectId} from "bson";
import {NextFunction, Request, Response, Router} from "express";
import sha256 from "fast-sha256";
import {MongoError} from "mongodb";
import {TextEncoder} from "text-encoding";
import { User } from "../baseClasses/User";
import DbClient = require("../DbClient");


export class UserController extends User {

    // Creates the routes for the UserController

    public static create(router: Router) {
        // post with name-reg, username-reg, email-reg, pass-reg, pass-conf-reg
        router.post("/register/create", (req: Request, res: Response, next: NextFunction) => {
            new UserController().register(req, res);
        });
        // post with name-reg, username-reg, email-reg, pass-reg, pass-conf-reg
        router.post("/login/auth", (req: Request, res: Response, next: NextFunction) => {
            new UserController().authenticate(req, res);
        });
        router.get("/users", (req: Request, res: Response, next: NextFunction) => {
            new UserController().getAll(req, res);
        });
        router.post("/user/group/addGroup", (req: Request, res: Response, next: NextFunction) => {
            new UserController().addGroup(req, res);
        });
        router.post("/user/group/remove", (req: Request, res: Response, next: NextFunction) => {
            new UserController().removeGroup(req, res);
        });
        router.get("/user/notification/count", (req: Request, res: Response, next: NextFunction) => {
            new UserController().countNotifications(req, res);
        });
        router.get("/user/notifications", (req: Request, res: Response, next: NextFunction) => {
            new UserController().getNotifications(req, res);
        });
        router.post("/user/notifications/clear", (req: Request, res: Response, next: NextFunction) => {
            new UserController().clearNotifications(req, res);
        });
        router.get("/user/bills/purchases", (req: Request, res: Response, next: NextFunction) => {
            new UserController().getPurchases(req, res);
        });
        router.post("/user/notifications/accept", (req: Request, res: Response, next: NextFunction) => {
            new UserController().acceptNotifications(req, res);
        });
        router.delete("/user/notifications/decline", (req: Request, res: Response, next: NextFunction) => {
            new UserController().removeNotification(req, res);
            new UserController().declineNotification(req, res);
        });
    }

    /*
    * Summary: Attached to the /login/auth route, it checks the user's password against whats in the database
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public authenticate(req: Request, res: Response) {
        const name = req.body["email-log"];
        const pass = req.body["pass-log"];
        DbClient.connect()
            .then((db: any) => {
                return db!.collection("users").findOne({
                    $or: [
                            {UserName: name},
                            {Email: name},
                        ],
                });
            })
            .then((result: any) => {
                if (result.Password === this.hash(pass)) {
                    const username = encodeURIComponent(result.UserName);
                    res.redirect("/home?user=" + username);
                } else {
                    this.render(req, res, "login", {
                        regMessage: "Incorrect UserName or Password",
                    });
                }
            })
            .catch((err: any) => {
                this.render(req, res, "login", {
                    regMessage: "Error connecting to Database",
                });
            });
    }

    /*
    * Summary: Verifies the registration fields are filled out correctly by the user
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public verify(req: Request, res: Response) {
        const emailRegexp = new RegExp(/\S+@\S+.\S+/);

        if (req.body["name-reg"] === "" || req.body["username-reg"] === ""
            || req.body["pass-reg"] === "" || req.body["email-reg"] === "") {
            this.render(req, res, "register", {
                page: "register",
                regMessage: "Not all fields filled out correctly",
            });
            return false;
        }
        if (!emailRegexp.test(req.body["email-reg"])) {
            this.render(req, res, "register", {
                page: "register",
                regMessage: "Invalid email provided",
            });
            return false;
        }
        if (req.body["pass-reg"] !== req.body["pass-conf-reg"]) {
            this.render(req, res, "register", {
                page: "register",
                regMessage: "Passwords do not match",
            });
            return false;
        }
        return true;
    }

    /**
     * Summary: int array to a hex string
     * @param intArray
     */
    public arrayToString(array: any): string {
        let str: string = "";
        for (const element of array) {
            str += element.toString(16);
        }
        return str;
    }

    /**
     * Summary: wrapper for abstracting password hashing
     * @param password
     */
    public hash(password: string) {
        return this.arrayToString(sha256(new TextEncoder("utf-8").encode(password)));
    }

    /*
    * Summary: Registers a new user for the site
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public register(req: Request, res: Response) {
        if (!this.verify(req, res)) {
            return;
        }
        DbClient.insert("users", {
                Bills: [],
                Email: req.body["email-reg"],
                FacebookAccount: "",
                Groups: [],
                Name: req.body["name-reg"],
                Password: this.hash(req.body["pass-reg"]),
                Purchases: [],
                UserName: req.body["username-reg"],
            })
            .then((result: any) => {
                this.render(req, res, "login", {
                    page: "login",
                    regMessage: "Successfully signed up",
                });
            })
            .catch((err: any) => {
                this.render(req, res, "register", {
                    page: "login",
                    regMessage: "Database error. Database not running or account already exists",
                });
            });
    }

    /*
    * Summary: Gets an array of all users in the BillSplit app
    * Parameters: HTTP response, HTTP request
    * Returns: An array of all Billsplit users
     */
    public getAll(req: Request, res: Response) {
        DbClient.getAll("users")
            .then((result: any) => {
                res.json(result);
            })
            .catch((err: any) => {
                res.json({err: "Could not connect to db"});
            });
    }

    /*
    * Summary: Adds a group to a user when the user joins a new group
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public addGroup(req: Request, res: Response) {
        const groupId = new ObjectId(req.body.group);
        let members;
        if (typeof req.body.users === "string") {
            members = new Array(req.body.users);
        } else {
            members = req.body.users;
        }
        for (const member of members) {
            const memberId = new ObjectId(member);
            DbClient.push("users", memberId, {Groups: groupId})
                .catch((err: any) => {
                    res.json({err: "Could not connect to db"});
                });
        }
        res.json({message: "Successfully added group"});
    }

    /*
    * Summary: Removes a group form the user's Group[] array when they leave a group
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public removeGroup(req: Request, res: Response) {
        DbClient.pull("users", new ObjectId(req.body.user), "Groups", new ObjectId(req.body.group))
            .then((result: any) => {
                res.json({message: "Successfully removed group from user"});
            })
            .catch((err: any) => {
                res.json({message: "Could not remove user from group"});
            });
    }

    /**
     * Summary: Adds a notification document to the collection
     * @param doc
     * @param res
     */
    public addNotification(doc: any, res: Response) {
        DbClient.insert("notification", doc)
            .catch((err: MongoError) => {
                res.json({message: err});
            });
    }

    /**
     * Summary: Sets the Accepted field of a notification to be true
     * @param req
     * @param res
     */
    public acceptNotifications(req: Request, res: Response) {
        DbClient.updateOne("notification", new ObjectId(req.body.notification), {$set: {Accepted: true}})
            .then((result: any) => {
                if (result.result.nModified === 1) {
                    res.json({successful: true});
                } else {
                    res.json({
                        message: "Did not update",
                        successful: false,
                    });
                }
            })
            .catch((err: MongoError) => {
                res.json({
                    message: "Could not connect to database",
                    successful: false,
                });
            });
    }

    /**
     * Summary: Removes a notification from a collection
     * @param req
     * @param res
     */
    public removeNotification(req: Request, res: Response) {
        DbClient.remove("notification", new ObjectId(req.body.notification))
            .then((result) => {
                if (1 === result.deletedCount) {
                    res.json({
                        successful: true,
                    });
                } else {
                    res.json({
                        message: "did not successfully remove item",
                        successful: false,
                    });
                }
            })
            .catch(() => {
                res.json({
                    message: "did not successfully remove item",
                    successful: false,
                });
            });
    }

    /**
     * Summary: Puts a decline notification in the collection
     * @param req
     * @param res
     */
    public declineNotification(req: Request, res: Response) {
        DbClient.insert("notification", {
                Date: new Date(),
                From: new ObjectId(req.body.from),
                Item: new ObjectId(req.body.item),
                Pending: false,
                Seen: false,
                To: new ObjectId(req.body.to)})
            .catch((err) => {
                res.json({
                    error: "Could not send notification",
                });
            });
    }

    /*
    * Summary: Counts the amount of notifications a given user has not seen yet
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public countNotifications(req: Request, res: Response) {
        DbClient.count("notification", {To: new ObjectId(req.query.user), Seen: false})
            .then((result) => {
                res.json({
                    count: result,
                    err: "None",
                });
            })
            .catch((err: MongoError) => {
                res.json({
                    count: 0,
                    error: err,
                });
            });
    }

    /*
    * Summary: Gets the notification of a given user and responses the the request given
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public getNotifications(req: Request, res: Response) {
        DbClient.getNotifications( {
                To: new ObjectId(req.query.user),
            })
            .then((result: any) => {
                res.json({
                    error: "None",
                    notifications: result,
                });
            })
            .catch((err: any) => {
                res.json({
                    error: err,
                    notifications: "None",
                });
            });
    }

    /*
    * Summary: Marks the notifications of a given user as seen
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public clearNotifications(req: Request, res: Response) {
        DbClient.updateMultiple("notification", {To: new ObjectId(req.body.user)}, {Seen: true})
            .then((response) => {
                res.json({successful: true});
            })
            .catch((err: MongoError) => {
                res.json({error: err});
            });
    }

    /**
     * Summary: Takes the query results and formats them to be processed easier later on.
     * @param purchasesQuery
     * @param req
     */
    public formatPurchases(purchasesQuery: any, req: Request): any {
        const purchases: any = {
            payee: [],
            payer: [],
        };

        for (const result of purchasesQuery) {
            result.Purchases.item = result.itemOs[0];
            result.Purchases.Group = result.groupOs[0];
            result.Purchases.Payee = result.PayeeOs[0];
            if (result.Payee.toString() === req.query.user) {
                purchases.payee.push(result.Purchases);
            } else {
                if (purchases.payer.filter((purch: any) => {
                    return (purch.Payee._id.toString() === result.Payee.toString() &&
                        purch.Group.toString() === result.Group.toString());
                }).length === 0) {
                    purchases.payer.push(result.Purchases);
                }
            }
        }
        return purchases;
    }

    /**
     * Summary: Queries for a users purchases
     * @param req
     * @param res
     */
    public getPurchases(req: Request, res: Response) {
        DbClient.getBills({ $or: [
                { Payee: new ObjectId(req.query.user) },
                { Payer: { $elemMatch: {$eq : new ObjectId(req.query.user)} } },
            ]})
            .then((results: any) => {
                const purchases = this.formatPurchases(results, req);
                res.json(purchases);
            })
            .catch((error: any) => {
                res.json(error);
            });
    }
}
