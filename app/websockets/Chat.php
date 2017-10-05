
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
                        // The sender is not the receiver, send to each client connected
                        $client->send($msg);
                    }
                }
                break;
            case 'sync-request':
                //En el caso de que quiera sincronizar, solo le envio el msg a un cliente

                foreach ($this->clients as $k=>$client) {
                    if ($from->resourceId !== $k) {
                        $c[]=$k;
                        // The sender is not the receiver, send to each client connected
                        $client->send($msg);
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
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }
}