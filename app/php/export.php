<?php

//error_reporting(0);
header('Content-Type: text/html; charset=utf-8');

$json = json_decode(file_get_contents("php://input"), true);

$header = fopen("header.html", "r");
// Output one line until end-of-file
$headers = '';
while(!feof($header)) {
    $headers = $headers.fgets($header);
}
fclose($header);

$footer = fopen("footer.html", "r");
// Output one line until end-of-file
$footers = '';
while(!feof($footer)) {
    $footers = $footers.fgets($footer);
}
fclose($footer);

$files = array();
$mainfiles = array();

$cnt = 0;
foreach ($json['pages'] as $page){

    if ($cnt==0) {
        $filename = "index.html";
    } else {
        $filename = $page['title'].".html";
    }
    $cnt++;
    
    $myfile = fopen($filename, "w");

    $newContent = $headers;

    $cntt = 0;
    $newContent = $newContent . "<div class='navigation'><ul>";
    foreach ($json['pages'] as $page_) {

        if ($cntt==0) {
            $filename_ = "index.html";
        } else {
            $filename_ = $page_['title'].".html";
        }
        $cntt++;

        $newContent = $newContent . "<li><a href='" . $filename_ . "'><span>";
        $newContent = $newContent . $page_['title'];
        $newContent = $newContent . "</span></a><ul>";
        foreach ($page_['sections'] as $section) {

            $newContent = $newContent . "<li><a href='" . $filename_ . "#" . $section['title'] . "'><span>";
            $newContent = $newContent . $section['title'];
            $newContent = $newContent . "</span></a></li>";

        }
        $newContent = $newContent . "</ul></li>";
    }
    $newContent = $newContent . "</ul></div>";

    $newContent = $newContent . "<div class='content'>";
    foreach ($page['sections'] as $section) {

        $newContent = $newContent . "<div id='".$section['title']."'>";

        $newContent = $newContent . "<h2>";
        $newContent = $newContent . $section['title'];
        $newContent = $newContent . "</h2>";

        $newContent = $newContent . $section['model'];

        $newContent = $newContent . "</div>";


    }
    $newContent = $newContent . "</div>";

    $newContent = $newContent.$footers;

    fwrite($myfile, $newContent);
    fclose($myfile);
    array_push($files, $filename);

};

array_push($mainfiles, "style.css");
array_push($mainfiles, "main.js");

$zip = new ZipArchive();
$zip_name = $json['user']['permissionId'].".zip";;
if (file_exists ( $zip_name )) {
    unlink($zip_name);
}
if($zip->open($zip_name, ZIPARCHIVE::CREATE)!==TRUE){
    $error .= "* Sorry ZIP creation failed at this time";
}

foreach($files as $file){
    $zip->addFile($file);
}
foreach($mainfiles as $file){
    $zip->addFile($file);
}
$zip->close();

foreach($files as $file){
    if (file_exists ( $file )) {
        unlink($file);
    }
}

echo $zip_name;

?>