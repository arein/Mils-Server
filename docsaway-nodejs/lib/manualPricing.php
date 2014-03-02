<?php
include_once("InsistentSoapClient.php");
$arr = array();
try
{
    $json = json_decode($argv[1]);
    $client = new SoapClient('https://www.docsaway.com/app/api/soap/api_pricing.wsdl', array('trace' => true));
    $client->setAPIConnection($json->credentials->email, $json->credentials->installationKey);
    $client->setStation($json->station->station);
    $client->setCourier($json->station->courier);
    $client->setPaper(80);
    $client->setInk('CL');
    $client->setZone($json->station->zone);
    $client->setPageCount($json->pages);
    $client->setCurrency('AUD');
    $arr['result']['price'] = $client->getPrice();
    //$arr['debug']['report'] = $client->APIReport();
    $arr['debug']['errno'] = $client->APIErrorNumber();
    echo json_encode($arr);
}
catch (Exception $e)
{
    $arr['error'] = $e->getMessage() . ", " . $e->getTraceAsString();
    echo json_encode($arr);
}

?>
