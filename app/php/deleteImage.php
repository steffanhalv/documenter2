<?php

session_start();

header('Content-Type: text/html; charset=utf-8');

$json = json_decode(file_get_contents("php://input"), true);

unlink($_SERVER['DOCUMENT_ROOT'] . $json['image']);

?>