<?php
//check if there has been something posted to the server to be processed

if($_SERVER['REQUEST_METHOD'] == 'GET') {
echo "hello";
readFromFile();
}

if($_SERVER['REQUEST_METHOD'] == 'POST')
{
// need to process
 $artist = $_POST['a_name'];
 $title = $_POST['a_title'];
 $loc = $_POST['a_geo_loc'];
 $description = $_POST['a_descript'];
 $creationDate = $_POST['a_date'];

 //package the data and echo back...
    /* make  a new generic php object */
    $myPackagedData=new stdClass();
    // $myPackagedData->response = "success";
    $myPackagedData->artist = $artist ;
    $myPackagedData->title = $title ;
    $myPackagedData->location = $loc ;
    $myPackagedData->description = $description ;
    $myPackagedData->creation_Date = $creationDate ;
    $myPackagedData->fileName = $fname ;
     /* Now we want to JSON encode these values as a JSON string ..
     to send them to $.ajax success  call back function... */
    $myJSONObj = json_encode($myPackagedData);
    // echo $myJSONObj;

// save the packaged data to a file
$file = fopen("files/user_input.txt", "a") or die("unable to open file");
fwrite($file, $myJSONObj . "\n");
fclose($file);

readFromFile();

 exit;
}//POST

function readFromFile() {

  $path = "files/user_input.txt";
  $theFile = fopen($path, "r") or die("Unable to open file!");
  //read until eof
  //$i=0;
  $outArr = array();
  // $NUM_PROPS = 3; // number of fields (dependent on the format of the file. In this case 'animal','color', 'number')
   //echo("test");
     while(!feof($theFile)) {
       //create an object to send back

      //  $packObj=new stdClass();

      //  for($j=0;$j<$NUM_PROPS;$j++){
      //    $str = fgets($theFile);
      //    //split and return an array ...
      //    $splitArr = explode(":",$str);
      //    $key = $splitArr[0];
      //    $val = $splitArr[1];
      //    //append the key value pair
      //    $packObj->$key = trim($val);
      //  }
      //  $outArr[]=$packObj;

      $str = fgets($theFile);
      $outArr[] = $str;
     }

     fclose($theFile);
       // var_dump($outArr);
       // Now we want to JSON encode these values to send back.
      $myJSONObj = json_encode($outArr);
     echo $myJSONObj;
}

?>

<html>
<head>
<title>Sample Insert into Gallery Form USING FETCH </title>
<!--set some style properties::: -->
<link rel="stylesheet" type="text/css" href="css/galleryStyle.css">
</head>
<body>
 
<div class= "formContainer">

<!--form done using more current tags... -->
<form id="insertGallery" action="" enctype ="multipart/form-data">
<!-- group the related elements in a form -->
<h3> SUBMIT AN ART WORK :::</h3>
<fieldset>
<p><label>Artist:</label><input type="text" size="24" maxlength = "40" name = "a_name" required></p>
<p><label>Title:</label><input type = "text" size="24" maxlength = "40"  name = "a_title" required></p>
<p><label>Geographic Location:</label><input type = "text" size="24" maxlength = "40" name = "a_geo_loc" required></p>
<p><label>Creation Date (DD-MM-YYYY):</label><input type="date" name="a_date" required></p>
<p><label>Description:</label><textarea type = "text" rows="4" cols="50" name = "a_descript" required></textarea></p>
<!-- <p><label>Upload Image:</label> <input type ="file" name = 'filename' size=10 required/></p> -->
<p class = "sub"><input type = "submit" name = "submit" value = "submit my info" id ="buttonS" /></p>
 </fieldset>
</form>

<div id = "result"></div> 

</div>

<script>
    window.onload = function (){
      
        console.log("ready");

let form = document.querySelector("#insertGallery");
             let data = new FormData(form);

            fetch('/InsertGalleryFetch_Mod1.php', {
    method: 'POST',
    body: data
    })
    .then(function (response) {
            console.log("got here with response ...");
            return response.json();
     })
    .then(result => {
      console.log(result);
 
            displayResponse(result);
       
     })
    .catch(error => {
    console.error('Error:', error);
    });



  document.querySelector("#insertGallery").addEventListener("submit", function(){
            event.preventDefault(); // stops the submit button from submitting by default
            console.log("button clicked");
            console.log("form has been submitted");

            //part two
        let form = document.querySelector("#insertGallery");
             let data = new FormData(form);

            fetch('/InsertGalleryFetch_Mod1.php', {
    method: 'POST',
    body: data
    })
    .then(function (response) {
            console.log("got here with response ...");
            return response.json();
     })
    .then(result => {
      console.log(result);
 
       
     })
    .catch(error => {
    console.error('Error:', error);
    });
        });



    function displayResponse(theResult){
      let container = document.createElement("div");
      container.classList.add("outer");
      document.querySelector("#result").appendChild(container);
 
      let title = document.createElement("h3");
      title.textContent= "Results from user";
      container.appendChild(title);
 
      let contentContainer = document.createElement("div");
      contentContainer.classList.add("content");
      container.appendChild(contentContainer);
 
      for (let property in theResult) {
        console.log(property);
        if(property ==="fileName"){
          let img = document.createElement("img");
          img.setAttribute('src','images/'+theResult[property]);
          contentContainer.appendChild(img);
        }
        else if(property!=="response"){
          let para = document.createElement('p');
         para.textContent = property+"::" +theResult[property];
            contentContainer.appendChild(para);
        }

      }
 
      }

    }// window onLoad
</script>
</body>
</html>