/*
* Summary: gets the count of notifications of a user and puts them in the profile badge
* Parameters: None
* Returns: none
 */
function countNotification() {
    $.ajax({
        data: $("#userId").serialize(),
        error: (xhr, ajaxOptions, thrownError) => {
            alert(xhr.status);
            alert(thrownError);
        },
        success: (result) => {
            if (result.count > 0) {
                $("#notis").html(result.count);
                $("#notis2").html(result.count);
            }
        },
        type: "GET",
        url: "/user/notification/count",
    });
}

/**
 * Summary: Checks to see if a cookies is valid or expired, logs user out if the cookie isn't valid
 */
function checkCookie() {
    const cookie = decodeURIComponent(document.cookie);
    const fields = cookie.split(";");
    const cookieOb: any = {};
    const userName = $("#userName").val();
    for (const field of fields) {
        cookieOb[field.split("=")[0]] = field.split("=")[1];
    }
    if (new Date(cookieOb.expires) < new Date() || cookieOb.username !== userName) {
        document.location.href = "/login";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    checkCookie();
    countNotification();
});
