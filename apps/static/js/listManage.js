function hide() {
    $("#optList").hide();
    $("#createList").hide();
    $("#removeList").hide();
}

function show(idAction) {
    if (idAction == 2) {
        window.location = "/list/select/:list:channel";
        return;
    }

    hide();

    if (idAction == 0)
        $("#optList").show();
    else if (idAction == 1)
        $("#createList").show();
    else
        $("#removeList").show();
}

function confirmation() {
    let select = $('#idList :selected')[0];
    return bootbox.confirm({
        message: `Êtes-vous sur de vouloir supprimer la liste ${select.attributes.nameList.value} ?`,
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Annuler'
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Supprimer'
            }
        },
        callback: (res) => {
            if (res)
                $("#formRemoveList").submit();
        }
    });
}

jQuery.getScript("/js/utils.js", checkNotif);

function checkNotif() {
    let createList = findGetParameter("createList");
    let removeList = findGetParameter("removeList");
    let editChannelList = findGetParameter("editChannelList");

    if (createList) {
        removeParam("createList");
        createList = createList == 'true';
        let notifEl = document.getElementById("notif");
        notifEl.innerHTML = `<div class="alert alert-${!createList ? "danger" : "success"}" role="alert">` +
            `${!createList ? "La liste n'a pas pu être crée (Nom déjà pris)" : "La liste a été crée avec succès"}` +
            '</div>';

        setTimeout(() => notifEl.parentNode.removeChild(notifEl), 3000);
    } else if (removeList) {
        removeParam("removeList");
        removeList = removeList == 'true';
        let notifEl = document.getElementById("notif");
        notifEl.innerHTML = `<div class="alert alert-${!removeList ? "danger" : "success"}" role="alert">` +
            `${!removeList ? "La liste n'a pas pu être supprimée" : "La liste a été supprimée avec succès"}` +
            '</div>';

        setTimeout(() => notifEl.parentNode.removeChild(notifEl), 32000);
    } else if (editChannelList) {
        removeParam("editChannelList");
        editChannelList = editChannelList == 'true';
        let notifEl = document.getElementById("notif");
        notifEl.innerHTML = `<div class="alert alert-${!editChannelList ? "danger" : "success"}" role="alert">` +
            `${!editChannelList ? "L'édition des chaînes de la liste a rencontré une erreur" : "L'édition des chaînes de la liste a été enregistrée"}` +
            '</div>';

        setTimeout(() => notifEl.parentNode.removeChild(notifEl), 32000);
    }
}