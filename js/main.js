(function(){
    var locationNames = {}; 
    var qrs = [];
    function getLocationName(id){
        if (typeof locationNames[id] == 'undefined'){
            $.ajax({
                "url": "/api/getLocation.php?id=" + id,
                "success": function(data){
                    locationNames[id] = data.data;
                }
            });
        }

        return locationNames[id];
    }
    function updateTable(){
        
        $("#table tbody").html(""); 
        for (var q = 0; q < qrs.length; q++){
            var $tr = $("<tr>");
            $tr.append($("<td>").text(qrs[q].groupName));
            $tr.append($("<td>").text(qrs[q].locationName));
            $tr.append($("<td>").text(qrs[q].data?atob(qrs[q].data):""));

            $("#table tbody").append($tr);
        }
       
    }
    function addQRIfNotExists(qr){
        var found = false; 
        for (var q = 0; q < qrs.length; q++){
            if (qrs[q].name == qr.name && qrs[q].data == qr.data){
                found = true; 
                break; 
            }
        }

        if (!found){
            qrs.push(qr);
            updateTable();
        }
    }
    function onScanSuccess(decodedText, decodedResult) {
        try {
            var lucaURL = new URL (decodedText); 
            var lucaID = lucaURL.pathname.replace(/^\/webapp\//, '');
            var lname = getLocationName(lucaID);

            if (lname && lname.name){
                lname.data = ""; 

                var dataMatch = lucaURL.hash.match(/#([^\/]+)/i);
                if (dataMatch){
                    lname.data = dataMatch[1]; 
                }
                addQRIfNotExists({name: lname.name, data: lname.data, locationName: lname.locationName, groupName: lname.groupName});
            } 
            
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