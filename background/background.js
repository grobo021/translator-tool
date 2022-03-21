chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.method === "translateSelection") {
        const url = `https://asia-south1-virtual-transit-344710.cloudfunctions.net/translate-api?text=${request.body}&lang=${request.lang}`;
        
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
          .then(json => { sendResponse(json[0]) });
    }
    return true;
});
