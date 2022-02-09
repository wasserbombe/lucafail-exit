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

        /****************************************************************************************************************************************************
         * Zweckentfremdung KPNV-Daten 
         */
        // https://fragdenstaat.de/a/237332 / Landratsamt Rhein-Neckar-Kreis - Gesundheitsamt
        "237332" => array(
            "contactDataDate" => "2022-01-25",
            "contactDataRequests" => 1,
            "contactDataRequestsNotRejected" => 0
        )
    ); 
?>