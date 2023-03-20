require("jquery");

$(document).ready(function () {
    initPageContentLinks()
});

function initPageContentLinks() {
    $("a").each(function () {
        const link = $(this);

        const url = link.attr("href");
        if (url.startsWith("https://") || url.startsWith("http://")) {
            link.attr("target", "_blank");
            link.addClass("link-external");
        } else {
            link.addClass("link-internal");
        }
    });
}
