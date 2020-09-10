/*  Class: Group
*   Description: A collection of users in the billsplit app
*               that agree to split the costs of the purchases made for the group
*   Attributes:
*               name <string>: The group's name as set by the group creator
*               members <Member[]>: An array of all users in the group
*               bills <Bill[]>: An array of the group's bills, each user has one bill
*                               which contains all of their purchases for the group
 */

import { Bill } from "./Bill";
import {BaseRoute} from "./route";
import { User } from "./User";

export class Group extends BaseRoute {
    public name!: string;
    public members!: User[];
    public bills!: Bill[];

    public constructor() {
        super();
    }

}
