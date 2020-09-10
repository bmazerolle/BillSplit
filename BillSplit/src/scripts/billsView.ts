function includePurchase(purch: any, netVals: any, payee: boolean) {
    const purchDate = new Date(purch.date);
    const month = purchDate.getMonth() + 1;
    const year = purchDate.getFullYear();
    let itemPrice = purch.item.Price / purch.Group.Members.length;
    if (payee) {
        itemPrice = itemPrice * -1;
    }
    if (!netVals[year]) {
        netVals[year] = {};
    }
    if (!netVals[year][month]) {
        netVals[year][month] = {};
    }
    if (!(netVals[year][month][purch.Group.Name])) {
        netVals[year][month][purch.Group.Name] = {
            id: purch.Group._id,
            price: itemPrice,
        };
    } else {
        netVals[year][month][purch.Group.Name].price += itemPrice;
    }
}

/**
 * Summary: gets the net amount a user owes to each group
 * @param purchases
 */
function listGroupNets(purchases: any) {
    const netVals: any = {};
    for (const purch of purchases.payee) {
        includePurchase(purch, netVals, true);
    }
    for (const purch of purchases.payer) {
        includePurchase(purch, netVals, false);
    }
    return netVals;
}

function addItemToDisplay(item: any, itemObject: any) {
    const monthDictionary = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $(item).html(
        "<div class='row'>" +
        "<div class='col col-left'>" +
        "<p>" + itemObject.keyAttr + "</p>" +
        "</div>" +
        "<div class='col col-right'>" +
        "<p class='big-price'>$ " + itemObject.amountAttr.toFixed(2) + "</p>" +
        "</div>" +
        "</div>" +
        "<div class='row sub-row'>" +
        "<div class='col col-left'>" +
        "<p>" + monthDictionary[+itemObject.monthKeyAttr - 1] + " " + itemObject.yearKeyAttr + "</p>" +
        "</div>" +
        "</div>");
}
/**
 * Summary: Displays the net values of a bill for a user
 * @param nets
 * @param yearKey
 * @param monthKey
 */
function displayNetValues(nets: any, yearKey: string, monthKey: string) {
    for (const key in nets) {
        if (nets.hasOwnProperty(key)) {
            const amount = Math.round(100 * nets[key].price) / 100;
            const id = nets[key].id;
            const item = document.createElement("a");
            const date = new Date();
            $(item).attr("class", "list-group-item");
            $(item).attr("id", "listItem");
            const itemObject = {
                amountAttr: amount,
                keyAttr: key,
                monthKeyAttr: monthKey,
                yearKeyAttr: yearKey,
            };
            addItemToDisplay(item, itemObject);
            $("#billStatus").append(item);
        }
    }
}
/**
 * Summary: takes the net amount a user owes and displays in on the screen
 * @param allPurchases
 */
function sortNets(allPurchases: any) {
    // Now that it's organized by month/year, display the current month, display past months on other tab
    const curDate = new Date();
    const curMonth = curDate.getMonth() + 1;
    const curYear = curDate.getFullYear();
    for (const yearKey in allPurchases) {
        if (allPurchases.hasOwnProperty(yearKey)) {
            for (const monthKey in allPurchases[yearKey]) {
                if (allPurchases[yearKey].hasOwnProperty(monthKey)) {
                    if (!(+yearKey === curYear && +monthKey === curMonth)) {
                        displayNetValues(allPurchases[yearKey][monthKey], yearKey, monthKey);
                    }
                }
            }
        }
    }
}

/**
 * Summary: Gets the bill of a given user
 */
function getUserBills2() {
    $.ajax({
        data: $("#userId").serialize(),
        success: (result) => {
            const nets = listGroupNets(result);
            sortNets(nets);
        },
        type: "GET",
        url: "/user/bills/purchases",
    });
}

document.addEventListener("DOMContentLoaded", () => {
    getUserBills2();
});
