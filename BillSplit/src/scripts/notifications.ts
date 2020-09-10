/**
 * Summary maps a purchase to a string representing its frequency
 * @param purchase
 */
function getInterval(purchase: any) {
    let interval = "None";
    switch (+purchase.frequency) {
        case 1: {
            interval = "one time";
            break;
        }
        case 7: {
            interval = "weekly";
            break;
        }
        case 30: {
            interval = "monthly";
            break;
        }
        case 365: {
            interval = "yearly";
            break;
        }
        default: {
            interval = "unknown frequency";
            break;
        }
    }
    return interval;
}

/*
* Summary: takes the notification objects and displays them as link to a group's page
* Parameters: Array of notifications
* Returns: none
 */
function displayNotifications(results: any) {
    for (const result of results.reverse()) {
        if (result.Pending) {
            showPending(result);
        } else {
            showDeclined(result);
        }
    }
}

/**
 * Summary: Shows a decline notification to
 * @param result
 */
function showDeclined(result: any) {
    const link = document.createElement("li");
    $(link).attr("class", "list-group-item");
    let isNew: string = "";
    if (!result.Seen) {
        isNew = "New";
    }
    $(link).html("<div class='row' style='height:35px'>" +
        "<div class='col'><p><b>" + result.FromOb[0].Name + "</b> " +
        "Declined a purchase of " + result.declineItem[0].Name + " for $" +
        result.declineItem[0].Price +
        " <span class='badge badge-secondary'>" + isNew + "</span>" +
        "</p>" +
        "</div>" +
        "<div class='col' style='text-align:right'>" +
        result.Date.substring(0, 10) +
        "</div>" +
        "</div>");
    $("#notificationBox").append(link);
}

/**
 * Summary: Shows a pending notification
 * @param result
 */
function showPending(result: any) {
    const interval = getInterval(result.Purchase);
    let isNew: string = "";
    if (!result.Seen) {
        isNew = "New";
    }
    let adButtons: string = "";
    if (!result.Accepted) {
        adButtons = "</div>" +
            "<div class='col' style='text-align:right'>" +
            "<button name='notification' onclick='accept(this)' value='" +
            result._id + "' type='button' class='btn btn-outline-success'>Accept</button>" +
            "<button name='notification' data-item='" + result.Purchase.item +
            "' data-date=" + result.Purchase.date + " data-user='" + result.To + "' data-Group=" +
            result.Group + " data-from='" + result.From + "' onclick='decline(this)' value='" + result._id +
            "'type='button' " + "class='btn btn-outline-danger'>Decline</button>" +
            "</div>" +
            "</div>";
    }
    const link = document.createElement("li");
    $(link).attr("class", "list-group-item");
    $(link).attr("href", "/group/home?user=" + $("#userName").val() + "&group=" +
        result.Group + "&user-id=" + $("#userId").val());
    $(link).html("<div class='row' style='height:35px'>" +
        "<div class='col'>" +
        "<p><b>" + result.GroupOb[0].Name + "</b>: " +
        result.FromOb[0].Name + " added a " + interval + " purchase of " + result.Purchase.quantity + " " +
        result.ItemOb[0].Name + " for $" + result.ItemOb[0].Price +
        " <span class=\"badge badge-secondary\">" + isNew + "</span>" +
        "</p>" + adButtons);
    $("#notificationBox").append(link);
}

/**
 * Summary: Takes a notification input tag as a input and accepts a purchase
 * @param notification
 */
function accept(notification: any) {
    $.ajax({
        data: "notification=" + $(notification).val(),
        error: (xhr, ajaxOptions, thrownError) => {
            alert(xhr.status);
            alert(thrownError);
        },
        success: (result) => {
            if (result.successful) {
                location.reload();
            }
        },
        type: "POST",
        url: "/user/notifications/accept",
    });
}

/**
 * Summary: Takes a notification input tag as a input and declines a purchase
 * @param notification
 */
function decline(notification: any) {
    $.ajax({
        data: "notification=" + notification.getAttribute("value") + "&from="
            + notification.getAttribute("data-user") + "&to=" + notification.getAttribute("data-from")
            + "&item=" + notification.getAttribute("data-item"),
        success: (result) => {
            if (result.successful) {
                location.reload();
            }
        },
        type: "DELETE",
        url: "/user/notifications/decline",
    });

    $.ajax({
        data: "item=" + notification.getAttribute("data-item") + "&date=" +
            notification.getAttribute("data-date") + "&group=" + notification.getAttribute("data-group") +
            "&user=" + notification.getAttribute("data-user"),
        type: "POST",
        url: "/bill/purchase/remove",
    });
}

/*
* Summary: Sends a get request to get all of the notification of a user
* Parameters: none
* Returns: none
 */
function getNotifications() {
    $.ajax({
        data: $("#userId").serialize(),
        error: (xhr, ajaxOptions, thrownError) => {
            alert(xhr.status);
            alert(thrownError);
        },
        success: (result) => {
            displayNotifications(result.notifications);
        },
        type: "GET",
        url: "/user/notifications",
    });
}

if (document.URL.includes("notifications")) {
    document.addEventListener("DOMContentLoaded", () => {
        getNotifications();
        clearNotifications();
    });
}
