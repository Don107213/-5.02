<?php

  $id=$_GET["id"];
  $conn = mysqli_connect("localhost","root","asdf1234","cAuth");

  //$sql = "select * from test where id='13'";
  $sql = "insert into tset values('$id',1)";
  $result = mysqli_query($conn,$sql);

/*
while ($row = mysqli_fetch_assoc($result)) {
    $output[]=array("id"=>$row["id"],"val"=>$row["val"]);
  } 

  print_r(json_encode($output));
*/
  
  
class Test extends CI_Controller {
    public function index() { } }