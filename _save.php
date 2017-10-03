<?php


try {


    include("app/autoload.php");

    include("app/auth/check-login.php");


    $db->update($_POST);

     echo json_encode(true);
    
}
catch (Exception $e)
{  
    http_response_code(500);
    if(isset($lang[$e->getMessage()]))
    {

       echo json_encode($lang[$e->getMessage()]);
    }
    else
    {
        echo json_encode($e->getMessage());
    }
}
