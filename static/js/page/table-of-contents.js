require("jquery");

$(document).ready(function () {
    const headers = $(".typo-header");
    buildTableOfContents(headers);
});

function buildTableOfContents(headers) {
    const tableOfContents = $("#tableOfContents");

    tableOfContents.append("<li class='toc-node-title'>本章目录</li>")

    headers.each(function () {
        const header = $(this);

        const tocNode = $("<li></li>");
        tocNode.addClass("toc-node");
        tocNode.addClass("toc-node-" + header.prop("tagName").toLowerCase());

        const tocItem = $("<a>" + header.text() + "</a>");
        tocItem.attr("href", "#" + header.attr("id"));
        tocItem.addClass("toc-item");

        tocNode.append(tocItem)

        tableOfContents.append(tocNode);
    })
}
