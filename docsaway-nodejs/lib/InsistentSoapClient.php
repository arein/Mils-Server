<?php
class InsistentSoapClient extends SoapClient
{
    public function __call($function_name, $arguments)
    {
        $result = false;
        $max_retries = 5;
        $retry_count = 0;

        while(! $result && $retry_count < $max_retries)
        {
            try
            {
                $result = parent::__call($function_name, $arguments);
            }
            catch(SoapFault $fault)
            {
                if($fault->faultstring != 'Could not connect to host')
                {
                    throw $fault;
                }
            }
            sleep(1);
            $retry_count ++;
        }
        if($retry_count == $max_retries)
        {
            throw new SoapFault('100009', 'Could not connect to host after 5 attempts');
        }
        return $result;
    }
}
?>