const replaceText = (range, text) => {
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
}

const msg = new SpeechSynthesisUtterance();

document.addEventListener("mouseup", async (e) => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text && text != "") {
        chrome.storage.sync.get(["lang", "enableTranslation"], (options) => {
            const range = selection.getRangeAt(0).cloneRange();
            selection.removeAllRanges();
            selection.addRange(range);

            console.log(options);
            if (options.enableTranslation) {
                const req = { method: "translateSelection", body: text, lang: options.lang };
                chrome.runtime.sendMessage(req, response => {
                    replaceText(range, response);

                    msg.text = response;
                    msg.lang = options.lang;
                    window.speechSynthesis.speak(msg);
                });
            } else {
                msg.text = text;
                window.speechSynthesis.speak(msg);
            }
        });
    }
});

document.addEventListener('mousedown', function (e) {
    controlsDOM.style.visibility = 'hidden';
    window.speechSynthesis.cancel();
});
