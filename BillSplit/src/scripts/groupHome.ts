/**
 * Summary: Connect the page loading to the group in the url
 */
function getGroup() {
    $.ajax({
        data: $("#groupId").serialize(),
        success: (result) => {
            for (const member of result.group.UserOs) {
                $("#names").append(member.Name + ", ");
            }
            // @ts-ignore
            $("#names").html($("#names").text().slice(0, -2));
        },
        type: "GET",
        url: "/group",
    });
}

/**
 * Gets this months information and display the range its in
 */
function getPeriod() {
    const month = [];
    month[0] = "Jan ";
    month[1] = "Feb ";
    month[2] = "Mar ";
    month[3] = "Apr";
    month[4] = "May ";
    month[5] = "Jun ";
    month[6] = "Jul ";
    month[7] = "Aug ";
    month[8] = "Sept ";
    month[9] = "Oct ";
    month[10] = "Nov ";
    month[11] = "Dec ";
    const date = new Date();
    const firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    $("#period").html(month[firstDate.getMonth()] + firstDate.getDate() + " - "
        + month[firstDate.getMonth()] + lastDate.getDate());
}

/**
 * Summary: Connects the group leave button to teh /user/group/remove endpoint
 */
function userLeaveGroup() {
    $.ajax({
        data: $("#groupId").serialize() + "&" + $("#userId").serialize() + "&" + $("#userName").serialize(),
        error: (xhr, ajaxOptions, thrownError) => {
            alert(xhr.status);
            alert(thrownError);
        },
        method: "POST",
        success: ((result) => {
            window.location.replace("/group/view?user=" + $("#userName").val());
        }),
        url: "/user/group/remove",
    });
}

/**
 * Summary: Connects the leave group button to teh /group/leave endpoint
 */
function leaveGroup() {
    $("#leaveGroupDiv").on("shown.bs.modal",  () => {
        $("#leave-group").trigger("focus");
    });
    $("#group-leave-submit").on("click", () => {
        $.ajax({
            data: $("#groupId").serialize() + "&" + $("#userId").serialize(),
            error: (xhr, ajaxOptions, thrownError) => {
                alert(xhr.status);
                alert(thrownError);
            },
            method: "POST",
            success: ((result) => {
                userLeaveGroup();
            }),
            url: "/group/member/remove",
        });
    });
}

/**
 * Summary: graphs a set of points by adding common dates together
 * @param points
 * @param graphName
 */
async function graphPurchases(points: any, graphName: string) {
    const date = new Date();
    const yVals: number[] = new Array(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()).fill(0);
    const days: string[] = new Array(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());

    for (let i = 1; i < days.length + 1; i += 1) {
        days[i - 1] = "" + i;
    }
    for (const point of points) {
        yVals[point.x] += point.y;
    }
    const frame = $(graphName);
    // @ts-ignore
    const graph = new Chart(frame, {
        data: {
            datasets: [{
                data: yVals,
                label: "Spending this month",
            }],
            labels: days,
        },
        type: "line",
    });
}

/**
 * Summary: Formats purchase and lists them on the page
 * @param purchases
 */
async function listGroupPurchases(purchases: any, limit: number = 0) {
    purchases.sort((a: any, b: any) => {
        if (a.date > b.date) {
            return -1;
        } else {
            return 1;
        }
    });
    let i = 0;
    for (const purch of purchases) {
        // List item
        const item = document.createElement("a");
        $(item).attr("class", "list-group-item list-group-item-action");
        $(item).html("<p><b>" + purch.Payee.Name + " : </b> Added " + purch.quantity + " " + purch.item.Name
            + " for $" + purch.item.Price + " for " + getInterval(purch) + " intervals</p><div style='right-align'>" +
            purch.date.toString().substr(0, 10) + "</div>");
        $("#purchaseList").append(item);
        i += 1;
        if (limit !== 0 && i >= limit) {
            break;
        }
    }
}

/**
 * Creates bar graph for group's user spending
 * @param purchases
 */
async function barGraph(purchases: any) {
    const points: any = {};
    for (const purch of purchases) {
        if (points[purch.Payee.Name] === undefined) {
            points[purch.Payee.Name] = purch.price * purch.quantity;
        } else {
            points[purch.Payee.Name] += purch.price * purch.quantity;
        }
    }
    const names: string[] = [];
    const yVals: number[] = [];

    // tslint:disable-next-line:forin
    for (const name in points) {
        names.push(name);
        yVals.push(points[name]);
    }

    const frame = $("#barGraph");
    // @ts-ignore
    const graph = new Chart(frame, {
        data: {
            datasets: [{
                data: yVals,
                label: "Spending this month per person" }],
            labels: names,
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true } } ] } },
        type: "bar",
    });
}

/**
 * Summary: adds all of the purchases of a group's prices together
 * @param purchases
 */
async function groupTotal(purchases: any) {
    let total = 0;
    for (const purch of purchases) {
        total += purch.price;
    }
    $("#groupTotal").html("Total spending this month: <b><u>$" + Math.round(total * 100) / 100 + "</u></b>");
}

/**
 * Summary: Gets a set of a groups purchases and formats them to be graphed
 */
function getGroupPurchases() {
    $.ajax({
        data: $("#groupId").serialize(),
        error: (xhr, ajaxOptions, thrownError) => {
            alert(xhr.status);
            alert(thrownError);
        },
        method: "GET",
        success: ((results) => {
            groupTotal(results)
                .catch((err) => {
                    $("#groupTotal").html("Could not find spending for this month");
                });
            listGroupPurchases(results)
                .catch((err) => {
                    $("#listingError").html("Could not calculate spending forecast");
                });
            barGraph(results)
                .catch((err) => {
                    $("#memberSpendingError").html("Could not calculate spending forecast");
                });
            const date = new Date();
            const points: any = [];
            for (const purch of results) {
                let dayWFreq = 0;
                const purchDate = new Date(purch.date).getDate();
                // Account Frequencies are used for forecasting spending, the date object is used to get the last day
                // in the month
                while (dayWFreq + purchDate < new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()) {
                    points.push({x: purchDate + dayWFreq, y: purch.item.Price * purch.quantity});
                    dayWFreq += purch.frequency;
                    if (purch.frequency === 1) {
                        break;
                    }
                }
            }
            graphPurchases(points, "#purchaseGraph")
                .catch((err) => {
                    $("#forecastError").html("Could not calculate spending forecast");
                });
        }),
        url: "/group/bills/purchases",
    });
}

/**
 * Summary: script ran after content is loaded
 */
if (document.URL.includes("group/home")) {
    document.addEventListener("DOMContentLoaded", () => {
        getGroup();
        getPeriod();
        leaveGroup();
        getGroupPurchases();
        $(() => {
            // @ts-ignore
            $("#help").popover();
        });
    });
}
