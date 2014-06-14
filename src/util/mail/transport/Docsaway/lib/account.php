<?php
include_once("InsistentSoapClient.php");
$arr = array();
try
{
    // CREATE MULTI-DIMENSIONAL ARRAY FOR JSON CONVERSION //
    $json = json_decode($argv[1]);
    $arr = array();
    // GET METHODS //
    $context = array(
        'ssl' => array('verify_peer' => false,
            'allow_self_signed' => true)
    );
    $client = new SoapClient('https://www.docsaway.com/app/api/soap/api_account.wsdl', array('trace' => true, "connection_timeout" => 180, 'stream_context' => stream_context_create($context)));
    $client->setAPIConnection($json->credentials->email, $json->credentials->installationKey);

    // GET METHODS: AUDIT //
    $general_dispatch= $client->getAudit($json->reference,'GENERAL:DISPATCH');

    // DEBUGGING METHODS //
    $arr['dispatch'] = $general_dispatch;
    //$arr['debug']['report'] = $client->APIReport();
    $arr['debug']['errno'] = $client->APIErrorNumber();
    echo json_encode($arr);
}
catch (Exception $e)
{
    $arr['error'] = $e->getMessage(); // . ", " . $e->getTraceAsString();
    echo json_encode($arr);
}