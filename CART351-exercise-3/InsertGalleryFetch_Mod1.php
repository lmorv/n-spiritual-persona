<?php
//check if there has been something posted to the server to be processed

if($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET["start"])) {
//echo "hello";
readFromFile();
exit;
}

if($_SERVER['REQUEST_METHOD'] == 'POST')
{
// need to process
 $artist = $_POST['a_name'];
 $terms = $_POST['terms'];
 $mist = $_POST['mist'];
 $color = $_POST['color'];
 $rainbow = $_POST['rainbow'];
 $ghost = $_POST['ghost'];
 $clouds = $_POST['clouds'];
 $boom = $_POST['boom'];
 $plant = $_POST['plant'];


 //package the data and echo back...
    /* make  a new generic php object */
    $myPackagedData=new stdClass();
    // $myPackagedData->response = "success";
    $myPackagedData->artist = $artist ;
    $myPackagedData->aterms = $terms ;
    $myPackagedData->amist = $mist ;
    $myPackagedData->acolor = $color ;
    $myPackagedData->arainbow = $rainbow ;
    $myPackagedData->aghost = $ghost ;
    $myPackagedData->aclouds = $clouds ;
    $myPackagedData->aboom = $boom ;
    $myPackagedData->aplant = $plant ;
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


      $str = fgets($theFile);
      $outArr[] = json_decode($str);
     }

     fclose($theFile);
       // var_dump($outArr);
       // Now we want to JSON encode these values to send back.
      $myJSONObj = json_encode($outArr);
     echo $myJSONObj;
     //echo $outArr;
     exit;
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
<h3> Take the test!</h3>

<fieldset>
  <p>This is a quick personality test to know what type of virtual persona you are today!</p>
<p><label>Username:</label><input type="text" size="24" maxlength = "40" name = "a_name" required></p>
<fieldset>
    <legend>Do you agree to the terms?</legend>
    <label><input type="radio" name="terms" value="yes" /> Yes</label>
    <label><input type="radio" name="terms" value="no" /> No</label>
  </fieldset>
  <fieldset>
    <legend>What feeling does mist at night evoke?</legend>
    <label><input type="radio" name="mist" value="scarry" /> Scarry</label>
    <label><input type="radio" name="mist" value="calming" /> Calming</label>
    <label><input type="radio" name="mist" value="makes me mad" /> Makes me mad</label>
  </fieldset>
  <fieldset>
    <legend>What color would best describe your day so far?</legend>
    <input type="color" name="color" id="favcolor" value="#ff0020">
</fieldset>
  <fieldset>
    <legend>What do you belive is at the end of a rainbow?</legend>
    <label><input type="radio" name="rainbow" value="end" /> The end of the rainbow</label>
  </fieldset>
  <fieldset>
    <legend>How old is your best ghost friend?</legend>
    <input type="range" min="1" max="100" value="50" class="slider" name="ghost">
</fieldset>
<fieldset>
    <legend>What do the creatures in the cloud look like?</legend>
    <label><input type="radio" name="clouds" value="spiky" /> Spiky</label>
    <label><input type="radio" name="clouds" value="bubbly" /> Bubbly</label>
    <label><input type="radio" name="clouds" value="pink" /> Pink</label>
  </fieldset>
<fieldset>
    <legend>Do you look back at explosions?</legend>
    <input type="range" min="1" max="100" value="50" class="slider" name="boom">
</fieldset>
<fieldset>
<legend>What type of plant are you today?</legend><input type = "text" size="24" maxlength = "40"  name = "plant" required>
</fieldset>




  
<p class = "sub"><input type = "submit" name = "submit" value = "submit my info" id ="buttonS" /></p>
 </fieldset>
</form>


<div id = "result"></div> 


</div>



<script>
    window.onload = function (){
        console.log("ready");

        fetch("InsertGalleryFetch_Mod1.php?start=true")
           .then(function (response) {
            return response.json();
          })
          .then(function (jsonData) {
          console.log(jsonData);
          displayResponse(jsonData);
        });

        document.querySelector("#insertGallery").addEventListener("submit", function(){
            event.preventDefault(); // stops the submit button from submitting by default
            console.log("button clicked");
            console.log("form has been submitted");

            //part two
            let form = document.querySelector("#insertGallery");
             let data = new FormData(form);
                /*console.log to inspect the data */
            for (let pair of data.entries()) {
             console.log(pair[0]+ ', ' + pair[1]);
            }

            fetch('InsertGalleryFetch_Mod1.php', {
              
    method: 'POST',
    body: data
    })
    .then(function (response) {
            console.log("got here with response ...");
            return response.json();
     })
    .then(result => {
      console.log(result);
 
        // console.log(result.response);
        // if(result.response!=="success"){
        //     throw new Error('Something went wrong '+ result);
 
        // }
        // else{
        //     console.log('Here:', result);
            displayResponse(result);
        //     form.reset();
 
        // }
     })
    .catch(error => {
    console.error('Error:', error);
    });


        });

    function displayResponse(theResult){
      document.querySelector("#result").innerHTML="";

    for(let i=0; i<theResult.length; i++){

      let container = document.createElement("div");
          container.classList.add("outer");
          document.querySelector("#result").appendChild(container);
    
          let title = document.createElement("h3");
          title.textContent= "Results from users";
          container.appendChild(title);
    
          let contentContainer = document.createElement("div");
          contentContainer.classList.add("content");
          container.appendChild(contentContainer);

      let entryObject = document.createElement("div");
        contentContainer.appendChild(entryObject);

      for (let property in theResult[i]) {
        console.log(theResult[i][property]);
        let content = document.createElement("p");
        content.innerHTML = theResult[i][property];
        entryObject.appendChild(content);

      }
    }

 }

    }// window onLoad
</script>
</body>
</html>