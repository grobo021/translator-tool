const controlsDOM = document.createElement('article');
controlsDOM.setAttribute('class', 'controls');
document.body.appendChild(controlsDOM);

const renderBubble = (range, text) => {
    let rect = range.getBoundingClientRect();
    controlsDOM.style.top = `calc(${rect.top}px - 50px)`;
    controlsDOM.style.left = `calc(${rect.left}px + calc(${rect.width}px / 2) - 40px)`;

    controlsDOM.innerHTML = `<audio controls><source src=${text} type="text/plain"></source></audio>`;
    controlsDOM.style.visibility = 'visible';
}

const replaceText = (range, text) => {
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
}

const msg = new SpeechSynthesisUtterance();

document.addEventListener("mouseup", async (e) => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text && text != "") {
        const { options } = await chrome.storage.sync.get("options");

        const range = selection.getRangeAt(0).cloneRange();
        selection.removeAllRanges();
        selection.addRange(range);

        if (options.enableTranslation) {
            chrome.runtime.sendMessage({ method: "translateSelection", body: text, lang: options.lang }, response => {
                replaceText(range, response);

                msg.text = response;
                msg.lang = options.lang;
                window.speechSynthesis.speak(msg);
                renderBubble(range, text);
            });
        } else {
            msg.text = text;
            window.speechSynthesis.speak(msg);
            renderBubble(range, text);
        }
    }
});

document.addEventListener('mousedown', function (e) {
    controlsDOM.style.visibility = 'hidden';
    window.speechSynthesis.cancel();
});
