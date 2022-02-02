(function(){
    /*$.ajax({
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
    });*/

    var healthDepartments = []; 
    $.ajax({
        "url": "/api/health_departments.json",
        "success": function(data){
            healthDepartments = data.data;
        }
    });
    $("#hdsupport_searchterm").on("keyup", function(){
        if (healthDepartments.length > 0) {
            var searchTerm = $(this).val().toLowerCase();
            $("#hdsupport_table tbody").html("");
            healthDepartments.forEach((department) => {
                var take = false; 
                department.zips.forEach((zip) => {
                    if (zip.toLowerCase().indexOf(searchTerm) > -1) {
                        take = true; 
                    }
                }); 
                if (take || department.name_long.toLowerCase().indexOf(searchTerm) > -1) {
                    var $tr = $("<tr>");
                    $tr.append($("<td>").html('<b>'+department.name + "</b><br>" + department.name_addition));
                    var pct = department.zips_supported.length/department.zips.length;
                    var pct_full = pct*100; 
                    
                    var angebunden_html = ""; 
                    var text = ""; 
                    if (pct == 1){
                        angebunden_html = '<span class="badge-anonym badge-anonym-nie" title="'+((Math.round(pct_full * 100) / 100) + "%")+'">angebunden</span>';
                        text = 'Laut Luca-Webseite ist dieses Gesundheitsamt angebunden und könnte eine Kontaktnachverfolgung über das Luca-System durchführen. Jedoch haben die meisten Gesundheitsämter die Kontaktnachverfolgung eingestellt, die meisten Bundesländer haben die Luca-Lizenz außerdem gekündigt.<br>Du solltest nachfragen, ob dieses Gesundheitsamt wirklich noch Luca nutzt, und falls nicht, das Gesundheitsamt auffordern, den Eintrag auf der Luca-Webseite ändern zu lassen und Betreiber:innen von Locations darüber zu benachrichtigen. Denn wenn das Gesundheitsamt nicht mehr Luca nutzt, dann ist es sinnlos, Luca als Betreiber:in oder Nutzer:in weiterhin zu nutzen. ';
                    } else if (pct == 0){
                        angebunden_html = '<span class="badge-anonym badge-anonym-immer" title="'+((Math.round(pct_full * 100) / 100) + "%")+'">nicht angebunden</span>';
                        text = "Laut Luca-Webseite ist dieses Gesundheitsamt nicht angebunden. D.h. es wird keine Kontaktnachverfolgung über die Luca-App durchgeführt und es erfolgt keine Warnung zu einer möglichen Infektion über die Luca-App. Für Betreiber:innen als auch Nutzer:innen hat die Luca-App hier also keinen Nutzen. ";
                    } else {
                        angebunden_html = '<span class="badge-anonym badge-anonym-meist" title="'+((Math.round(pct_full * 100) / 100) + "%")+'">teilw. angebunden?</span>';
                        text = "❓ Nur ein Teil des Gebiets, für welches dieses Gesundheitsamt verantwortlich ist, ist laut Luca-Webseite angebunden. Es fehlen: "+ department.zips_not_supported.join(', ') + '.';
                    }
                    $tr.append($("<td>").html(angebunden_html));
                    $tr.append($("<td>").html(text));

                    var $actiontd = $("<td>");
                    if (department.fds && department.fds.id){
                        // lucaexit-missbrauch_kpnv
                        if (department.fds_requests && department.fds_requests["lucaexit-missbrauch_kpnv"] && department.fds_requests["lucaexit-missbrauch_kpnv"].length > 0){
                            var requestMissbrauch = department.fds_requests["lucaexit-missbrauch_kpnv"][0];
                            var $btn_request = $("<button>");
                            if (requestMissbrauch.resolution == "successful"){
                                $btn_request.addClass("btn btn-success btn-sm").html("<small>Antwort: Daten-Missbrauch?</small>");
                            
                                
                            } else {
                                $btn_request.addClass("btn btn-outline-secondary btn-sm").html("<small>Laufende Anfrage: Daten-Missbrauch?</small>");
                            }
                            $btn_request.click(function(){
                                var fds_url = "https://fragdenstaat.de"+requestMissbrauch.url+"?pk_campaign=lucaexit";

                                window.open(fds_url, "_blank");
                            });

                            $actiontd.append($btn_request);
                        } else {
                            var fds_txt_missbrauch = [
                                'Vor dem Hintergrund, dass es in Mainz (vgl. https://www.swr.de/swraktuell/rheinland-pfalz/mainz/polizei-ermittelt-ohne-rechtsgrundlage-mit-daten-aus-luca-app-100.html) und in Heilbronn (vgl. https://www.stimme.de/regional/region/polizei-wollte-luca-daten-haben-art-4581945) Anfragen an Landratsämter/Gesundheitsämter nach Informationen aus der Corona-Kontaktnachverfolgung gab:',
                                '1. Schriftverkehr seit Januar 2021, auch elektronischer Art, zu allen Anfragen auf Übermittlung oder Einsicht in Kontaktverfolgungsdaten durch andere Stellen als dem Gesundheitsamt (z.B. Polizei, Verwaltung, Finanzverwaltung, Staatsanwaltschaft, etc.) und/oder zu allen Anfragen auf Übermittlung oder Einsicht in Kontaktverfolgungsdaten zu einem anderen Zweck als dem im Infektionsschutzgesetz genannten. Personenbezogene Daten können geschwärzt werden.',
                                '',                            
                                '2. Die Gesamtzahl von entsprechenden Anfragen seit Anfang 2021,',
                                '- bei denen es zu einer Auskunft kam (inkl. Form: E-Mail, Fax, Einsicht, ...)',
                                '- bei denen eine Auskunft durch Sie abgelehnt wurde (inkl. Grund)',
                                '- die erfolglos waren, weil entsprechende Daten nicht vorhanden waren',
                                'jeweils gegliedert nach',
                                '- Daten/Anfragen, die sich auf die Luca-App beziehen (weil darüber erfasst oder explizit danach gefragt)',
                                '- Daten/Anfragen, die sich NICHT auf Luca beziehen (weil nicht darüber erfasst)',
                                'beide Punkte untergliedert nach',
                                '- Herkunft der Anfrage (Amt, Behörde, etc.)',
                                '',
                                '(bitte antworten Sie OBERHALB dieser E-Mail - vielen Dank!)',
                                ''
                            ];

                            var $btn_frag_missbrauch = $("<button>").addClass("btn btn-primary btn-sm").html("<small>Frag nach Daten-Missbrauch!</small>");
                            $btn_frag_missbrauch.click(function(){
                                var fds_url = "https://fragdenstaat.de/anfrage-stellen/an/"+department.fds.slug+"/"
                                                +"?subject="+encodeURIComponent(department.name + ": Nutzung von Kontaktnachverfolgungsdaten zu anderen Zwecken als dem Infektionsschutz")
                                                +"&body="+encodeURIComponent(fds_txt_missbrauch.join("\r\n"))
                                                +"&tags="+encodeURIComponent("luca-app,lucaexit-missbrauch_kpnv,kontaktnachverfolgung")
                                                +"&hide_similar=1&hide_public=1&hide_editing=1&pk_campaign=lucaexit";
                                                ;

                                window.open(fds_url, "_blank");
                            });

                            $actiontd.append($btn_frag_missbrauch);
                        }

                        // lucaexit-nutzungsstatus
                        if (department.fds_requests && department.fds_requests["lucaexit-nutzungsstatus"] && department.fds_requests["lucaexit-nutzungsstatus"].length > 0){
                            var request = department.fds_requests["lucaexit-nutzungsstatus"][0];
                            var $btn_request = $("<button>");
                            if (request.resolution == "successful"){
                                $btn_request.addClass("btn btn-success btn-sm").html("<small>Antwort: Luca-Nutzung</small>");
                            
                                
                            } else {
                                $btn_request.addClass("btn btn-outline-secondary btn-sm").html("<small>Laufende Anfrage: Luca-Nutzung</small>");
                            }
                            $btn_request.click(function(){
                                var fds_url = "https://fragdenstaat.de"+request.url+'?pk_campaign=lucaexit';

                                window.open(fds_url, "_blank");
                            });

                            $actiontd.append($btn_request);
                        } else {
                            var fds_txt_status = [
                                'Informationen über die aktuelle Nutzung des Luca-Systems in Ihrer Behörde, insbesondere:',
                                '- Ist Ihre Behörde derzeit an das Luca-System angebunden? Wenn ja, seit wann und bis wann?',
                                '- Nutzt Ihre Behörde das Luca-System? Wenn ja, für was (Kontaktnachverfolgung bzw. -ermittlung, "Warnungen", ...)? ',
                                '- Sollte Ihre Behörde derzeit keine Kontaktnachverfolgung (mehr) durchführen: Wurden Luca-Locations darüber informiert, dass eine Kontaktdatenerfassung damit nutzlos ist bzw. wurden die Luca-Nutzer darüber benachrichtigt, dass sie im Infektionsfall nicht mehr von Ihnen via Luca-App informiert werden?',
                                '- Wie viele Kontaktnachverfolgungen wurden in den letzten 3 bzw. 6 Monaten via Luca durchgeführt (bitte einzeln beantworten)?',
                                '- Ist eine weitere Nutzung des Luca-System durch das Bundesland vorgesehen? Falls nein, ziehen Sie einen eigenen Vertrag mit Luca in Betracht?',
                                '- Wäre eine Nutzung von Luca Connect in Ihrem Amt derzeit möglich?',
                                '- Wie oft wurde Luca Connect bzw. die dazugehörigen Features von Ihnen bereits genutzt?',
                                '',
                                '(bitte antworten Sie OBERHALB dieser E-Mail - vielen Dank!)',
                                ''
                            ];

                            if (pct > 0){
                                fds_txt_status.push('Die Webseite von Luca gibt an, dass folgende Postleitzahlen von Ihrer Behörde angebunden sind: ' + department.zips_supported.join(', ') + ' - d.h., dass Sie dort mithilfe des Luca-Systems eine Kontaktnachverfolgung durchführen. Entspricht das der Realität, d.h. können Luca-Nutzer in diesem Gebiet sich darauf verlassen, dass Sie - sollte es sich um eine Luca-Location handeln - sie darauf hinweisen, dass Sie möglicherweise Kontakt mit einer infizierten Person hatten?');
                                if (pct < 1){
                                    fds_txt_status.push('Die Luca-Webseite gibt darüber hinaus an, dass folgende Postleitzahlen nicht angebunden sind: ' + department.zips_not_supported.join(', ') + ' - ist das richtig?'); 
                                }
                            } else {
                                fds_txt_status.push('Die Webseite von Luca gibt an, dass derzeit kein von Ihnen betreuter Bereich ans Luca-System angeschlossen ist. Ist das richtig?');
                            }

                            var $btn_frag_status = $("<button>").addClass("btn btn-primary btn-sm").html("<small>Frag nach Luca-Status!</small>");
                            $btn_frag_status.click(function(){
                                var fds_url = "https://fragdenstaat.de/anfrage-stellen/an/"+department.fds.slug+"/"
                                                +"?subject="+encodeURIComponent(department.name + ": Aktuelle Nutzung des Luca-Systems in Ihrer Behörde")
                                                +"&body="+encodeURIComponent(fds_txt_status.join("\r\n"))
                                                +"&tags="+encodeURIComponent("luca-app,lucaexit-nutzungsstatus")
                                                +"&hide_similar=1&hide_public=1&hide_editing=1&pk_campaign=lucaexit";
                                                ;

                                window.open(fds_url, "_blank");
                            });
                            $actiontd.append($btn_frag_status);
                        }
                    }
                    $tr.append($actiontd);
                    

                    $("#hdsupport_table tbody").append($tr);
                }
            });
        }
    }); 
})(); 