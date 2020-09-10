/*  Class: Purchase
*   Description: A single instance of the purchase of an item, to be placed in a bill in a group
*   Attributes:
*               date <object>: Date when the purchase took place
*               frequency <Frequency>: Enumerator used to designate frequency at which purchase is made (weekly etc.)
*               groupName <string>: The name of the group the purchase was made for
*               item <Item>: The item that was purchase
*               name <string>: The name of the item that was purchased
*               price <number>: The total price of the purchase
*               quantity <number>: The number of item(s) that were purchased
 */

import {ObjectId} from "mongodb";
import {Frequency} from "./Frequency";
import {Item} from "./Item";
import {BaseRoute} from "./route";

export class Purchase extends BaseRoute {
    public date!: object;
    public frequency!: Frequency;
    public groupName!: string;
    public item!: ObjectId;
    public name!: string;
    public price!: number;
    public quantity!: number;

    public constructor(date: object, item: ObjectId, frequency: Frequency, name: string,
                       price: number, quantity: number, groupName: string) {
        super();
        this.date = date;
        this.item = item;
        this.frequency = frequency;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.groupName = groupName;
    }

    public toObject(): any {
        return {
            date: this.date,
            frequency: this.frequency,
            item: this.item,
            name: this.name,
            price: this.price,
            quantity: this.quantity,
        };
    }
}
