<?php
    $res = array(
        "data" => array(),
        "code" => 500
    ); 
    function performGETRequest($url){
        $cache_fn = __DIR__."/cache/".md5($url).".json";

        // disable requests to Luca API; use local sample data instead
        if (preg_match("~/scanners/~", $url)){
            $cache_fn = __DIR__."/cache/a7bf3cbba401864c40feabe9d6685558.json";
        } else {
            $cache_fn = __DIR__."/cache/6ced03b5f62f3b2b9b229da43e11de29.json";
        }

        if (file_exists($cache_fn)){
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
        
        return json_decode($result, true);
    }
    if (isset($_REQUEST["id"])){
        
        // get scanner
        $scanner = performGETRequest("https://app.luca-app.de/api/v3/scanners/".preg_replace("~[^a-z0-9-]~i", "", $_REQUEST["id"]));

        // get location
        $location = performGETRequest("https://app.luca-app.de/api/v3/locations/".$scanner["locationId"]);

        if ($location && !empty($location["name"])){
            // don't return Luca's plain location JSON as it holds sensitive data...
            $locRes = array(
                "name" => $location["name"],
                "groupName" => $location["groupName"],
                "locationName" => $location["locationName"],
            ); 

            $res["data"] = $locRes; 

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