(function(){
    $.ajax({
        "url": "/api/flowchart_betreiberinnen.txt",
        "success": function(data){
            var diagram = flowchart.parse(data);
            diagram.drawSVG(
                'flowchart_betreiberrinnen',
                {
                    'yes-text': 'Ja',
                    'no-text': 'Nein'
                }
            );
        }
    });

    var supportPerArea = []; 
    $.ajax({
        "url": "/api/supportLookup.json",
        "success": function(data){
            supportPerArea = data.data; 
        }
    });

    $("#lsupport_searchterm").on("keyup", function(){
        // check if lookup ready
        if (supportPerArea.length > 0){
            var searchTerm = $(this).val().toLowerCase();
            $("#lsupport_table tbody").html("");
            if (searchTerm.length > 3){
                supportPerArea.forEach((area) => {
                    if (area.kname.toLowerCase().indexOf(searchTerm) >= 0){
                        var $tr = $("<tr>");
                        $tr.append($("<td>").text(area.kname));
                        var pct = area.supportedZIPs/area.totalZIPs;
                        var pct_full = pct*100; 
                        $tr.append($("<td>").text((Math.round(pct_full * 100) / 100) + "%"));
                        $("#lsupport_table tbody").append($tr);
                        var text = ""; 
                        if (pct == 1){
                            text = '⚠️ Luca weist diesen Landkreis als "angebunden" aus. Sollte Luca vonseiten des Gesundheitsamtes hier aber gar nicht genutzt werden, dann solltest Du Luca informieren, sodass es auf der Webseite korrigiert werden kann.<br><a href="https://fragdenstaat.de/behoerden/?q='+area.kname.replace(/,.*$/, '')+'&jurisdiction=&category=&classification=gesundheit" target="_blank">Frage bei Deinem Gesundheitsamt nach</a>, ob die Information auf der Luca-Webseite stimmt und man hier Kontaktnachverfolgung betreibt und Luca nutzt.';
                        } else if (pct == 0){
                            text = "✔️ Luca weist diesen Kreis als \"nicht angebunden\" auf seiner Webseite aus. D.h. die App funktioniert in diesem Bereich nicht und keiner wiegt sich in falscher Sicherheit.";
                        } else {
                            text = "❓ Nur ein Teil des Kreises wird von Luca als \"angebunden\" ausgewiesen: Nur " + area.supportedZIPs + " von " + area.totalZIPs + ' Postleitzahlen.<br><a href="https://fragdenstaat.de/behoerden/?q='+area.kname.replace(/,.*$/, '')+'&jurisdiction=&category=&classification=gesundheit" target="_blank">Frage bei Deinem Gesundheitsamt nach</a>, ob man dort noch Luca nutzt oder nicht.';
                        }

                        $tr.append($("<td>").html(text));
                    }
                })
            }
            
        }
    });
    

    /*flowSVG.draw(SVG('flowchart_betreiberrinnen').size("100%", 700));
    flowSVG.config({
        interactive: false,
        showButtons: false,
        connectorLength: 60,
        scrollto: false,
        labelYes: "Ja",
        labelNo: "Nein"
    });
    flowSVG.shapes(
        [
            {
                label: 'start',
                type: 'process',
                text: [
                    'Prüfe die Rechtslage:',
                    'CoronaVO, Gesundheitsamt'
                ],
                //yes: 'hasOAPolicy',
                next: 'kpnv_required'
            },
            {
                label: 'kpnv_required',
                type: 'decision',
                text: [
                    'Genügt anonyme',
                    'Kontaktdatenerfassung?'
                ],
                no: 'luca_license',
                yes: 'anonympossible'
            },
            {
                label: 'anonympossible',
                type: 'decision',
                text: [
                    'Hast Du vorher',
                    'Luca genutzt?'
                ],
                no: 'usecwa'
            },{
                label: 'luca_license',
                type: 'decision',
                text: [
                    'Hat Dein Gesundheitsamt',
                    'eine Luca-Lizenz?'
                ],
                no: 'no_luca_license',
                yes: 'yes_luca_license'
            },
            {
                label: 'no_luca_license',
                type: 'finish',
                text: [
                    'Nutze handschriftliche',
                    'Kontaktdatenformulare o.',
                    'alternative Apps'
                ]
            },{
                label: 'prevluca',
                type: 'process',
                text: [
                    'Lösche Deine Location',
                    'bei Luca, entferne Luca-',
                    'QR-Codes.'
                ],
                next: 'usecwa'
            },{
                label: 'usecwa',
                type: 'finish',
                text: [
                    'Erstelle QR-Codes für',
                    'die Corona-Warn-App',
                    'und nutze diese. Entferne',
                    'bestehende Luca-QR-Codes.'
                ]
            },{
                label: 'yes_luca_license',
                type: 'finish',
                text: [
                    'Erstelle QR-Codes für',
                    'die Luca-App.',
                    'Achte darauf, dass die',
                    'Kompatibilität mit der',
                    'Corona-Warn-App aktiv ist.'
                ]

            }
        ]);*/
})(); 