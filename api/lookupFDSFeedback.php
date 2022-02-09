<?php
    $fds_feedback = array(
        // Aktuelle Nutzung
        // https://fragdenstaat.de/a/240218 / Gesundheitsamt Städteregion Aachen
        "240218" => array(
            "date" => "2022-02-08",
            "isConnected" => false,
            "connectedSince" => null,
            "connectedUntil" => null,
            "isUsed" => false,
            "isLucaWebsiteCorrect" => true,
            "usage" => [],
            "nonUsageInfo" => false,
            "contactTracings3m" => 0,
            "contactTracings6m" => 0,
            "usagePlannedState" => false,
            "usagePlannedDepartment" => false,
            "lucaConnectPossible" => false,
            "lucaConnectUsed" => false,
            "isModellregion" => false
        ),

        // https://fragdenstaat.de/a/240148 / Mansfeld Südharz - Amt für Gesundheit
        "240148" => array(
            "date" => "2022-02-08",
            "isConnected" => true,
            "connectedSince" => "2021-06-02",
            "connectedUntil" => null,
            "isUsed" => false,
            "isLucaWebsiteCorrect" => true,
            "usage" => [],
            "nonUsageInfo" => false,
            "contactTracings3m" => 0,
            "contactTracings6m" => 0,
            "usagePlannedState" => false,
            "usagePlannedDepartment" => null,
            "lucaConnectPossible" => null,
            "lucaConnectUsed" => false,
            "isModellregion" => false
        ),

        // https://fragdenstaat.de/a/240089 / Mansfeld Südharz - Amt für Gesundheit
        "240089" => array(
            "date" => "2022-02-08",
            "isConnected" => true,
            "connectedSince" => "BW",
            "connectedUntil" => "2022-03-31",
            "isUsed" => false,
            "isLucaWebsiteCorrect" => true,
            "usage" => ["Kontaktpersonennachverfolgung"],
            "nonUsageInfo" => false,
            "contactTracings3m" => 4,
            "contactTracings6m" => 4,
            "usagePlannedState" => false,
            "usagePlannedDepartment" => false,
            "lucaConnectPossible" => false,
            "lucaConnectUsed" => false,
            "isModellregion" => false
        ),

        // https://fragdenstaat.de/a/239316 / Hochsauerlandkreis - Gesundheitsamt Fachdienst 37
        "239316" => array(
            "date" => "2022-02-09",
            "isConnected" => true,
            "connectedSince" => "2020",
            "connectedUntil" => null,
            "isUsed" => false,
            "isLucaWebsiteCorrect" => true,
            "usage" => [],
            "nonUsageInfo" => false,
            "contactTracings3m" => 0,
            "contactTracings6m" => 0,
            "usagePlannedState" => null,
            "usagePlannedDepartment" => null,
            "lucaConnectPossible" => null,
            "lucaConnectUsed" => null,
            "isModellregion" => true
        ),

        // https://fragdenstaat.de/a/239387 / Bezirksamt Pankow von Berlin - Abt. Gesundheit und Soziales
        "239387" => array(
            "date" => "2022-01-31",
            "isConnected" => true,
            "connectedSince" => null,
            "connectedUntil" => null,
            "isUsed" => false,
            "isLucaWebsiteCorrect" => true,
            "usage" => ["Einzelfälle"],
            "nonUsageInfo" => false,
            "contactTracings3m" => 0,
            "contactTracings6m" => 1,
            "usagePlannedState" => null,
            "usagePlannedDepartment" => null,
            "lucaConnectPossible" => null,
            "lucaConnectUsed" => null,
            "isModellregion" => false
        ),

        // https://fragdenstaat.de/a/239623 / Bezirksamt Treptow-Köpenick von Berlin - Gesundheitsamt
        "239623" => array(
            "date" => "2022-02-02",
            "isConnected" => true,
            "connectedSince" => null,
            "connectedUntil" => null,
            "isUsed" => false,
            "isLucaWebsiteCorrect" => true,
            "usage" => [],
            "nonUsageInfo" => false,
            "contactTracings3m" => 0,
            "contactTracings6m" => 0,
            "usagePlannedState" => null,
            "usagePlannedDepartment" => false,
            "lucaConnectPossible" => null,
            "lucaConnectUsed" => false,
            "isModellregion" => false
        ),

        // https://fragdenstaat.de/a/239570 / Bezirksamt Marzahn-Hellersdorf von Berlin - Gesundheitsamt
        "239570" => array(
            "date" => "2022-02-03",
            "isConnected" => true,
            "connectedSince" => "2021-04-00",
            "connectedUntil" => null,
            "isUsed" => false,
            "isLucaWebsiteCorrect" => true,
            "usage" => [],
            "nonUsageInfo" => false,
            "contactTracings3m" => 0,
            "contactTracings6m" => 0,
            "usagePlannedState" => null,
            "usagePlannedDepartment" => false,
            "lucaConnectPossible" => null,
            "lucaConnectUsed" => false,
            "isModellregion" => false
        ),

        // https://fragdenstaat.de/a/239936 / Landkreis Cuxhaven - Gesundheitsamt
        "239936" => array(
            "date" => "2022-02-07",
            "isConnected" => true,
            "connectedSince" => "2021-03-01",
            "connectedUntil" => "2022-02-28",
            "isUsed" => false,
            "isLucaWebsiteCorrect" => true,
            "usage" => [],
            "nonUsageInfo" => false,
            "contactTracings3m" => 0,
            "contactTracings6m" => 8,
            "usagePlannedState" => null,
            "usagePlannedDepartment" => false,
            "lucaConnectPossible" => true,
            "lucaConnectUsed" => false,
            "isModellregion" => false
        ),


        /****************************************************************************************************************************************************
         * Zweckentfremdung KPNV-Daten 
         */
        // https://fragdenstaat.de/a/237332 / Landratsamt Rhein-Neckar-Kreis - Gesundheitsamt
        "237332" => array(
            "contactDataDate" => "2022-01-25",
            "contactDataRequests" => 1,
            "contactDataRequestsNotRejected" => 0
        ),

        // https://fragdenstaat.de/a/239373 / Bezirksamt Pankow von Berlin - Abt. Gesundheit und Soziales
        "239373" => array(
            "contactDataDate" => "2022-02-01",
            "contactDataRequests" => 0,
            "contactDataRequestsNotRejected" => 0
        ),

        // https://fragdenstaat.de/a/239606 / Kreis Herzogtum Lauenburg - Gesundheitsamt
        "239606" => array(
            "contactDataDate" => "2022-02-02",
            "contactDataRequests" => 0,
            "contactDataRequestsNotRejected" => 0
        ),

        // https://fragdenstaat.de/a/239718 / Stadt Oldenburg - Gesundheitsamt
        "239718" => array(
            "contactDataDate" => "2022-02-02",
            "contactDataRequests" => 0,
            "contactDataRequestsNotRejected" => 0
        ),

        // https://fragdenstaat.de/a/239734 / Landkreis Cloppenburg – Gesundheitsamt
        "239734" => array(
            "contactDataDate" => "2022-02-04",
            "contactDataRequests" => 0,
            "contactDataRequestsNotRejected" => 0
        ),
    ); 
?>