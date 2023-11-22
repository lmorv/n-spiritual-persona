<html>
    <head>
    <title>READ FROM FILE</title>
    </head>

    <body>
        <h1>READ FROM FILE</h1>

        <?php
        $theFile = fopen('files/testCART351file_2021.txt','r') or die("unable to open file");
        // echo(fread($theFile,filesize("files/testCART351file_2021.txt")));

        while(!feof($theFile)){
            echo(fgets($theFile)."<br>");

        }
        fclose($theFile);
        ?>
    </body>


</html>