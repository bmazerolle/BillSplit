/*  Class: User
*   Description: Individual user of BillSplit app.
*                Has PII, an associated facebook account url, and groups they are apart of
*   Attributes:
*               name <string>: The user's First and Last name
*               userName <string>: Unique identifier
*               userPassword <string>: The user's password used for login
*               facebookAccount <string>: The user's facebook account username, used to send paypal invoices to
*               paypalEmail <string>: The email account associated with the user's paypal, used for sending invoices
*               groups <Group[]>: Array of all groups user is a member of
*/

import { Group } from "./Group";
import { Purchase } from "./Purchase";
import { BaseRoute } from "./route";

export class User extends BaseRoute {
    public name!: string;
    public userName!: string;
    public userPassword!: string;
    public facebookAccount!: string;
    public paypalEmail!: string;
    public groups!: Group[];

    constructor() {
        super();
    }

    public addName(name: string) {
        this.name = name;
    }

    public addUserName(uname: string) {
        this.userName = uname;
    }

    public addPassword(pass: string) {
        this.userPassword = pass;
    }

    public addEmail(email: string) {
        this.paypalEmail = email;
    }
}
