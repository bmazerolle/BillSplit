/**
 * Summary: Sets a cookie and registers a user
 */
function register() {
    $("#register").attr("action", "/register/create");
    $("#register").attr("method", "POST");
    const date = new Date();
    const expireDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(),
        date.getMinutes());
    document.cookie = encodeURIComponent("expires=" + expireDate.toString() + ";username=" + $("#username-reg").val()
        + ";SameSite=None");
    // @ts-ignore
    document.getElementById("register").submit();
}

document.addEventListener("DOMContentLoaded", () => {

    $("#registerButton").on("click", (e) => {
        // @ts-ignore
        if (e.defaultPrevented) {
            return; // Should do nothing if the default action has been cancelled
        }
        register();
    });
});
