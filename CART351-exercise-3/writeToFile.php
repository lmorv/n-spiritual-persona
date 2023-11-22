<?php

// $theFile = fopen("files/test.txt", "w") or die("could not open the file");
// $txt = "Today it is very sunny\n";
// fwrite($theFile,$txt);

$theFile = fopen("files/testCART351file_2021.txt", "a") or die("unable to open file");
$textA = "it is stormy outside\n";
fwrite($theFile, $textA);
$textB = "I am jumping over the puddles\n";
fwrite($theFile, $textB);
?>