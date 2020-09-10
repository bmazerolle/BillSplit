import {NextFunction, Request, Response, Router} from "express";
import {ObjectId} from "mongodb";
import {Bill} from "../baseClasses/Bill";
import {Purchase} from "../baseClasses/Purchase";
import DbClient = require("../DbClient");

export class BillController extends Bill {

    public static create(router: Router) {
        // Form with bill-id, item-id
        router.post("/purchases/add", (req: Request, res: Response, next: NextFunction) => {
            new BillController(req.query.user).addPurchase(res, req);
        });
        // Form with bill-id, item-id
        router.post("/purchases/remove", (req: Request, res: Response, next: NextFunction) => {
            new BillController(req.body.user).removePurchase(res, req);
        });
        // Form with bill-id, item-id
        router.post("/bill/create", (req: Request, res: Response, next: NextFunction) => {
            new BillController(req.body.user).createBill(res, req);
        });
        router.post("/bill/purchase/remove", (req: Request, res: Response, next: NextFunction) => {
            new BillController(req.body.user).removePurchaseByGroup(req, res);
        });
        router.post("/bill/payer/add", (req: Request, res: Response, next: NextFunction) => {
            new BillController(req.body.user).addPayer(req, res);
        });
        // Form with bill-id, item-id (ex. ObjectId("xxxxxxxxxxxxxxxxxxxxxxxx"))
        router.post("/bill/pay", (req: Request, res: Response, next: NextFunction) => {
            new BillController(req.body.user).payBill(res, req);
        });
        // Form with bill-id, item-id (ex. ObjectId("xxxxxxxxxxxxxxxxxxxxxxxx"))
        router.get("/bill/paid", (req: Request, res: Response, next: NextFunction) => {
            new BillController(req.body.user).checkBillPaid(res, req);
        });
    }
    public billID!: ObjectId;

    /*
    * Summary: Writes to a user's bill within the group they have added their purchase to
    * Parameters: HTTP response, HTTP request, individual Bill ID, the purchase to add
    * Returns: none
     */
    public writeToBill(res: Response, req: Request, billId: ObjectId, purchase: Purchase) {
        DbClient.push("bills", billId, {
            Purchases: purchase,
        })
            .then((r) => {
                res.json({status: "Successfully wrote to bill"});
            })
            .catch(() => {
                res.json({status: "Unable to write to this user's bill on this group"});
            });
    }

    /*
    * Summary: Determines the correct bill within a group to add a purchase to
    * Parameters: HTTP response, HTTP request,
    *             the array of all bills in the group the purchase was added to, the purchase to add
    * Returns: none
     */
    public chooseBill(res: Response, req: Request, groupBills: any, purchase: Purchase) {
        for (const groupBill of groupBills) {
            DbClient.getBill(new ObjectId(groupBill))
                .then((results) => {
                    const userId = results[0].Payee.toString();
                    if (userId === req.body.user) {
                        this.writeToBill(res, req, results[0]._id, purchase);
                    }
                })
                .catch(() => {
                    res.json({status: "Unable to find a bill for this user in this group"});
                });
        }
    }

    /**
     * Summary: Adds a purchase to a user field
     * Parameters: HTTP Request, HTTP response, the purchase to add
     * Returns: HTTP response with operation result
     */
    public addPurchaseToUser(res: Response, req: Request, purchase: Purchase) {
        DbClient.push("users", new ObjectId(req.body.user), {
                Purchases: purchase,
            })
            .then(() => {
                res.json({status: "Successfully wrote to bill"});
            })
            .catch(() => {
                res.json({status: "Unable to write to this user's bill on this group"});
            });
    }

    /**
     * Summary: Creates a purchase
     * @param res
     * @param req
     * @param groupName
     * @param groupBills
     * @param groupMembers
     * Returns: none
     */
    public createPurchase(res: Response, req: Request, groupName: string, groupBills: any, groupMembers: ObjectId[]) {
        const itemId = new ObjectId(req.body["bill-item-id"]);
        const today = new Date();
        DbClient.getItem(itemId)
            .then((results: any) => {
                const purchase = new Purchase(today,
                    itemId,
                    +req.body["bill-purchase-frequency"],
                    results[0].Name,
                    results[0].Price,
                    req.body["bill-purchase-quantity"],
                    groupName);
                this.addNotifications(res, req, purchase, groupMembers, itemId);
                this.addPurchaseToUser(res, req, purchase);
                this.chooseBill(res, req, groupBills, purchase);
            })
            .catch(() => {
                res.json({status: "Unable to find group"});
            });
    }

    /*
    * Summary: Adds notifications to all group members when a purchase is made
    * Parameters: HTTP response, HTTP request, the purchase to notify users of,
    *               the members of the group, the item that was added in the purchase
    * Returns: none
    */
    public addNotifications(res: Response, req: Request, purchase: Purchase,
                            groupMembers: ObjectId[], itemId: ObjectId) {
        const groupID = req.body.groupName;
        // send notification to all members of a group that are not the purchaser
        for (const member of groupMembers) {
            if (member.toString() !== req.body.user) {
                DbClient.insert("notification", {
                        Accepted: false,
                        From: new ObjectId(req.body.user),
                        Group: new ObjectId(groupID),
                        Pending: true,
                        Purchase: purchase,
                        Seen: false,
                        To: new ObjectId(member),
                    })
                    .catch((err) => {
                        res.json({message: err});
                    });
            }
        }
    }

    /*
    * Summary: Creates a new purchase object, determines the group to add the purchase to,
    *          and passes the purchase to the chooseBill() function
    * Parameters: HTTP response, HTTP request
    * Returns: none
    */
    public addPurchase(res: Response, req: Request) {
        const groupID = req.body.groupName;
        // Get group -> pull bills from group
        DbClient.getGroup(new ObjectId(groupID))
            .then((results) => {
                this.createPurchase(res, req, results[0].Name, results[0].Bills, results[0].Members);
            })
            .catch(() => {
                res.json({status: "Unable to find group"});
            });
    }

