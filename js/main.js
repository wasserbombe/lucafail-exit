(function(){
    var request_types_friendly_names = {
        "lucaexit-missbrauch_kpnv": "Zweckentfremdung Kontaktdaten",
        "lucaexit-nutzungsstatus": "Nutzungsstatus Luca"
    };
    /**
     * Warning examples
     */

    $("div.scenario .scenario-info").text("Kein Infektionsfall");
    $("div.scenario .scenario-field").on("mouseover", function(){
        var warnedPersons = 0; 
        $(this).addClass("warner");
        var text = ""; 
        if ($(this).hasClass("scenario-field-cwa")){
            warnedPersons = $(this).parent().find(".scenario-field-cwa").length-1; 
            $(this).parent().find(".scenario-field-cwa:not(.warner)").each((e, elem) => {
                $(elem).addClass((Math.floor(Math.random()*10)%4 == 0)?"warned-green":"warned");
            });
            text = "Ein CWA-Nutzer hat sich mit dem Corona-Virus infiziert.";
        } else {
            text = "Ein Luca-Nutzer hat sich mit dem Corona-Virus infiziert.";
        }

        var pct = warnedPersons / ($(this).parent().find(".scenario-field").length-1) * 100;
        text += " " + warnedPersons + " andere Personen ("+(Math.round(pct * 10)/10)+"%) wurden gewarnt";
        if ($(this).hasClass("scenario-field-cwa")){
            text += ", da die Corona-Warn-App bei positivem Testergebnis automatisch und ohne Zutun eines Gesundheitsamtes warnt.";
        } else {
            text += ", da die Luca-App nur bei Zutun eines Gesundheitsamtes warnt - die aber Luca-Daten nicht mehr auswerten können und daher nicht informieren.";
        }
        $(this).parent().find(".scenario-info").text(text); 
    }); 

    $("div.scenario .scenario-field").on("mouseout", function(){
        $("div.scenario .scenario-field").removeClass("warned").removeClass("warner").removeClass("warned-green"); 
        $("div.scenario .scenario-info").text("Kein Infektionsfall");
    }); 

    /**
     * MAP
     */
     $("#results_type a").on("click", function (){
        var resulttype = $(this).data("resulttype");
        $("#results_type a").attr("class", "btn btn-outline-primary");
        $("#results_type a[data-resulttype=" + resulttype + "]").removeClass("btn-outline-primary").addClass("btn-primary").addClass("active");
    });

    var mymap = L.map('map_container', {
        fullscreenControl: false
    }).setView([51.3, 10.5], 6); 

    L.tileLayer('/osmtiles/tile.php?s={s}&z={z}&x={x}&y={y}', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

    /*
    var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        labels = ["<b>Legend</b>"];
        labels.push('<i class="circle" style="background: #006400;"></i> Test');
        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(mymap);
    */

    var kreislayer = L.geoJSON(kreise_geojson, {
        onEachFeature: function (feature, layer){
            var content = []; 
            content.push("<b>" + feature.properties.local_name + "</b>");
            content.push(feature.properties.all_tags["name:prefix"]);
            content.push(feature.properties.all_tags["de:regionalschluessel"]);
            content = content.join("<br>");
            layer.bindPopup(content);
        },
        style: function(feature) {
            if (feature.properties.NAME_3 === "Rhein-Neckar-Kreis") {
                console.log(feature); 
            }
            if (feature.properties.all_tags["de:regionalschluessel"]){
                return {
                    color: '#f00',
                    weight: 1,
                    opacity: 0.5
                };
            } else {
                return {
                    color: '#888',
                    weight: 1,
                    opacity: 0.3
                };
            }
        },
        filter: function(feature, layer) {
            var take = !!feature.properties.all_tags["de:regionalschluessel"];

            // HAMBURG 
            // admin_level": "9", "name:prefix": "Stadtbezirk
            if (!take && feature.properties.all_tags.admin_level === "9" && feature.properties.all_tags["name:prefix"] === "Stadtbezirk") {
                take = true;
            }

            if (!take){
                console.log("ignored", feature.properties.name);
            }
            return take; 
        }
    
    }).addTo(mymap);

    var refreshMapContent = () => {
        var rtype = $("#results_type a.active").data("resulttype");
        console.log("Type: ", rtype); 
        var count_one_request = count_two_requests = count_kreise = 0; 
        kreislayer.eachLayer(function(layer) {
            var content = []; 
            content.push("<b>" + layer.feature.properties.local_name + "</b>");
            content.push(layer.feature.properties.all_tags["de:regionalschluessel"]);

            var kschluessel = String(layer.feature.properties.all_tags["de:regionalschluessel"]).substring(0,5);
            var amt = null; 
            healthDepartments.forEach((department) => {

                department.kreise.forEach((kreis) => {
                    if (kreis.kschluessel == kschluessel){
                        amt = department; 
                    }
                });
            });

            if (amt){
                content.push("Zuständiges Gesundheitsamt: "+amt.name + (amt.name_addition?" ("+amt.name_addition+")":""));
                var requests_todo = Object.keys(amt.fds_requests).length;
                var requests_done = 0; 
                for (var rtype in amt.fds_requests){
                    if (amt.fds_requests.hasOwnProperty(rtype)){
                        if (amt.fds_requests[rtype].length > 0) {
                            requests_done++; 
                            if (request_types_friendly_names[rtype]){
                                var request = amt.fds_requests[rtype][0]; 
                                content.push('✔️ <a href="https://fragdenstaat.de'+request.url+'" target="_blank">' + request_types_friendly_names[rtype] + '</a>');
                            } else {
                                content.push("✔️ " + rtype);
                            }
                            
                        } else {
                            if (request_types_friendly_names[rtype]){
                                content.push("❌ " + request_types_friendly_names[rtype]);
                            } else {
                                content.push("❌ " + rtype);
                            }
                        }
                    }
                }
                if (requests_done > 0) count_one_request++; 
                if (requests_done > 1) count_two_requests++;
                count_kreise++;
                if (requests_done < requests_todo){
                    content.push("Du kannst die restlichen Anfragen über die Suche oben an das Gesundheitsamt richten.")
                }

                var min = 0.2, max = 0.85; 
                if (requests_done == 0){
                    layer.setStyle({color: "black", fillOpacity: 0.2});
                } else {
                    
                    var per_request = (max-min)/requests_todo; 
                    var opacity = min + (requests_done*per_request);

                    if (requests_done != 2) console.log("opacity", opacity); 

                    layer.setStyle({color: "#006400", fillOpacity: opacity});
                }
            } else {
                content.push("Uns fehlt aktuell die Zuordnung zu einem Gesundheitsamt für diesen Kreis."); 
            }
            content = content.join("<br>");
            layer.bindPopup(content);
        });

        $("#progress_one_request")
            .css("width", ((count_one_request-count_two_requests)/count_kreise*100)+"%")
            .attr("aria-valuenow", count_one_request-count_two_requests)
            .attr("aria-valuemin", 0)
            .attr("aria-valuemax", count_kreise);
        $("#progress_two_requests")
            .css("width", (count_two_requests/count_kreise*100)+"%")
            .attr("aria-valuenow", count_two_requests)
            .attr("aria-valuemin", 0)
            .attr("aria-valuemax", count_kreise);
    };
    

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
        "url": "/api/health_departments.min.json",
        "success": function(data){
            healthDepartments = data.data;
        },
        "complete": function (data){
            showHDList(); 
            refreshMapContent(); 
        }
    });

    var HDPage = 0; 
    var HDToShow = 10; 
    var HDListPaginationClickHandler = function(e){
        e.preventDefault(); 
        var $this = $(this); 
        var page = $this.data("page");
        console.log($this);
        console.log("Navigate to page", page);
        if (page >= 0){
            HDPage = page; 
        }
        
        showHDList(); 
    };
    var showHDList = () => {
        if (healthDepartments.length > 0) {
            var searchTerm = $("#hdsupport_searchterm").val().toLowerCase();
            $("#hdsupport_table tbody").html("");

            HDFilteredList = []; 
            healthDepartments.forEach((department) => {
                // FILTER
                var take = true; 

                if (searchTerm.length > 0){
                    var takeByZIP = false;
                    department.zips.forEach((zip) => {
                        if (zip.toLowerCase().indexOf(searchTerm) > -1) {
                            takeByZIP = false; 
                        }
                    }); 
                    take = takeByZIP || department.name_long.toLowerCase().indexOf(searchTerm) > -1; 
                }

                var onlyAnsweringHDs = $("#onlyAnsweringHDs").is(":checked");
                if (onlyAnsweringHDs){
                    if (Object.keys(department.fds_feedback).length == 0){
                        take = false; 
                    }
                }

                var onlyNonAskedHDs = $("#onlyNonAskedHDs").is(":checked");
                if (onlyNonAskedHDs){
                    var min_requests = 10; 
                    for (a in department.fds_requests){
                        if (department.fds_requests.hasOwnProperty(a)){
                            if (department.fds_requests[a].length < min_requests){
                                min_requests = department.fds_requests[a].length;
                            }
                        }
                    }
                    if (min_requests > 0) take = false; 
                }

                if (take) {
                    HDFilteredList.push(department);
                }
            });

            $(".HDListPagination").html("");
            var maxPage = Math.ceil(HDFilteredList.length/HDToShow);
            for (var p = 0; p < maxPage; p++){
                if (
                    p >= maxPage-2
                    || p == HDPage
                    || p < 2
                    || p == HDPage+1
                    || p == HDPage-1
                ){
                        
                    var $pli = $("<li>").addClass("page-item").attr("data-page", p).on("click", HDListPaginationClickHandler);
                    if (p == HDPage){
                        $pli.addClass("active");
                    }
                    var $pa = $("<a>").addClass("page-link").html(p+1);
                    $pli.append($pa);
                    $(".HDListPagination").append($pli);
                } else if (p == HDPage+2 || p == HDPage-2){
                    var $pli = $("<li>").addClass("page-item");
                    var $pa = $("<a>").addClass("page-link").html("...");
                    $pli.append($pa);
                    $(".HDListPagination").append($pli);
                }
            }
            // prev
            var $pli = $("<li>").addClass("page-item");
            if (HDPage > 0){
                $pli.attr("data-page", HDPage-1).on("click", HDListPaginationClickHandler);
            } else {
                $pli.addClass("disabled");
            }
            $pli.append($("<span>").addClass("page-link").html("&laquo; Letzte"));
            $(".HDListPagination").prepend($pli);

            // next
            var $pli = $("<li>").addClass("page-item");
            if (HDPage < maxPage-1){
                $pli.attr("data-page", HDPage+1).on("click", HDListPaginationClickHandler);
            } else {
                $pli.addClass("disabled");
            }
            $pli.append($("<span>").addClass("page-link").html("Nächste &raquo;"));
            $(".HDListPagination").append($pli);

            HDFilteredList.forEach((department, d) => {
                if (d >= HDPage*HDToShow && d < (HDPage+1)*HDToShow){
                    d++;

                    var $tr = $("<tr>");
                    $tr.append($("<td>").html('<b>'+department.name + "</b><br>" + department.name_addition));
                    var pct = department.zips_supported.length/department.zips.length;
                    var pct_full = pct*100; 
                    
                    var angebunden_html = ""; 
                    var text = ""; 
                    if (pct == 1){
                        angebunden_html = '<span class="badge-anonym badge-anonym-nie" title="'+((Math.round(pct_full * 100) / 100) + "%")+'">angebunden</span>';
                    } else if (pct == 0){
                        angebunden_html = '<span class="badge-anonym badge-anonym-immer" title="'+((Math.round(pct_full * 100) / 100) + "%")+'">nicht angebunden</span>';
                    } else {
                        angebunden_html = '<span class="badge-anonym badge-anonym-meist" title="'+((Math.round(pct_full * 100) / 100) + "%")+'">teilw. angebunden?</span>';
                    }
                    $tr.append($("<td>").html("<small>"+angebunden_html+"</small>"));
                    
                    // connected?
                    var connected_html = "❓";
                    if (department.fds_feedback && typeof department.fds_feedback.isConnected !== "undefined"){
                        if (department.fds_feedback.isConnected){
                            connected_html = "✔️";
                        } else {
                            connected_html = "❌";
                        }
                    }
                    if (department.fds_feedback && typeof department.fds_feedback.connectedSince !== "undefined"){
                        if (department.fds_feedback.connectedSince == null && typeof department.fds_feedback.isConnected !== "undefined" && !department.fds_feedback.isConnected){
                            connected_html += "<br>(nie)";
                        } else {
                            connected_html += "<br>(seit " + department.fds_feedback.connectedSince + ")";
                        }
                    }
                    if (department.fds_feedback && typeof department.fds_feedback.connectedUntil !== "undefined" && department.fds_feedback.connectedUntil != null){
                        connected_html += "<br>(bis " + department.fds_feedback.connectedUntil + ")";
                    }
                    $tr.append($("<td>").html("<small>"+connected_html+"</small>"));

                    // used
                    var used_html = "❓";
                    if (department.fds_feedback && typeof department.fds_feedback.isUsed !== "undefined"){
                        if (department.fds_feedback.isUsed){
                            used_html = "✔️";
                        } else {
                            used_html = "❌";
                        }
                    }
                    $tr.append($("<td>").html("<small>"+used_html+"</small>"));

                    // luca connect
                    var luca_connect_html = "❓";
                    if (department.fds_feedback && typeof department.fds_feedback.lucaConnectPossible !== "undefined"){
                        if (department.fds_feedback.lucaConnectPossible){
                            luca_connect_html = "✔️";
                        } else {
                            luca_connect_html = "❌";
                        }
                    }
                    if (department.fds_feedback && typeof department.fds_feedback.lucaConnectUsed !== "undefined"){
                        if (department.fds_feedback.lucaConnectUsed){
                            luca_connect_html += "<br>(bereits genutzt)";
                        } else {
                            luca_connect_html += "<br>(nie genutzt)";
                        }
                    }
                    $tr.append($("<td>").html("<small>"+luca_connect_html+"</small>"));

                    // beschreibung
                    var beschreibung = []; 
                    if (department.fds_feedback && typeof department.fds_feedback.date !== "undefined"){
                        beschreibung.push("Antwort v. " + department.fds_feedback.date);
                    }
                    $tr.append($("<td>").html("<small>" + beschreibung.join("<br>") + "</small>"));

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
                        $actiontd.append("<br>");

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
    };
    $("#hdsupport_searchterm").on("keyup", function(){
        HDPage = 0; // reset paging
        showHDList(); 
    }); 
    $("form input[type=checkbox]").on("change", function(){
        HDPage = 0; // reset paging
        showHDList(); 
    });
})(); 