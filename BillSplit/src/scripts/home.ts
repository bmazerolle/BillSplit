/**
 * Summary: Makes the points for the group by adding all of the bills the user is a payee in and subtracting all
 * that they are a payer for.
 * @param purchases
 */
function makePoints(purchases: any) {
    const date = new Date();
    const points: any = new Array();
    for (const purch of purchases.payee) {
        let dayWFreq = 0;
        const purchDate = new Date(purch.date).getDate();
        // Account Frequencies are used for foresting spending, the date object is used to get the last day
        // in the month
        while (dayWFreq + purchDate < new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()) {
            points.push({x: dayWFreq + purchDate , y: purch.item.Price});
            dayWFreq += purch.frequency;
            if (purch.frequency === 1) {
                break;
            }
        }
    }
    if (purchases.payer) {
        for (const purch of purchases.payer) {
            let dayWFreq = 0;
            const purchDate = new Date(purch.date).getDate();
            // Account Frequencies are used for foresting spending, the date object is used to get the last day
            // in the month
            while (dayWFreq + purchDate < new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()) {
                points.push({x: dayWFreq + purchDate, y: -purch.item.Price / purch.Group.Members.length});
                dayWFreq += purch.frequency;
                if (purch.frequency === 1) {
                    break;
                }
            }
        }
    }
    return points;

}

/**
 * Summary: gets the net amount a user owes to each group
 * @param purchases
 */
function listGroupNet(purchases: any) {
    const netVals: any = {};
    for (const purch of purchases.payee) {
        if (isNaN(netVals[purch.Group.Name])) {
            netVals[purch.Group.Name] = -purch.item.Price;
        } else {
            netVals[purch.Group.Name] -= purch.item.Price;
        }
    }
    for (const purch of purchases.payer) {
        if (isNaN(netVals[purch.Group.Name])) {
            netVals[purch.Group.Name] = purch.item.Price;
        } else {
            netVals[purch.Group.Name] += purch.item.Price / purch.Group.Members.length;
        }
    }
    return netVals;
}

/**
 * Summary: takes the net amount a user owes and displays in on the screen
 * @param nets
 */
async function displayNets(nets: any) {
    // tslint:disable-next-line:forin
    for (const group in nets) {
        const amount = Math.round(100 * nets[group]) / 100;
        const item = document.createElement("a");
        const date = new Date();
        $(item).attr("class", "list-group-item list-group-item-action");
        $(item).html("<div class='row' style='height:55px;'>" +
                                        "<div class='col'>" +
                                            "<h4>" + group + "</h4>" +
                                        "</div>" +
                                        "<div class='col' style='text-align:right'>" +
                                            "<div>" +
                                                "<p>" +
                                                    new Date(date.getFullYear(), date.getMonth() + 1, 0)
                                                        .toDateString() + "</p>" +
                                            "</div>" +
                                            "<div>" +
                                                "<p>$" + amount.toFixed(2) + "</p>" +
                                            "</div>" +
                                        "</div>" +
                                    "</div>");
        $("#billStatus").append(item);
    }
}

/**
 * Summary: Gets all of a user's purchase and send it into the appropriate functions
 */
function getUserPurchases() {
    $.ajax({
        data: $("#userId").serialize(),
        success: (result) => {
            const points = makePoints(result);
            graphPurchases(points, "#purchaseGraph")
                .catch((err) => {
                    $("#error").html("Could not create graph");
                });
            listGroupPurchases(result.payee, 10)
                .catch((err) => {
                    $("#error").html("Could not create list group purchases");
                });
            const nets = listGroupNet(result);
            displayNets(nets)
                .catch((err) => {
                    $("#error").html("Could not display the group bill totals");
                });
        },
        type: "GET",
        url: "/user/bills/purchases",
    });
}

if (document.URL.includes("home")) {
    document.addEventListener("DOMContentLoaded", () => {
        getUserPurchases();
    });
}
