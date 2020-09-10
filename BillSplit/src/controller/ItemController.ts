import {NextFunction, Request, Response, Router} from "express";
import {MongoError, ObjectId} from "mongodb";
import { Bill } from "../baseClasses/Bill";
import { Item } from "../baseClasses/Item";
import {BaseRoute} from "../baseClasses/route";
import DbClient = require("../DbClient");

export class ItemController extends Item {
    public static create(router: Router) {
        // Get a list of all items
        router.get("/items", (req: Request, res: Response, next: NextFunction) => {
            new ItemController().getAll(req, res);
        });
        // Get a single item
        router.get("/item", (req: Request, res: Response, next: NextFunction) => {
            new ItemController().getItem(res, req);
        });
        // Form with item-name, item-price
        router.post("/items/add", (req: Request, res: Response, next: NextFunction) => {
            new ItemController().addItem(res, req);
        });
        // Form with item-id (ex. ObjectId("xxxxxxxxxxxxxxxxxxxxxxxx")), item-name, item-price
        router.post("/items/edit", (req: Request, res: Response, next: NextFunction) => {
            new ItemController().editItem(res, req);
        });
        // Partial match query endpoint
        router.get("/items/query", (req: Request, res: Response, next: NextFunction) => {
            new ItemController().query(res, req);
        });
    }

    /*
    * Summary: Attached to the /items route and returns all items in the database
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public getAll(req: Request, res: Response) {
        DbClient.getAll("items")
            .then((list) => {
                res.json(list);
            })
            .catch((err) => {
                res.json( { status: "could not connect to the database"});
            });
    }

    /*
    * Summary: Gets a specified item from the database
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public getItem(res: Response, req: Request) {
        const purchase = req.query.Purchases[0];
        const itemId = new ObjectId(purchase.item);
        DbClient.getItem(itemId)
            .then((results) => {
                const calculatedPrice = results[0].Price * purchase.quantity;
                const purchaseItem = {
                    group: purchase.title,
                    name: results[0].Name,
                    price: calculatedPrice,
                };
                res.json(purchaseItem);
            })
            .catch((err) => {
                res.json({status: "Unable to add purchase to bill"});
            });
    }

    /*
    * Summary: Attached the /items/add route and it adds a item to the database
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public addItem(res: Response, req: Request) {
        if (req.body["item-name"] === undefined || req.body["item-price"] === undefined) {
            this.render(req, res, "purchase", {
                status: "Not all fields filled out",
                user: req.query.user,
            });
            return;
        }

        DbClient.upsert("items", {
            Name: req.body["item-name"],
            Price: +req.body["item-price"],
        })
            .then(() => {
                res.json({status: "Item added"});
            })
            .catch(() => {
                res.json({status: "Unable to connect to database"});
            });
    }

    /*
    * Summary: Attached to the /item/edit and it edits a requested item with requested information
    * Parameters: HTTP response, HTTP request
    * Returns: none
     */
    public editItem(res: Response, req: Request) {
        const id = new ObjectId(req.body["item-id"].substring(10, 34));
        DbClient.updateOne("items", id, {
                Name: req.body["item-name"], Price: req.body["item-price"],
            })
            .then(() => {
                res.redirect("/purchases/view?user=" + req.query.user);
            })
            .catch(() => {
                this.render(req, res, "purchase", {
                    User: req.query.user,
                    err: "Could not connect to the database",
                });
            });
    }

    /**
     * Summary: Queries for an item using partial matches
     * @param res
     * @param req
     */
    public query(res: Response, req: Request) {
        if (req.query.q === undefined) {
            res.json([]);
            return;
        }
        DbClient.partialMatch("items", req.query.q)
            .then((results) => {
                res.json(results);
            })
            .catch((err: MongoError) => {
                res.json({
                    error: err,
                    result: "",
                });
            });
    }
}