    /*
    * Summary: Deletes a purchase from a bill
    * Parameters: HTTP response, HTTP request, the array of all bills in the group
    *             the purchase was added to, the purchase to add
    * Returns: none
     */
    public removePurchase(res: Response, req: Request) {
        DbClient.pull("bills", new ObjectId(req.body.groupName), "Purchases", this.purchases[0].item)
            .then(() => {
                res.redirect("/purchases/view?user=" + req.query.user);
            })
            .catch(() => {
                res.json({status: "Unable to remove purchase from bill"});
            });
    }

    /*
    * Summary: Creates a bill for a member of a group upon group creation or group joining
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public createBill(res: Response, req: Request) {
        const payee = req.body.billPayee;
        let payers = req.body.billPayer;
        const groupName = req.body.billGroup;

        if (payers === undefined) {
            payers = [];
        }

        if (typeof payers === "string") {
            payers = new Array(payers);
        }
        const payerOb: ObjectId[] = [];
        if (payers.length !== 0) {
            for (const payer of payers) {
                payerOb.push(new ObjectId(payer));
            }
        }

        DbClient.insert("bills", {
            Group: new ObjectId(groupName),
            Paid: {},
            Payee: new ObjectId(payee),
            Payer: payerOb,
            Purchases: [],
        })
            .then((results) => {
                res.json(results);
            }).catch(() => {
            res.json({status: "Unable to create bill"});
        });
    }

    /**
     * Summary: Removes a purchase by matching the fields Group and Payer
     * @param req
     * @param res
     * Returns: HTTP response containing a success or failure message
     */
    public removePurchaseByGroup(req: Request, res: Response) {
        DbClient.pullPurchaseByGroupUser({ Group: new ObjectId(req.body.group),
                Payer: { $elemMatch: { $eq:  new ObjectId(req.body.user) } } },
            { date: new Date(req.body.date),
                item: new ObjectId(req.body.item) },
            )
            .then((result) => {
                if (result.result.nModified === 1) {
                    res.json({successful: true});
                } else {
                    res.json({
                        message: "Could not find purchase in bill",
                        successful: true,
                    });
                }
            })
            .catch(() => {
                res.json({
                    message: "Could not connect to database",
                    successful: true,
                });
            });
    }

    /**
     * Summary: Adds a payer to a bill
     * @param req
     * @param res
     * Returns: HTTP response containing success or failure message
     */
    public addPayer(req: Request, res: Response) {
            DbClient.addPayer({Payee: new ObjectId(req.body.member), Group: new ObjectId(req.body.group)},
                new ObjectId(req.body.payer))
                .then((result) => {
                    if (result.result.nModified === 1) {
                        res.json({successful: true});
                    } else {
                        res.json({successful: false, message: "could not find Payer"});
                    }
                })
                .catch((error) => {
                    res.json({successful: false, message: "could not connect to database"});
                });
    }

    /*
    * Summary: Adds a user to specific bill's paid list for a given month and year
    * Parameters: HTTP response, HTTP request, the bill, the bill's current paid list
    * Returns: False if failed
     */
    public addUserToPaidList(res: Response, req: Request, bill: any, paidList: { [id: string]: string[][]}) {
        const curYear = req.body.year;
        const curMonthNum = +req.body.month;
        const curMonth = "" + curMonthNum;
        let monthList: string[] = [];
        let yearList: string[][] = [ [], [], [], [], [], [], [], [], [], [], [], [] ];
        const newPaidList: { [id: string]: string[][]} = {};
        if (paidList[curYear]) {
            yearList = paidList[curYear];
        }
        if (yearList[curMonthNum]) {
            monthList = yearList[curMonthNum];
        }
        if (monthList.indexOf(req.body.user) === -1) {
            monthList.push(req.body.user);
        }
        yearList[curMonthNum] = monthList;
        newPaidList[curYear] = yearList;
        DbClient.updateSingle("bills", {_id: bill}, {Paid: newPaidList})
            .catch((err: any) => {
                return false;
            });
    }

    /*
    * Summary: Finds the bills to be paid by the user
    * Parameters: HTTP response, HTTP request, the group's bills
    * Returns: False if failed
     */
    public setPaid(res: Response, req: Request, groupBills: any) {
        // get the current paidList, add the new paid, replace the list
        for (const groupBill of groupBills) {
            DbClient.getBill(groupBill)
                .then((results) => {
                    // want to pass in the bill paid obj too
                    this.addUserToPaidList(res, req, groupBill, results[0].Paid);
                })
                .catch((err: any) => {
                    return false;
                });
        }
    }

    /*
    * Summary: Creates a bill for a member of a group upon group creation or group joining
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public payBill(res: Response, req: Request) {
        const groupID = req.body.group;
        // Get group -> pull bills from group
        DbClient.getGroup(new ObjectId(groupID))
            .then((results) => {
                 this.setPaid(res, req, results[0].Bills);
            })
                .then(() => {
                    res.json("Great Success");
                })
                .catch(() => {
                    res.json({status: "Unable to find a bill for this user in this group"});
                });
    }

    /*
    * Summary: Gets the paid list of a given bill
    * Parameters: HTTP response, HTTP request
    * Returns: The paid list of the requested bill
     */
    public checkBillPaid(res: Response, req: Request) {
        DbClient.getBill(new ObjectId(req.query.allPurchases.Group.Bills[0]))
            .then((results) => {
                res.json(results[0].Paid);
            })
            .catch(() => {
                res.json({status: "Unable to find bill"});
            });
    }
}
