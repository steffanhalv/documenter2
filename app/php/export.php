<?php

error_reporting(0);

$json_output = json_decode(file_get_contents("php://input"), true);

$newContent = '';

$header = fopen("header.html", "r");
// Output one line until end-of-file
while(!feof($header)) {
    $newContent = $newContent.fgets($header);
}
fclose($header);

foreach ($json_output as $json){

    foreach ($json['sections'] as $section){

        $newContent = $newContent.$section['model'];

    }

}

$footer = fopen("footer.html", "r");
// Output one line until end-of-file
while(!feof($footer)) {
    $newContent = $newContent.fgets($footer);
}
fclose($footer);

$myfile = fopen("newfile.html", "w");
fwrite($myfile, $newContent);
fclose($myfile);

$files = array(
    'newfile.html'
);


$zip = new ZipArchive();
$zip_name = "zipfile.zip";
if($zip->open($zip_name, ZIPARCHIVE::CREATE)!==TRUE){
    $error .= "* Sorry ZIP creation failed at this time";
}

foreach($files as $file){
    $zip->addFile($file);
}

$zip->close();

echo "zipfile.zip";

?>