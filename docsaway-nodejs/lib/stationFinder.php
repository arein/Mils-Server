<?php
$arr = array();

try
{
    $json = json_decode($argv[1]);
    $client = new SoapClient('https://www.docsaway.com/app/api/soap/api_station_finder.wsdl');
    $client->setAPIConnection($json->credentials->email, $json->credentials->installationKey);
    $client->setColumnSeparator('$$$$$');
    $client->setRowSeparator('\n');
    $stationString = $client->getStationAuto('AUTO',80,'CL',$json->countryCodeIso);
    $stationData = explode("$$$$$", $stationString);

    if (count($stationData) == 3) {
        $arr['result']['station']['station'] = $stationData[0];
        $arr['result']['station']['courier'] = $stationData[1];
        $arr['result']['station']['zone'] = $stationData[2];
    }

    //$arr['debug']['report'] = $client->APIReport();
    $arr['debug']['errno'] = $client->APIErrorNumber();
    echo json_encode($arr);
}
catch (Exception $e)
{
    $arr['error'] = $e->getMessage();
    echo json_encode($arr);
}

?>
