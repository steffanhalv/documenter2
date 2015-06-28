<?php

error_reporting(0);

$json_output = json_decode(file_get_contents("php://input"), true);


foreach ($json_output as $json){

    foreach ($json['sections'] as $section){

        echo $section['model'];

    }

}

?>