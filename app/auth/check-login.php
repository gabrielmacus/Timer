<?php
use \Firebase\JWT\JWT;



if(!empty($_COOKIE["tk"]))
{
    $tk =$_COOKIE["tk"];

   if(!$userData = JWT::decode($tk,$db->find()["secret"],array('HS256')))
   {

       throw new Exception("auth.error.invalidData");
   }
}
else
{

    if(!empty($_POST["user"]) && !empty($_POST["password"]))
    {

       $match = false;

       $jsonDb =$db->find();

       foreach ($jsonDb["users"] as $k=>$user)
       {
           if($user["username"] ==  $_POST["user"] && $user["password"]==$_POST["password"])
           {
               $match = $jsonDb["users"][$k];
               $jsonDb["users"][$k]["session"] = time();
               $db->update($jsonDb);
           }
       }

        if(!$match)
        {
            throw new Exception("auth.error.invalidData");
        }
        else
        {
            unset($match["password"]);
            setcookie("tk",JWT::encode($match,$jsonDb["secret"]));

        }


    }
    else
    {
        throw new Exception("auth.error.noData");
    }

}