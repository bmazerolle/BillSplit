/*
* Summary: sends a request to mark all user notifications as seen
* Parameters: none
* Returns: none
 */
function clearNotifications() {
    $.ajax({
        data: $("#userId").serialize(),
        error: (xhr, ajaxOptions, thrownError) => {
            alert(xhr.status);
            alert(thrownError);
        },
        type: "POST",
        url: "/user/notifications/clear",
    });
}

document.addEventListener("DOMContentLoaded", () => {
    clearNotifications();
});
