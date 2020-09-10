/**
 * Summary: Sends a request to pay for a users bill
 */
function payBill() {
    const billYear = document.getElementById("billYear")!.innerHTML;
    const billMonth = document.getElementById("billMonth")!.innerHTML;
    const groupId = document.getElementById("groupId")!.innerHTML;
    const userId = (document.getElementById("userId") as HTMLInputElement)!.value;
    const billData = {
        group: groupId,
        month: billMonth,
        user: userId,
        year: billYear,
    };
    $.ajax({
        data: billData,
        error: (xhr, ajaxOptions, thrownError) => {
            alert(xhr.status);
            alert(thrownError);
        },
        success: (result) => {
            $("#message").html("");
            $("#message").append(result.status);
            document.location.reload();
        },
        type: "POST",
        url: "/bill/pay",
    });
}

function setGroupId(groupName: any, groupId: any, year: any, month: any) {
    $("#groupName").html(groupName);
    $("#groupId").html(groupId);
    $("#billYear").html(year);
    month = +month - 1;
    if ( month === -1) {
        month = 11;
    }
    $("#billMonth").html(String(month));
}

function getNetVals(netVals: any, purchases: any, user: any, payee: boolean) {
    for (const purch of purchases) {
        $.ajax({
            async: false,
            data: {
                allPurchases: purch,
                userInfo: user,
            },
            error: (xhr, ajaxOptions, thrownError) => {
                alert(xhr.status);
                alert(thrownError);
            },
            success: (result) => {
                const purchDate = new Date(purch.date);
                const month = purchDate.getMonth();
                const year = purchDate.getFullYear();
                let itemPrice = purch.item.Price / purch.Group.Members.length;
                if (payee) {
                    itemPrice = itemPrice * -1;
                }
                let paidList = [];
                if (result && result[year] && result[year][month]) {
                    paidList = result[year][month];
                }
                if (paidList && paidList.indexOf(user) > -1) {
                    return;
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
            },
            type: "GET",
            url: "/bill/paid",
        });
    }
    return netVals;
}

/**
 * Summary: gets the net amount a user owes to each group
 * @param purchases
 * @param userId
 */
function listCurrentGroupNet(purchases: any, userId: any) {
    // Need to add additional filter for date, return an array of "nets" grouped by month
    let netVals: any = {};
    netVals = getNetVals(netVals, purchases.payee, userId, true);
    netVals = getNetVals(netVals, purchases.payer, userId, false);
    displayCurrentNetValues(netVals);
}

function generateRow(item: any, rowObject: any, active: boolean) {
    const monthDictionary = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const innerHTML = "<div class='row'>" +
        "<div class='col col-left'>" +
        "<p>" + rowObject.keyAttr + "</p>" +
        "</div>" +
        "<div class='col col-right'>" +
        "<p>$ " + rowObject.amountAttr.toFixed(2) + "</p>" +
        "</div>" +
        "</div>" +
        "<div class='row sub-row'>" +
        "<div class='col col-left'>" +
        "<p>" + "Due " + monthDictionary[rowObject.monthKeyAttr] + " 1 " + rowObject.yearKeyAttr + "</p>" +
        "</div>" +
        "<div class='col col-right'>";
    let buttonHTML = "";
    if (active) {
        buttonHTML = "<button type='button' class='btn btn-primary btn-small' data-toggle='modal'" +
            "data-target=\"#createFormDiv\" id=" + rowObject.idAttr + " onClick='setGroupId(" + "\"" +
            rowObject.keyAttr + "\", " + "\"" + rowObject.idAttr + "\", " + "\"" + rowObject.yearKeyAttr +
            "\", " + "\"" + rowObject.monthKeyAttr + "\"" + ")'>Pay</button></div></div>";
    } else {
        buttonHTML = "<button type='button' class='btn btn-secondary btn-small' disabled>Paid</button></div></div>";
    }
    const rowHTML = innerHTML.concat(buttonHTML);
    $(item).html(rowHTML);
}

function displayCurrentNetValues(nets: any) {
    for (const year in nets) {
        if (nets.hasOwnProperty(year)) {
            for (const month in nets[year]) {
                if (nets[year].hasOwnProperty(month)) {
                    for (const key in nets[year][month]) {
                        if (nets[year][month].hasOwnProperty(key)) {
                            const amount = Math.round(100 * nets[year][month][key].price) / 100;
                            if (amount <= 0) {
                                continue;
                            }
                            const id = nets[year][month][key].id;
                            const item = document.createElement("a");
                            const yearKey = +year;
                            let monthKey = +month + 1;
                            if (monthKey === 12) {
                                monthKey = 0;
                            }
                            $(item).attr("class", "list-group-item");
                            $(item).attr("id", "listItem");
                            const rowObject = {
                                amountAttr: amount,
                                idAttr: id,
                                keyAttr: key,
                                monthKeyAttr: monthKey,
                                yearKeyAttr: yearKey,
                            };
                            if (amount > 0) {
                                generateRow(item, rowObject, true);
                            } else {
                                generateRow(item, rowObject, false);
                            }
                            $("#billStatus").append(item);
                        }
                    }
                }
            }
        }
    }
}

function getCurrentUserBills() {
    if (document.getElementById("userId")) {
        const userId = (document.getElementById("userId") as HTMLInputElement).value;
        $.ajax({
            data: $("#userId").serialize(),
            error: (xhr, ajaxOptions, thrownError) => {
                alert(xhr.status);
                alert(thrownError);
            },
            success: (result) => {
                listCurrentGroupNet(result, userId);
                return true;
            },
            type: "GET",
            url: "/user/bills/purchases",
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getCurrentUserBills();
});
