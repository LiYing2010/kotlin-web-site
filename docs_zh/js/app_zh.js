$(function() {
    initTranslateLastModified();
});

function initTranslateLastModified() {
    // Use MutationObserver to detect when Writerside's app.js writes "Last modified:"
    // into the DOM (both on initial load and after SPA navigation), then replace it
    // immediately. Debounce prevents redundant calls during rapid DOM updates.
    let debounceTimer = null;
    const observer = new MutationObserver(function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(translateLastModified, 100);
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

function translateLastModified() {
    // translate "Last modified:" to Chinese
    const spanLastDate = $("span.sub-title__edit-info span");
    const text = spanLastDate.text();
    if (text.includes("Last modified")) {
        spanLastDate.text(text.replace("Last modified", "最终更新"));
    }
}
