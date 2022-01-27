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