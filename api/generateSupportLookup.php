<?php
    // mapping table: health department identifier => frag den staat ID
    // only those that weren't mapped via name automatically
    $hd2fds = array(
        "1.07.0.58." => 14894,  // / Kreisverwaltung  Eifelkreis Bitburg-Prüm / Amt 14 Gesundheitswesen
        "1.05.9.13." => 4060,   // / Stadt Dortmund / Gesundheitsamt
        "1.05.1.12." => 4061,   // / Stadt Duisburg / Gesundheitsamt
        "1.15.0.87.02." => 7484,// / Landkreis Mansfeld-Südharz / Gesundheitsamt
        "1.05.5.70." => 4103,   // / Kreis-Warendorf / Gesundheitsamt
        "1.05.5.15." => 4086,   // / Stadt Münster / Amt für Gesundheit, Veterinär- und Lebensmittelangelegenheiten
        "1.05.7.62." => 4075,   // / Kreisverwaltung Höxter / Gesundheits- und Veterinärwesen
        "1.06.4.39." => 17012,  // / Kreisausschuss Rheingau-Taunus / Gesundheitsamt
        "1.12.0.52." => 15048,  // / Stadt Cottbus/S / Fachbereich 53 Gesundheit
        "1.03.4.59." => 14808,  // / Landkreis und Stadt Osnabrück / Fachdienst Gesundheit
        "1.05.9.15." => 4070,   // / Stadt Hamm / Gesundheitsamt
        "1.05.1.11." => 4063,   // / Stadt Düsseldorf / Gesundheitsamt
        "1.05.1.58." => 4082,   // / Landkreis Mettmann / Gesundheitsamt
        "1.05.1.62." => 4094,   // / Landkreis Rheinkreis Neuss / Gesundheitsamt
        "1.06.6.11." => 14884,  // / Stadt Kassel / Gesundheitsamt Region Kassel
        "1.05.7.11." => 4054,   // / Stadt Bielefeld / Gesundheits-, Veterinär- u. Lebensmittelüberwachungsamt
        "1.12.0.73." => 15064,  // / Landkreis Uckermark / Gesundheits- und Veterinäramt
        "1.04.0.11." => 6644,   // / Stadt Bremen / Gesundheitsamt
        "1.02.0.06." => 14789,  // / Freie und Hansestadt Hamburg / Bezirksamt Harburg
        "1.15.0.03." => 7408,   // / Landeshauptstadt Magdeburg / Gesundheits- und Veterinäramt
        "1.06.4.35." => 14873,  // / Main-Kinzig-Kreis / Amt für Gesundheit und Gefahrenabwehr
        "1.12.0.61." => 4364,   // / Landkreis Dahme- Spreewald / Gesundheitsamt
        "1.05.3.62." => 4093,   // / Kreisverwaltung Rhein-Erft-Kreis / Gesundheitsamt
        "1.05.1.14." => 4078,   // / Stadt Krefeld / Fachbereich 53 Gesundheit
        "1.05.1.16." => 4084,   // / Stadt Mönchengladbach / Fachbereich 53 Gesundheitsamt
        "1.05.1.19." => 4088,   // / Stadt Oberhausen / Bereich Gesundheit
        "1.05.1.24." => 4105,   // / Stadt Wuppertal / Gesundheitsamt
        "1.05.1.66." => 4102,   // / Landkreis Viersen / Gesundheitsamt
        "1.05.1.70." => 4104,   // / Landkreis Wesel / Fachbereich Gesundheitswesen
        "1.05.3.14." => 4056,   // / Stadt Bonn / Amt 53 Gesundheitsamt
        "1.05.3.15." => 4077,   // / Stadt Köln / Gesundheitsamt
        "1.05.3.34." => 4053,   // / StädteRegion Aachen / Gesundheitsamt (A53)
        "1.05.5.12." => 4058,   // / Stadt Bottrop / Gesundheitsamt
        "1.05.5.13." => 4067,   // / Stadt Gelsenkirchen / Referat Gesundheit
        "1.05.9.16." => 4073,   // / Stadt Herne / Fachbereich Gesundheit
        "1.05.9.54." => 4064,   // / Landkreis Ennepe-Ruhr-Kreis / Fachbereich Soziales und Gesundheit
        "1.14.7.29.01." => 15084
    );

    $fds_tags = array("lucaexit-missbrauch_kpnv","lucaexit-nutzungsstatus");

    include __DIR__.'/../config/config.php';

    // check if we find geocoding information for this ZIP code. If not, we'll assume it's a Postfach. 
    function isPostfach($zip){
        global $_CONFIG; 

        // Google Maps Geocoding API key, limited to IP of luca.fail
        $url = "https://maps.googleapis.com/maps/api/geocode/json?address=".urlencode($zip.", Deutschland")."&key=".$_CONFIG["gm_geolocation_api_key"];
        $res = cachedWebRequest($url, "geocoding");
        $res = json_decode($res, true);

        if (sizeof($res["results"]) == 0) return true; 

        $isDE = false; 
        foreach ($res["results"] as $result) {
            foreach ($result["address_components"] as $component){
                if ($component["short_name"] == "DE" && in_array("country", $component["types"])){
                    $isDE = true; 
                }
            }
        }
        return !$isDE;
    }

    // abstract function to perform a web request with caching functionality
    function cachedWebRequest ($url, $prefix = "", $ttl = 365*24*60*60){
        $cache_fn = __DIR__."/cache/".$prefix."_".md5($url).".json";
        if (file_exists($cache_fn) && filemtime($cache_fn) + $ttl > time()){
            $result = file_get_contents($cache_fn);
        } else {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_TIMEOUT, 20);
            $result = curl_exec($ch);
            curl_close($ch);
            file_put_contents($cache_fn, $result);
        }
        return $result;
    }

    // get all luca-supported ZIPs
    $currentSupport = file_get_contents(__DIR__."/archive/zipsupport/current.json");
    $supportedZIPs = json_decode(cachedWebRequest("https://app.luca-app.de/api/v3/supportedZipCodes/", "luca", 60*60*3), true);
    sort($supportedZIPs);
    if (json_encode($supportedZIPs, JSON_PRETTY_PRINT) != $currentSupport){
        file_put_contents(__DIR__."/archive/zipsupport/".date("Ymd_His").".json", json_encode($supportedZIPs, JSON_PRETTY_PRINT));
    }
    file_put_contents(__DIR__."/archive/zipsupport/current.json", json_encode($supportedZIPs, JSON_PRETTY_PRINT));

    // get all health departments from Frag den Staat
    $offset = 0; $limit = 50;
    $fds_departments = []; 
    $fds_departments_by_id = []; 
    do {
        $res = cachedWebRequest("https://fragdenstaat.de/api/v1/publicbody/?limit=".$limit."&classification=136&offset=".$offset."&category=8", "fds", 7*24*60*60);
        $res = json_decode($res, true);
        $offset += $limit;
        foreach ($res["objects"] as $object){
            $fds_departments_by_id[$object["id"]] = $object;
        }
        $fds_departments = array_merge($fds_departments, $res["objects"]);
    } while ($res["meta"]["next"] && sizeof($res["objects"]) == $limit);
    file_put_contents(__DIR__."/fds_departments.json", json_encode($fds_departments, JSON_PRETTY_PRINT));

    // get already existing foi requests from Frag den Staat
    $fds_requests_by_tags = [];
    foreach ($fds_tags as $tag){
        $fds_requests_by_tags[$tag] = [];

        $offset = 0; $limit = 50; 
        do {
            $res = cachedWebRequest("https://fragdenstaat.de/api/v1/request/?limit=".$limit."&offset=".$offset."&tags=".$tag, "fds", 0);
            $res = json_decode($res, true);
            $offset += $limit;
            foreach ($res["objects"] as $object){
                if (!isset($fds_requests_by_tags[$tag][$object["public_body"]["id"]])){
                    $fds_requests_by_tags[$tag][$object["public_body"]["id"]] = [];
                }
                $fds_requests_by_tags[$tag][$object["public_body"]["id"]][] = $object; 
            }
        } while ($res["meta"]["next"] && sizeof($res["objects"]) == $limit);
    }
    

    // get all PLZ / gemeinden
    $gemeinden = array(); 
    $gemeindenRAW = file_get_contents(__DIR__.'/data/staedte+plz.tsv');
    foreach (explode("\n", $gemeindenRAW) as $line) {
        $line = trim($line);
        if (empty($line)) continue;
        $parts = explode("\t", $line);

        if (sizeof($parts) <= 14 || strlen($parts[13]) != 5) continue;
        
        $zip = $parts[13];
        $kreisschluessel = $parts[2].$parts[3].$parts[4];

        $gemeinden[$zip] = array(
            "name" => $parts[7],
            "kreisschluessel" => $kreisschluessel
        );
    }

    $kreiseRAW = file_get_contents(__DIR__.'/data/kreise.tsv');
    $kreis2kreisschluessel = $kreisschluessel2kreis = array();

    foreach (explode("\n", $kreiseRAW) as $line) {
        $line = trim($line);
        if (empty($line)) continue;
        $parts = explode("\t", $line);

        if (strlen($parts[0]) != 5 || strlen($parts[2]) < 3) continue;
        $kreis2kreisschluessel[$parts[2]] = $parts[0];
        $kreisschluessel2kreis[$parts[0]] = array("name" => $parts[2], "zips" => array(), "supportedZIPs" => array(), "unsupportedZIPs" => array());
    }

    // use RKI tool to get health departments based on ZIP of towns
    $hd_found_for = array(); 
    $zips = $supportedZIPs; 
    $health_departments = array();
    foreach ($gemeinden as $zip => $gemeinde){
        if (!in_array($zip, $zips)) $zips[] = $zip;
    }
    foreach ($zips as $zip){
        if (in_array($zip, $hd_found_for)) continue;

        $res = cachedWebRequest("https://tools.rki.de/PLZTool/?q=".$zip, "rki");

        // get all zip codes for one health department, starting parsing of health department contact details
        preg_match_all('~href="/PLZTool/\?q=([0-9]{5})"~i', $res, $matches);
        if (sizeof($matches[1])){
            foreach ($matches[1] as $ozip){
                // same health department
                $hd_found_for[] = $ozip;
            }

            // load RKI document to parse health department information
            $doc = new DOMDocument();
            @$doc->loadHTML($res);

            // hd = health department
            $hd = array(
                "name" => "null",
                "zips" => $matches[1],
                "zips_supported" => array(),
                "zips_not_supported" => array(),
                "kreise" => array()
            );
            foreach ($hd["zips"] as $z => $zip){
                if (in_array($zip, $supportedZIPs)){
                    $hd["zips_supported"][] = $zip;
                } elseif (!isPostfach($zip)){
                    $hd["zips_not_supported"][] = $zip;
                }
            }
            $hd["zips"] = array_merge($hd["zips_supported"], $hd["zips_not_supported"]);
            $kschluessel_there = []; 
            foreach ($hd["zips"] as $z => $zip){
                if (isset($gemeinden[$zip]) && !in_array($gemeinden[$zip]["kreisschluessel"], $kschluessel_there)){
                    $kschluessel_there[] = $gemeinden[$zip]["kreisschluessel"];
                    $hd["kreise"][] = array(
                        "kschluessel" => $gemeinden[$zip]["kreisschluessel"],
                        "kreisname" => $kreisschluessel2kreis[$gemeinden[$zip]["kreisschluessel"]]["name"]
                    );
                }
            }
            
            // get identifier and name
            $select = $doc->getElementById("SelectedAddress_Code");
            foreach ($select->getElementsByTagName("option") as $option){
                if ($option->getAttribute("selected") == "selected"){
                    $hd["name_long"] = $option->textContent;
                    $hd["code"] = $option->getAttribute("value");
                    break;
                }
            }

            // parse health department address
            $address = $doc->getElementsByTagName("address")->item(0); 
            $hd["name"] = trim($address->getElementsByTagName("strong")->item(0)->textContent);
            $hd["address_plain"] = $address->textContent;
            $add = explode("\r\n", trim($address->textContent));
            $hd["address"] = array();
            $hd["name_addition"] = array();
            $ac = 0; 
            for ($a = sizeof($add)-1; $a >= 0; $a--){
                $add[$a] = trim($add[$a]);
                if (empty($add[$a])) continue;
                
                if ($add[$a] == $hd["name"]) break;
                if ($ac == 0){
                    $hd["address"]["state"] = str_replace(" - ","-",$add[$a]);
                } elseif ($ac == 1){
                    preg_match("~^([0-9]{5}) (.*)~", $add[$a], $matches);
                    $hd["address"]["zip"] = $matches[1];
                    $hd["address"]["city"] = $matches[2];
                } elseif ($ac == 2){
                    $hd["address"]["street"] = $add[$a];
                } else {
                    $hd["name_addition"][] = $add[$a];
                }

                $ac++; 

            }
            $hd["name_addition"] = implode(", ", $hd["name_addition"]);

            $hd["fds"] = array(); 

            // find health department on Frag den Staat
            foreach ($fds_departments as $fds_department){
                if (strpos($fds_department["name"], $hd["name"]) !== false){
                    //$hd["fds"]["id"] = $fds_department["id"];
                    $hd["fds"] = $fds_department;
                    break;
                }
            }

            if (!$hd["fds"] && isset($hd2fds[$hd["code"]])){
                    $hd["fds"] = $fds_departments_by_id[$hd2fds[$hd["code"]]];
            }

            if (!$hd["fds"]){
                echo $hd["code"]." / ".$hd["name"]." / ".$hd["name_addition"]."\n";
            } else {
                $hd["fds_requests"] = array();
                foreach ($fds_tags as $tag){
                    $hd["fds_requests"][$tag] = array();
                    if (isset($fds_requests_by_tags[$tag][$hd["fds"]["id"]])){
                        $hd["fds_requests"][$tag] = $fds_requests_by_tags[$tag][$hd["fds"]["id"]];
                    }
                }
            }

            $health_departments[$hd["code"]] = $hd;
        }
    }

    echo sizeof($health_departments)." health departments found\n";

    $res = array(
        "data" => array(),
        "code" => 200,
        "data" => array()
    );

    foreach ($health_departments as $health_department){
        $res["data"][] = $health_department; 
    }

    file_put_contents(__DIR__."/health_departments.json", json_encode($res, JSON_PRETTY_PRINT));

    // CSV-Export for FDS - https://twitter.com/fragdenstaat/status/1488101248003973123
    $csv = array();
    $csv[] = implode(";", array("code", "fds_id", "zip_codes")); 
    foreach ($health_departments as $hd){
        if (!$hd["fds"]) continue;
        $csv[] = implode(";", array($hd["code"], $hd["fds"]["id"], implode(",",$hd["zips"]))); 
    }
    $csv = implode("\n", $csv);
    file_put_contents(__DIR__.'/health_departments.csv', $csv);

?>