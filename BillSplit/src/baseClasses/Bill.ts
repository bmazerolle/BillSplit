/*  Class: Bill
*   Description: A list of purchases made by a user for a group.
*   Attributes:
*               payee <User>: The user who made all purchases for the bill
*               payer[] <User[]>: All of the other members of the group that the user made the bill purchases for
*               groupName <String>: The name of the group, used for display purposed
*               purchases <Purchase[]>: An array of the purchases made by the payee
*               paid <User[]>: List of users who have paid for the given bill
 */
import { Purchase } from "./Purchase";
import {BaseRoute} from "./route";
import { User } from "./User";

export class Bill extends BaseRoute {
    public payee!: User;
    public payer!: User[];
    public groupName!: string;
    public purchases!: Purchase[];
    public paid!: User[];

    public constructor(payee: User) {
        super();
        this.payee = payee;
    }
}
