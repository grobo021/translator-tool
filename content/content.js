const controlsDOM = document.createElement('article');
controlsDOM.setAttribute('class', 'controls');
document.body.appendChild(controlsDOM);

const renderBubble = (range, text) => {
    let rect = range.getBoundingClientRect();
    controlsDOM.style.top = `calc(${rect.top}px - 50px)`;
    controlsDOM.style.left = `calc(${rect.left}px + calc(${rect.width}px / 2) - 40px)`;

    controlsDOM.innerHTML = text;
    controlsDOM.style.visibility = 'visible';
}

const msg = new SpeechSynthesisUtterance();

document.addEventListener("mouseup", (e) => {
    let selection = window.getSelection();
    let text = selection.toString().trim();

    if (text != "") {
        let range = selection.getRangeAt(0).cloneRange();
        selection.removeAllRanges();
        selection.addRange(range);

        let lang = "hi";
        chrome.runtime.sendMessage({ method: "translateSelection", body: text, lang: lang }, (response) => {
            text = response;
            range.deleteContents();
            range.insertNode(document.createTextNode(response));

            msg.text = text;
            msg.lang = lang;
            window.speechSynthesis.speak(msg);
            renderBubble(range, text);
        });
    }
});

document.addEventListener('mousedown', function (e) {
    controlsDOM.style.visibility = 'hidden';
    window.speechSynthesis.cancel();
});
