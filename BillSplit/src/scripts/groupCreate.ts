document.addEventListener("DOMContentLoaded", () => {
    // @ts-ignore
    $("#group-members").select2();
    $.get("/users", (users: any) => {
        for (const user of users) {
            const option = document.createElement("option");
            option.value = user._id;
            option.text = user.Name;
            const select = document.getElementById("group-members");
            if (select) {
                select.appendChild(option);
            }
        }
    });
    // Add group function
    $(() => {
        $("#group-add-submit").on("click", () => {
            const groupData = $("#group-add").serialize();
            $.ajax({
                data: groupData,
                error: (xhr, ajaxOptions, thrownError) => {
                    alert(xhr.status);
                    alert(thrownError);
                },
                success: (result) => {
                    addGroupToUser(result.groupId);
                    createBills(result.groupId);
                },
                type: "POST",
                url: "/group/add",
            });
        });
    });
});

// Adds a group to a user
function addGroupToUser(groupId: any) {
    const members = {
        group: groupId,
        users: $("#group-members").val(),
    };
    const membersData = $.param(members);
    $.ajax({
        data: membersData,
        error: (xhr, ajaxOptions, thrownError) => {
            alert(xhr.status);
            alert(thrownError);
        },
        success: (result) => {
            $("#message").html(result.message);
        },
        type: "POST",
        url: "/user/group/addGroup",
    });
}

// Creates the bills for all group members upon group creation
function createBills(groupId: string) {
    const groupMembers = $("#group-members").val();
    const groupMemberStringArray = groupMembers as string[];
    for (let i = 0; i < groupMemberStringArray.length; i++) {
        const payersBeforePayee = groupMemberStringArray.slice(0, i);
        const payersAfterPayee = (groupMemberStringArray.slice(i + 1, groupMemberStringArray.length));
        const payers = payersBeforePayee.concat(payersAfterPayee);
        const payee = groupMemberStringArray[i];
        const bill = {
            billGroup: groupId,
            billPayee: payee,
            billPayer: payers,
        };
        const billData = $.param(bill);
        $.ajax({
            data: billData,
            error: (xhr, ajaxOptions, thrownError) => {
                alert(xhr.status);
                alert(thrownError);
            },
            success: (result) => {
                addBillsToGroup(result, groupId);
            },
            type: "POST",
            url: "/bill/create",
        });
    }
}

// Adds the created bills to the group they were created for
function addBillsToGroup(insertedBills: any, groupId: any) {
    const bill = {
        bills: insertedBills,
        group: groupId,
    };
    const billData = $.param(bill);
    $.ajax({
        data: billData,
        error: (xhr, ajaxOptions, thrownError) => {
            alert(xhr.status);
            alert(thrownError);
        },
        success: (result) => {
            $("#message").html("Great Success");
        },
        type: "POST",
        url: "/group/bill/add",
    });
}
