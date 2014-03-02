<?php
include_once("InsistentSoapClient.php");
$arr = array();

try
{
    $json = json_decode($argv[1]);
    $client = new InsistentSoapClient('https://www.docsaway.com/app/api/soap/api_mail.wsdl', array('trace' => true));
    $client->setAPIConnection($json->credentials->email, $json->credentials->installationKey);
    $client->setAPICharset('UTF-8');
    $client->setAPIMode($json->credentials->mode);
    $client->setRecipientName($json->recipient->name);
    $client->setRecipientCompany($json->recipient->company);
    $client->setRecipientAddress1($json->recipient->address1);
    $client->setRecipientAddress2($json->recipient->address2);
    $client->setRecipientCity($json->recipient->city);
    $client->setRecipientState($json->recipient->state);
    $client->setRecipientZip($json->recipient->zip);
    $client->setRecipientCountry($json->recipient->country);
    $client->setPDFFile(base64_decode(file_get_contents($json->file)));
    $client->setPrintingStation('AUTO', false, 'BW', 80);
    $client->execute();

    // GET METHODS: Transaction //
    $arr['transaction']['approved'] = $client->getTransaction('APPROVED');
    $arr['transaction']['price'] = $client->getTransaction('PRICE');
    $arr['transaction']['reference'] = $client->getTransaction('REFERENCE');
    $arr['transaction']['date'] = $client->getTransaction('DATE');
    $arr['transaction']['balance'] = $client->getTransaction('BALANCE');

    $arr['station']['id'] = $client->getStation('ID');
    $arr['station']['iso2'] = $client->getStation('ISO2');
    $arr['station']['country'] = $client->getStation('COUNTRY');
    $arr['station']['city'] = $client->getStation('CITY');
    $arr['station']['id'] = $client->getStation('COURIERID');
    $arr['station']['name'] = $client->getStation('COURIERNAME');
    $arr['station']['zone'] = $client->getStation('ZONE');

    $arr['document']['envelope'] = $client->getTransaction('ENVELOPE');
    $arr['document']['ink'] = $client->getTransaction('INK');
    $arr['document']['paper'] = $client->getTransaction('PAPER');
    $arr['document']['size'] = $client->getTransaction('SIZE');

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
