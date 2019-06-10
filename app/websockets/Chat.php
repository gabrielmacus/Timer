
<?php
/**
 * Created by PhpStorm.
 * User: Gabriel
 * Date: 03/10/2017
 * Time: 12:08 PM
 */

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface
{
    protected $clients;
    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients[$conn->resourceId] =$conn;
        $conn->send(json_encode(["type"=>"conn_id","id"=>$conn->resourceId]));

        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {

        $jsonMsg=json_decode($msg,true);
        $c=[];
        switch ($jsonMsg["type"])
        {
            default:
                //Por defecto, envio los msgs a cada uno de los usuarios (menos al emisor)
                foreach ($this->clients as $k=>$client) {
                    if ($from->resourceId !== $k) {
                        $c[]=$k;
                        $jsonMsg["from"] = $from->resourceId;
                        $client->send(json_encode($jsonMsg));
                    }
                }
                break;
            case 'msg':
                //Le envio a un cliente en particular
                if(!empty($this->clients[$jsonMsg["to"]]))
                {
                    $c[] = $jsonMsg["to"];
                    $jsonMsg["from"] = $from->resourceId;
                    $client = $this->clients[$jsonMsg["to"]];
                    $client->send(json_encode($jsonMsg));
                }

                break;
            case 'sync-request':
                //En el caso de que quiera sincronizar, solo le envio el msg a un cliente
                foreach ($this->clients as $k=>$client) {
                    if ($from->resourceId !== $k) {
                        $c[]=$k;
                        $jsonMsg["from"] = $from->resourceId;
                        $client->send(json_encode($jsonMsg));
                        break;
                    }
                }

                break;
        }

        $c=implode(",",$c);
        echo "{$jsonMsg["type"]} to {$c}\n";

    }

    public function onClose(ConnectionInterface $conn)
    {
        unset($this->clients[$conn->resourceId]);

        echo "Connection {$conn->resourceId} has disconnected\n";

        $this->onMessage($conn,json_encode(["type"=>"","subtype"=>"user-disconnected","id"=>$conn->resourceId]));
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }
}