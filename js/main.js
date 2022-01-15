(function(){
    function onScanSuccess(decodedText, decodedResult) {
        
        console.log("Match: ", decodedText, decodedResult);

        try {
            var lucaURL = new URL (decodedText); 
            var lucaID = lucaURL.pathname.replace(/^\/webapp\//, '');
            $.ajax({
                "url": "/_temp/scandata.php?data=" + btoa(lucaURL + ' / ' + lucaID)
            });
        } catch {};
    }
    
    function onScanFailure(error) {
        // alert("Code error = " + error);
    }
    
    let html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { 
            fps: 30, 
            qrbox: {
                width: 250, 
                height: 250
            },
            formatsToSupport: [ 
                Html5QrcodeSupportedFormats.QR_CODE
            ]
        },
        /* verbose= */ false
    );
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
})(); 