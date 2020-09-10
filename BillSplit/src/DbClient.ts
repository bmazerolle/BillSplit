import {Db, MongoClient, MongoError, ObjectId} from "mongodb";
import "./enviro";

class DbClient {
    public db!: Db;

    /*
    * Summary: get the environment variable for the database and connects to it
    * Parameters: none
    * Returns: database connection
     */
    public async connect() {
        try {
            const dbname: any = process.env.MONGODB_URI!;
            const client = await MongoClient.connect(dbname, {useUnifiedTopology: true});
            this.db = client.db("billsplit");
            return this.db;
        } catch (error) {
            throw error;
        }
    }

    /*
    * Summary: Gets all of the documents in a specified collection
    * Parameters: collection name
    * Returns: array of documents
     */
    public async getAll(collection: string) {
        try {
            const conn = await this.connect();
            return conn.collection(collection).find().toArray();
        } catch (error) {
            throw error;
        }
    }

    /*
    * Summary: Updates the database with a new document, but will add a new document if it doesnt exist
    * Parameters: Collection name, document to be upserted
    * Returns: Confirmation object
    * Catch: Mongodb Error
     */
    public async upsert(collection: string, doc: any) {
        try {
            const conn = await this.connect();
            return conn.collection(collection).findOneAndUpdate(doc,
                { $setOnInsert: doc },
                { returnOriginal: true, upsert: true } );
        } catch (error) {
            throw error;
        }
    }

    /*
    * Summary: Updates a specific document in a collection given with the document given
    * Parameters: Collection name, id of item to be updated and document to update it with
    * Returns: Confirmation of insertion
    * Throw: Mongodb Error
     */
    public async updateOne(collection: string, id: ObjectId, doc: any) {
        try {
            const conn = await this.connect();
            return conn.collection(collection).updateOne({_id: id}, doc);
        } catch (error) {
            throw error;
        }
    }

    /*
    * Summary: Updates a given document by inserting an object into a list
    * Parameters: Collection name, object id and object with name of attribute and value of object to be pushed
    * Returns: confirmation of insertion
    * Throw: Mongodb error
     */
    public async push(collection: string, id: ObjectId, doc: any) {
        try {
            const conn = await this.connect();
            return conn.collection(collection).updateOne({_id: id}, {$push: doc});
        } catch (error) {
            throw error;
        }
    }

    /*
    * Summary: Updates a given document by pulling an object out of a list
    * Parameters: Collection name, object id, field to be pulled from and the id of the object to be pulled out of the
    * list
    * Returns: confirmation of insertion
    * Throw: Mongodb error
     */
    public async pull(collection: string, id: ObjectId, field: string, pullId: ObjectId) {
        try {
            const conn = await this.connect();
            const update: any = {
                $pull: {},
            };
            update.$pull[field] = pullId;
            return conn.collection(collection).updateOne({_id: id}, update);
        } catch (error) {
            throw error;
        }
    }

    /*
    * Summary: Gets user aggregated will all of their attributes
    * Parameters: Object id of the user
    * Returns: Object of the user
    * Throw: Mongodb error
     */
    public async getUser(userName: string) {
        try {
            const conn = await this.connect();
            return conn.collection("users").aggregate([{$lookup: {
                as: "GroupOs",
                from: "groups",
                pipeline: [ { $lookup: {
                    as: "MemberOs",
                    foreignField: "_id",
                    from: "users",
                    localField: "Members" } },
                { $match: { MemberOs: { $elemMatch: {UserName: userName } } } } ] } },
                { $lookup: {
                    as: "BillOs",
                    foreignField: "_id",
                    from: "bills",
                    localField: "Bills" } },
                { $match: { UserName: userName } },
            ]).toArray();
        } catch (error) {
            throw error;
        }
    }

    /*
    * Summary: Inserts a given document into a given database
    * Parameters: Collection name and document to be inserted
    * Returns: Confirmation object
    * Throw: Mongodb error
     */
    public async insert(collection: string, doc: any) {
        try {
            const conn = await this.connect();
            return conn.collection(collection).insertOne(doc);
        } catch (error) {
            throw error;
        }
    }

    /*
    * Summary: Aggregates groups with user info
    * Parameters: None
    * Returns: Groups array
    * Throw: Mongodb error
     */
    public async aggGroups() {
        try {
            const conn = await this.connect();
            return conn.collection("groups").aggregate([
                { $lookup: {
                            as: "UserOs",
                            foreignField: "_id",
                            from: "users",
                            localField: "Members" } } ] ).toArray();
        } catch (error) {
            throw error;
        }
    }

    /*
    * Summary: Gets a specific group
    * Parameters: group id
    * Returns: Groups object in a array of 1
    * Throw: Mongodb error
     */
    public async getGroup(id: ObjectId) {
        try {
            const conn = await this.connect();
            return conn.collection("groups").aggregate([
                { $lookup: {
                            as: "UserOs",
                            foreignField: "_id",
                            from: "users",
                            localField: "Members" } },
                { $match: { _id: id} },
            ]).toArray();
        } catch (error) {
            throw error;
        }
    }

