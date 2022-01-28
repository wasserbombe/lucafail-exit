<?php
    $res = array(
        "data" => array(),
        "code" => 200,
        "data" => array()
    );

    $url = "https://app.luca-app.de/api/v3/supportedZipCodes/";
    $cache_fn = __DIR__.'/cache/'.md5($url).'.json';
    if (file_exists($cache_fn) && filemtime($cache_fn) > time()-12*60*60){
        $json = file_get_contents($cache_fn);
    } else {
        $json = file_get_contents($url); 
        file_put_contents($cache_fn, $json);
    }

    $supportedZIPs = json_decode($json, true);

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


    $gemeindenRAW = file_get_contents(__DIR__.'/data/staedte+plz.tsv');
    foreach (explode("\n", $gemeindenRAW) as $line) {
        $line = trim($line);
        if (empty($line)) continue;
        $parts = explode("\t", $line);

        
        if (sizeof($parts) <= 14 || strlen($parts[13]) != 5) continue;
        
        $zip = $parts[13];
        $kreisschluessel = $parts[2].$parts[3].$parts[4];
        $kreisschluessel2kreis[$kreisschluessel]["zips"][] = $zip;

        if (in_array($zip, $supportedZIPs)){
            $kreisschluessel2kreis[$kreisschluessel]["supportedZIPs"][] = $zip; 
        } else {
            $kreisschluessel2kreis[$kreisschluessel]["unsupportedZIPs"][] = $zip;
        }
    }

    foreach ($kreisschluessel2kreis as $kid => $kreis){
        $res["data"][] = array(
            "kschluessel" => $kid,
            "kname" => $kreis["name"],
            "supportedZIPs" => sizeof($kreis["supportedZIPs"]),
            //"_supportedZIPs" => $kreis["supportedZIPs"],
            "unsupportedZIPs" => sizeof($kreis["unsupportedZIPs"]),
            //"_unsupportedZIPs" => $kreis["unsupportedZIPs"],
            "totalZIPs" => sizeof($kreis["zips"])
        );
    }

    file_put_contents(__DIR__.'/supportLookup.json', json_encode($res));
?>