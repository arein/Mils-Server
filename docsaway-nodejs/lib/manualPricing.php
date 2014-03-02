<?php
ini_set('soap.wsdl_cache_enabled',0);
ini_set('soap.wsdl_cache_ttl',0);
$arr = array();
try
{
    $json = json_decode($argv[1]);
    $client = new SoapClient('https://www.docsaway.com/app/api/soap/api_pricing.wsdl');
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
    $arr['error'] = $e->getMessage();
    echo json_encode($arr);
}

?>
