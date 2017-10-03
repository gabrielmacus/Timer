<?php

class ActiveRecord
{
    public function __set($property, $value)
    {
        if (property_exists($this, $property)) {
            $this->$property = $value;
        }
        else
        {
            throw new Exception('Propiedad no definida');
        }
    }

    public function find()
    {

        $json  =file_get_contents(BASE_PATH."/app/db/database.json");
        if($json= json_decode($json,true))
        {
            return $json;
        }
        else
        {
            throw new Exception("db.error.invalidDatabase");
        }

    }

    public function update($json)
    {
        if(!$db = fopen(BASE_PATH."/app/db/database.json", "w"))
        {
            throw new Exception("db.error.reading");
        }
        fwrite($db, json_encode($json));
        fclose($db);
    }


}