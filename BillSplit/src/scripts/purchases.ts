/**
 * Summary: Connects the add item button to the /items/add endpoint
 */
async function addItem() {
    $("#item-add-submit").on("click", () => {
        const itemData = $("#item-add").serialize();
        $.ajax({
            data: itemData,
            error: (xhr, ajaxOptions, thrownError) => {
                alert(xhr.status);
                alert(thrownError);
            },
            success: (result) => {
                $("#createFormDiv").trigger("hide.bs.modal");
                $("#message").html("");
                $("#message").append(result.status);
            },
            type: "POST",
            url: "/items/add",
        });
    });
}

/**
 * Gets a list of items from the /items endpoint
 */
function itemsGet() {
    $.get("/items", (items: any) => {
        for (const item of items) {
            const option = new Option(item.Name + " ($" + item.Price + ")", item._id);
            $(option).html(item.Name + " ($" + item.Price + ")");
            $("#bill-item-id").append(option);
        }
    });
}

/**
 * Summary: Function used to connect button to the /purchases/add endpoint
 */
async function addPurchase() {
    $("#bill-add-submit").on("click", () => {
        const itemData = $("#purchase-add").serialize();
        const userData = $("#userId").serialize();
        const pageData = itemData + "&" + userData;

        $.ajax({
            data: pageData,
            error: (xhr, ajaxOptions, thrownError) => {
                alert(xhr.status);
                alert(thrownError);
            },
            success: (result) => {
                $("#message").html(result.status);
            },
            type: "POST",
            url: "/purchases/add",
        });
    });
}

/**
 * Summary: format function used to display item search resultd
 * @param item
 */
function formatItem(item: any) {
    return $("<p>" + item.Name + " $(" + item.Price + ")</p>");
}

/**
 * Summary: Runs script after the content is loaded
 */
document.addEventListener("DOMContentLoaded", () => {
    // Links button to Modal
    $("#createFormDiv").on("shown.bs.modal",  () => {
        $("#modalTrigger").trigger("focus");
    });
    // @ts-ignore
    $("#bill-item-id").select2({
        ajax: {
            data: (params: any): any => {
                return {
                    q: params.term,
                };
            },
            dataType: "json",
            error: (xhr: any, ajaxOptions: any, thrownError: any) => {
                alert(xhr.status);
                alert(thrownError);
            },
            processResults: (items: any): any => {
                return {
                    results: $.map(items, (item: any): any => {
                        return {
                            Name: item.Name,
                            Price: item.Price,
                            id: item._id,
                            text: item.Name + " $(" + item.Price + ")",
                        };
                    }),
                };
            },
            url: "/items/query",
        },
        // templateResult: formatItem,
    });
    // Submits a form to add an item
    addItem()
        .catch((err) => {
            $("#error").html("Could not connect add item button to endpoint");
        });

    // Submits a form to add a purchase to a bill
    addPurchase()
        .catch((err) => {
            $("#error").html("Could not connect add purchase button to endpoint");
        });
});
