import {NextFunction, Request, Response, Router} from "express";
import {MongoError, ObjectId} from "mongodb";
import {Group} from "../baseClasses/Group";
import {Purchase} from "../baseClasses/Purchase";
import DbClient = require("../DbClient");

export class GroupController extends Group {

    public static create(router: Router) {
        router.post("/group/add", (req: Request, res: Response, next: NextFunction) => {
            new GroupController().make(req, res);
        });
        router.post("/group/member/add", (req: Request, res: Response, next: NextFunction) => {
            new GroupController().addMember(req, res);
        });
        router.post("/group/member/remove", (req: Request, res: Response, next: NextFunction) => {
            new GroupController().removeMember(req, res);
        });
        router.post("/group/bill/add", (req: Request, res: Response, next: NextFunction) => {
            new GroupController().addBill(req, res);
        });
        router.get("/groups", (req: Request, res: Response, next: NextFunction) => {
            new GroupController().getAll(req, res);
        });
        router.get("/groups/query", (req: Request, res: Response, next: NextFunction) => {
            new GroupController().partialMatch(req, res);
        });
        router.get("/group", (req: Request, res: Response, next: NextFunction) => {
            new GroupController().getOne(req, res);
        });
        router.get("/group/bills/purchases", (req: Request, res: Response, next: NextFunction) => {
            new GroupController().getPurchases(req, res);
        });
        router.get("/group/members", (req: Request, res: Response, next: NextFunction) => {
            new GroupController().getMembers(req, res);
        });
    }

    /*
    * Summary: Creates a new group
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public make(req: Request, res: Response) {
        const members: ObjectId[] = [];
        const bills: ObjectId[] = [];
        try {
            let reqMembers;
            if (typeof req.body["group-members"] === "string") {
                reqMembers = new Array(req.body["group-members"]);
            } else {
                reqMembers = req.body["group-members"];
            }
            for (const member of reqMembers) {
                members.push(new ObjectId(member));
            }
        } catch {
            res.json({message: "Incorrect id format"});
        }
        DbClient.insert("groups",
            {Bills: bills, Members: members, Name: req.body["group-name"]})
            .then((result) => {
                res.json({groupId: result.ops[0]._id, message: "Successfully added group"});
            })
            .catch(() => {
                res.json({message: "Could not connect to database"});
            });
    }

    /*
    * Summary: Adds a member to an existing group
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public addMember(req: Request, res: Response) {
        let member: ObjectId = new ObjectId();
        let group: ObjectId = new ObjectId();
        try {
            member = new ObjectId(req.body["group-members"]);
            group = new ObjectId((req.body["group-id"]));
        } catch {
            res.json({massage: "Could not connect to database"});
        }

        DbClient.push("groups", group, {
            Members: member,
        })
            .then(() => {
                res.json({
                    message: "Successfully added member",
                });
            })
            .catch(() => {
                res.json({massage: "Could not connect to database"});
            });
    }

    /*
    * Summary: Removes a user from a group
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public removeMember(req: Request, res: Response) {
        DbClient.pull("groups", new ObjectId(req.body.group), "Members", new ObjectId(req.body.user))
            .then(() => {
                res.json({message: "Successfully removed user from group."});
            })
            .catch(() => {
                res.json({message: "Could not remove user from group"});
            });
    }

    /*
    * Summary: Adds a user's bill to a group
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public addBill(req: Request, res: Response) {
        let bill: ObjectId;
        let group: ObjectId;
        try {
            bill = new ObjectId(req.body.bills.insertedId);
            group = new ObjectId(req.body.group);
        } catch {
            res.json({massage: "Invalid ids"});
            return;
        }

        DbClient.push("groups", group, {
            Bills: bill,
        })
            .then(() => {
                res.json({
                    message: "Successfully joined group",
                });
            })
            .catch(() => {
                res.json({massage: "Could not connect to database"});
            });
    }

    /*
    * Summary: Gets all groups in the database
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public getAll(req: Request, res: Response) {
        DbClient.aggGroups()
            .then((results) => {
                res.json(results);
            })
            .catch(() => {
                res.json({message: "Could not connect to database"});
            });
    }

    /*
    * Summary: Gets a sinlge group from the database
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public getOne(req: Request, res: Response) {
        DbClient.getGroup(new ObjectId(req.query.group))
            .then((result) => {
                res.json({err: "", group: result[0]});
            })
            .catch(() => {
                res.json({err: "Could not connect to database", group: ""});
            });
    }

    /*
    * Summary: Finds a partial match in the database
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public partialMatch(req: Request, res: Response) {
        if (req.query.q === undefined) {
            return [];
        }
        DbClient.connect()
            .then((db) => {
                return db.collection("groups").aggregate([{$addFields: {stringId: {$toString: "$_id"}},
                    }, {$match: { $or: [{Name: {$options: "i", $regex: req.query.q}},
                            {stringId: {$options: "i", $regex: req.query.q}}]}},
                ]).toArray();
            })
            .then((results) => {
                res.json(results);
            })
            .catch(() => {
                res.json({message: "Could not connect to database"});
            });
    }

    /**
     * Summary: Queries for all of the purchases of a group and adds some of the field of the group into the purchases
     * @param req
     * @param res
     */
    public getPurchases(req: Request, res: Response) {
        DbClient.getBills({Group: new ObjectId(req.query.group)})
            .then((results) => {
                let purchases: any = [];
                for (const result of results) {
                    result.Purchases.item = result.itemOs[0];
                    result.Purchases.Payee = result.PayeeOs[0];
                    purchases = purchases.concat(result.Purchases);
                }
                const setPurch = new Set(purchases);
                purchases = Array.from(setPurch);
                res.json(purchases);
            })
            .catch((err: MongoError) => {
                res.json({error: err});
            });
    }

    /**
     * Summary: Gets the members of a group
     * @param req
     * @param res
     */
    public getMembers(req: Request, res: Response) {
        DbClient.getGroup(new ObjectId(req.query.group))
            .then((result) => {
                res.json({members: result[0].Members});
            })
            .catch((error) => {
                res.json({err: error});
            });
    }
}
