/**
 * Summary: Formatting option for the options
 * @param group
 */
function format(group: any): any {
    const $option = $("<tr><td><b></b></td></tr><tr><td><p></p></td></tr>");
    $option.find("b").text(group.name);
    $option.find("p").text(group.id);
    return $option;
}

/**
 * Summary: Adds a member to a payer field of a bill
 * @param members
 * @param group
 * @param user
 */
function addToPayers(members: string[], group?: string, user?: string) {
    for (const member of members) {
        $.ajax({
            data: "group=" + group + "&member=" + member + "&payer=" + user,
            error: (xhr, ajaxOptions, thrownError) => {
                alert(xhr.status);
                alert(thrownError);
            },
            type: "POST",
            url: "/bill/payer/add",
        });
    }
}

/**
 * Summary: Creates a new bill and passes it to be added to a group
 * @param members
 * @param group
 * @param user
 */
function createBill(members: string[], group?: string, user?: string) {
    $.ajax({
        data: "billPayee=" + user + "&" + $.param({billPayer: members}) + "&billGroup=" + group,
        success: (result) => {
            addBillsToGroup(result, group);
        },
        type: "POST",
        url: "/bill/create",
    });
}

/**
 * Summary: Adds a member to a group
 */
function groupMemberAdd() {
    const memberData = $("#member-add").serialize();
    $.ajax({
        data: memberData,
        success: (result) => {
            addGroupToUser($("#group-id").val());
        },
        type: "POST",
        url: "/group/member/add",
    });
}

/**
 * Summary: Adds functionality for the submit button
 */
function addSubmit() {
    $("#member-join-submit").on("click", () => {
        $.ajax({
            data: "group=" + $("#group-id").val(),
            success: (result) => {
                createBill(result.members, "" + $("#group-id").val(),  "" + $("#group-members").val());
                addToPayers(result.members, "" + $("#group-id").val(),  "" + $("#group-members").val());
                groupMemberAdd();
            },
            type: "GET",
            url: "/group/members",
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // @ts-ignore
    $("#group-id").select2({
        ajax: {
            data: (params: any): any => {
                return {
                    q: params.term,
                };
            },
            dataType: "json",
            processResults: (groups: any): any => {
                return {
                    results: $.map(groups, (group: any): any => {
                        return {
                            id: group._id,
                            members: group.Members,
                            name: group.Name,
                            text: group.Name,
                        };
                    }),
                };
            },
            url: "/groups/query",
        },
        templateResult: format,

    });

    addSubmit();
});
