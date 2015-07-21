<?php

session_start();

header('Content-Type: text/html; charset=utf-8');

$json = json_decode(file_get_contents("php://input"), true);

$_SESSION["folder"] = $json['user']['rootFolderId'];
$_SESSION["project"] = $json['fileId'];
$_SESSION["img_path"] = '/images/'.$_SESSION["folder"].'/'.$_SESSION["project"];
$_SESSION["upload_path"] = $_SERVER['DOCUMENT_ROOT'] . $_SESSION["img_path"];

echo $_SESSION["folder"];
echo '|';
echo $_SESSION["project"];

?>