    /*
    * Summary: Gets a specific bill
    * Parameters: Bill id
    * Returns: Bill object as a array of one
    * Throw: Mongodb error
     */
    public async getBill(id: ObjectId) {
        try {
            const conn = await this.connect();
            return conn.collection("bills").aggregate([
                { $match: { _id: id} },
            ]).toArray();
        } catch (error) {
            throw error;
        }
    }

    /*
    * Summary: Gets a specific item
    * Parameters: item id
    * Returns: item object as a array of one
    * Throw: Mongodb error
     */
    public async getItem(id: ObjectId) {
        try {
            const conn = await this.connect();
            return conn.collection("items").aggregate([
                { $match: {_id: id} },
            ]).toArray();
        } catch (error) {
            throw error;
        }
    }

    /*
    * Summary: Gets a specific user
    * Parameters: user id
    * Returns: user object as a array of one
    * Throw: Mongodb error
     */
    public async getUserObject(id: ObjectId) {
        try {
            const conn = await this.connect();
            return conn.collection("users").aggregate([
                { $match: { _id: new ObjectId(id)} },
            ]).toArray();
        } catch (error) {
            throw  error;
        }
    }

    /*
    * Summary: Counts the amount of documents that match the doc as a filter
    * Parameters: collection name and document used as a filter
    * Returns: count
    * Throw: Mongodb error
     */
    public async count(collection: string, doc: any) {
        try {
            const conn = await this.connect();
            return conn.collection(collection).countDocuments(doc);
        } catch (error) {
            throw error;
        }
    }

    /*
    * Summary: Aggregates the infomation of a notification
    * Parameters: collection name and match filter
    * Returns: list of notifications
    * Throw: Mongodb error
     */
    public async getNotifications(doc: any) {
        try {
            const conn = await this.connect();
            return conn.collection("notification").aggregate([
                { $lookup: {
                            as: "ToOb",
                            foreignField: "_id",
                            from: "users",
                            localField: "To" } },
                { $lookup: {
                            as: "FromOb",
                            foreignField: "_id",
                            from: "users",
                            localField: "From" } },
                { $lookup: {
                            as: "GroupOb",
                            foreignField: "_id",
                            from: "groups",
                            localField: "Group" } },
                { $lookup: {
                            as: "ItemOb",
                            foreignField: "_id",
                            from: "items",
                            localField: "Purchase.item" } },
                { $lookup: {
                            as: "declineItem",
                            foreignField: "_id",
                            from: "items",
                            localField: "Item"} },
                { $match: doc },
            ]).toArray();
        } catch (error) {
            throw error;
        }
    }

    /*
    * Summary: updates all document of a collection match the doc as a filter
    * Parameters: collection name, the update filter and the update values
    * Returns: Confirmation object
    * Throw: Mongodb error
     */
    public async updateSingle(collection: string, id: any, update: any) {
        try {
            const conn = await this.connect();
            return conn.collection(collection).updateOne(id, {$set: update});
        } catch (error) {
            throw error;
        }
    }
    /*
    * Summary: updates all document of a collection match the doc as a filter
    * Parameters: collection name, the update filter and the update values
    * Returns: Confirmation object
    * Throw: Mongodb error
     */

    public async updateMultiple(collection: string, doc: any, update: any) {
        try {
            const conn = await this.connect();
            return conn.collection(collection).updateMany(doc, {$set: update});
        } catch (error) {
            throw error;
        }
    }

    /**
     * Summary: Uses regex for a filter in the search
     * @param collection
     * @param partial
     */
    public async partialMatch(collection: string, partial: string) {
        try {
            const conn = await this.connect();
            return conn.collection(collection).find({Name: {$regex: partial}}).toArray();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Summary: Queries from a collection with a filter
     * @param collection
     * @param doc
     */
    public async getWhere(collection: string, doc: any) {
        try {
            const conn = await this.connect();
            return conn.collection(collection).find(doc).toArray();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Summary: Gets the bills purchases of a specified group
     * @param doc
     */
    public async getBills(doc: any) {
        try {
            const conn = await this.connect();
            return conn.collection("bills").aggregate([
                { $unwind: "$Purchases" },
                { $lookup: {
                            as: "PayeeOs",
                            foreignField: "_id",
                            from: "users",
                            localField: "Payee" } },
                { $lookup: {
                            as: "itemOs",
                            foreignField: "_id",
                            from: "items",
                            localField: "Purchases.item" } },
                { $lookup: {
                        as: "groupOs",
                        foreignField: "_id",
                        from: "groups",
                        localField: "Group" } },
                { $match: doc },
            ]).toArray();
        } catch (error) {
            throw error;
        }
    }

    public async remove(collection: string, id: ObjectId) {
        try {
            const conn = await this.connect();
            return conn.collection(collection).deleteOne({_id: id});
        } catch (error) {
            throw error;
        }
    }

    public async pullPurchaseByGroupUser(doc: any, pullInfo: any) {
        try {
            const conn = await this.connect();
            return conn.collection("bills").updateOne(doc, {$pull: {Purchases: pullInfo}});
        } catch (error) {
            throw error;
        }
    }

    public async addPayer(search: any, pushId: ObjectId) {
        try {
            const conn = await this.connect();
            return conn.collection("bills").updateOne(search, {$push: {Payer: pushId}});
        } catch (error) {
            throw error;
        }
    }
}

export = new DbClient();
