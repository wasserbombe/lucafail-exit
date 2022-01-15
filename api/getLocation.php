<?php
    $res = array(
        "data" => array(),
        "code" => 500
    ); 
    if (isset($_REQUEST["id"])){
        
        // get scanner
        $scanner = file_get_contents("https://app.luca-app.de/api/v3/scanners/".preg_replace("~[^a-z0-9-]~i", "", $_REQUEST["id"]));

        $scanner = json_decode($scanner, true);
        // get location
        $location = file_get_contents("https://app.luca-app.de/api/v3/locations/".$scanner["locationId"]);

        $location = json_decode($location, true);
        if ($location && !empty($location["name"])){
            $locRes = array(
                "name" => $location["name"],
                "groupName" => $location["groupName"],
                "locationName" => $location["locationName"],
            ); 

            $res["data"] = $locRes; 
            $res["dbg"] = array(
                "scanner" => $scanner,
                "location" => $location
            );
            $res["code"] = 200;
        }

    }

    http_response_code($res["code"]);
    header('Content-Type: application/json');
	header('Pragma: no-cache');
	header('Expires: Fri, 01 Jan 1990 00:00:00 GMT');
	header('Cache-Control: no-cache, no-store, must-revalidate');
    echo json_encode($res, JSON_PRETTY_PRINT);
?>