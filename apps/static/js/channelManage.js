function toggleList() {
    let elDiv = $("#showList");
    let elBtn = $("#showListButton");
    elDiv.toggle();

    if (elDiv.is(":visible"))
        elBtn.text("Cacher les chaînes");
    else
        elBtn.text("Afficher les chaînes");
}

jQuery.getScript("/js/utils.js", checkNotif);

function checkNotif() {
    let createChannel = findGetParameter("createChannel");

    if (createChannel) {
        removeParam("createChannel");
        createChannel = createChannel == 'true';
        let notifEl = document.getElementById("notif");
        notifEl.innerHTML = `<div class="alert alert-${!createChannel ? "danger" : "success"}" role="alert">` +
            `${!createChannel ? "La chaîne n'a pas pu être ajoutée" : "La chaîne a été ajoutée avec succès"}` +
            '</div>';

        setTimeout(() => notifEl.parentNode.removeChild(notifEl), 3000);
    }
}