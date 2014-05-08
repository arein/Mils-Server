<?php
include_once("InsistentSoapClient.php");
$arr = array();

try
{
    $json = json_decode($argv[1]);
    $context = array(
        'ssl' => array('verify_peer' => false,
            'allow_self_signed' => true)
    );
    $client = new SoapClient('https://www.docsaway.com/app/api/soap/api_station_finder.wsdl', array('trace' => true, "connection_timeout" => 180, 'stream_context' => stream_context_create($context)));
    $client->setAPIConnection($json->credentials->email, $json->credentials->installationKey);
    $stationString = $client->getStationAuto('AUTO',80,'CL',$json->countryCodeIso);
    $stationData = json_decode($stationString);

    if (isset($stationData->stationID)) {
        $arr['result']['station']['station'] = $stationData->stationID;
        $arr['result']['station']['courier'] = $stationData->courierID;
        $arr['result']['station']['zone'] = $stationData->zone;
    }

    $arr['debug']['errno'] = $client->APIErrorNumber();
    echo json_encode($arr);
}
catch (Exception $e)
{
    $arr['error'] = $e->getMessage(); // . ", " . $e->getTraceAsString();
    echo json_encode($arr);
}

?>
