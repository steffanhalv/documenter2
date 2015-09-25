<?php

error_reporting(0);

session_start();

header('Content-Type: text/html; charset=utf-8');

$json = json_decode(file_get_contents("php://input"), true);

$files = array();

//GET HEADER
$header = '';
$header_file = fopen("header.html", "r");
while(!feof($header_file)) {
    $header = $header.fgets($header_file);
}
fclose($header_file);

//GET FOOTER
$footer = '';
$footer_file = fopen("footer.html", "r");
while(!feof($footer_file)) {
    $footer = $footer.fgets($footer_file);
}
fclose($footer_file);

//LOOP THROUGH ALL PAGES
$cnt = 0;
foreach ($json['pages'] as $page){

    //NAME FIRST FILE AS index.html and others with real name
    if ($cnt==0) {
        $filename = "index.html";
    } else {
        $filename = $page['title'].".html";
    }
    $cnt++;
    
    $myfile = fopen($filename, "w");

    //ADD HEADER
    $c = $header; //$c = content

    //ADD CONTENT
    $cntt = 0;
    $c = $c . "<div class='main-title'>".$json['model']['headerTitle']."<div></header>";
    $c = $c . "<div class='nav-mobile'><ul>";
    foreach ($json['pages'] as $page_) {

        if ($cntt==0) {
            $filename_ = "index.html";
        } else {
            $filename_ = $page_['title'].".html";
        }
        $cntt++;

        $active = "";
        if ($page == $page_) {
            $active = "active";
        }

        $c = $c . "<li class='".$active."'><a href='" . $filename_ . "' title='".$page_['title']."'><span>";
        $c = $c . $page_['title'];
        $c = $c . "</span></a><ul>";
        foreach ($page_['sections'] as $section) {

            $c = $c . "<li><a href='" . $filename_ . "#" . $section['id'] . "' title='".$section['title']."'><span>";
            $c = $c . $section['title'];
            $c = $c . "</span></a></li>";

        }
        $c = $c . "</ul></li>";
    }
    $c = $c . "</ul></div>";

    $cntt = 0;
    $c = $c . "<div class='wrapper'>";
    $c = $c . "<div class='nav-large'><ul>";
    foreach ($json['pages'] as $page_) {

        if ($cntt==0) {
            $filename_ = "index.html";
        } else {
            $filename_ = $page_['title'].".html";
        }
        $cntt++;

        $active = "";
        if ($page == $page_) {
            $active = "active";
        }

        $c = $c . "<li class='".$active."'><a href='" . $filename_ . "' title='".$page_['title']."'><span>";
        $c = $c . $page_['title'];
        $c = $c . "</span></a><ul>";
        foreach ($page_['sections'] as $section) {

            $c = $c . "<li><a href='" . $filename_ . "#" . $section['id'] . "' title='".$section['title']."'><span>";
            $c = $c . $section['title'];
            $c = $c . "</span></a></li>";

        }
        $c = $c . "</ul></li>";
    }
    $c = $c . "</ul></div>";

    $c = $c . "<div class='container'><h1>".$page_['title']."</h1>";

    foreach ($page['sections'] as $section) {

        $c = $c . "<div class='section' id='".$section['id']."'>";

        $c = $c . "<h1>";
        $c = $c . $section['title'];
        $c = $c . "</h1><div class='content'>";

        $c = $c . str_replace($_SESSION["img_path"], 'images', $section['model']);

        $c = $c . "</div></div>";


    }
    $c = $c . "</div></div>";

    //REPLACE LOGO
    $c = $c . "<script>$(document).ready(function() {";
    $logoName = basename($json['model']['logoPath']);
    $c = $c . "$('.logo').css('backgroundImage','url(images/".$logoName.")');";
    $c = $c . "});</script>";

    //ADD FOOTER
    $c = $c.$footer;

    fwrite($myfile, $c);
    fclose($myfile);
    array_push($files, $filename);

};

//CREATE ZIP FILE
$zip = new ZipArchive();
mkdir('zip/'.$json['user']['permissionId']);
$zip_name = 'zip/'.$json['user']['permissionId']."/website.zip";
if (file_exists ( $zip_name )) {
    unlink($zip_name);
}
if($zip->open($zip_name, ZIPARCHIVE::CREATE)!==TRUE){
    $error .= "* Sorry ZIP creation failed at this time";
}

foreach($files as $file){
    $zip->addFile($file);
}

$zip->addFile('style.css');
$zip->addFile('js/main.js');
$zip->addFile('js/jquery-1.11.3.min.js');

$zip->addFile('images/logo.png');
$zip->addFile('images/toggle.png');

foreach(scandir($_SESSION["upload_path"]) as $image) {
    if ($image!=='.'&&$image!=='..') {
        $zip->addFile($_SESSION["upload_path"].'/'.$image, 'images/'.$image);
    }
}

$zip->close();

foreach($files as $file){
    if (file_exists ( $file )) {
        unlink($file);
    }
}

//RETURN NAME OF ZIP FILE
echo $zip_name;

?>