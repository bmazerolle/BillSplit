/*  Class: Item
*   Description: Individual item in the billsplit database. Can be re-used by any billsplit user once added.
*   Attributes:
*               name <string>: The item's name
*               price <number>: The price of a single instance of the item
*/

import {BaseRoute} from "./route";

export class Item  extends BaseRoute {
    public name!: string;
    public price!: number;

    public constructor() {
        super();
    }

    public addName(name: string) {
        this.name = name;
    }

    public addPrice(price: number) {
        this.price = price;
    }
}
