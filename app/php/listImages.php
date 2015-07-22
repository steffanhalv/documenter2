<?php

session_start();

header('Content-Type: text/html; charset=utf-8');

//$images = array('img1','img2','img3','img4','img5');
$images = array();

foreach(scandir($_SESSION["upload_path"]) as $image) {
    if ($image!=='.'&&$image!=='..') {
        array_push($images, $_SESSION["img_path"].'/'.$image);
    }
}

echo json_encode($images);