/**
 * Summary: Creates a cookie for user session
 */
function login() {
    $("#loginForm").attr("action", "/login/auth");
    $("#loginForm").attr("method", "POST");
    const date = new Date();
    const expireDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(),
        date.getMinutes());
    document.cookie = encodeURIComponent("expires=" + expireDate.toString() + ";username=" + $("#email-log").val()
    + ";SameSite=None");
    // @ts-ignore
    document.getElementById("loginForm").submit();
}

document.addEventListener("DOMContentLoaded", () => {

    $("#loginButton").on("click", (e) => {
        // @ts-ignore
        if (e.defaultPrevented) {
            return; // Should do nothing if the default action has been cancelled
        }
        login();
    });
});
