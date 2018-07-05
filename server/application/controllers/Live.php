<?php
  
  $mode=$_GET["mode"];
  if($mode=="addUser"){
    addUser();  
    }  
  //新增接口 删除直播间 检查用户是否有直播间
  else if($mode=="getUserId"){
    getUserId();
  }
   else if($mode=="checkLivingStatus"){
    checkLivingStatus();
  }
  else if($mode=="deleteLiveRoom"){
    deleteLiveRoom();
  }
  else if($mode=="createLiveRoom"){
    createLiveRoom();
  }
  else if($mode=="addLiveList"){
    addLiveList();
  }
  else if($mode=="addComment"){
    addComment();  
    }
  else if($mode=="getAllComments"){
    $liveRoomId=$_GET["liveRoomId"];
    getAllComments($liveRoomId);
  }
  else if($mode=="getLiveList"){
    $liveRoomId=$_GET["liveRoomId"];
    getLiveList($liveRoomId);
  }
  else if($mode=="getAllLiveRoom"){
    getAllLiveRoom();
  }
  else if($mode=="getLiveRoomInfo"){
    getLiveRoomInfo();
  }
  else if($mode=="getLiveUserInfo"){
    getLiveUserInfo();
  }
  else if($mode=="tradeFlowers"){
    tradeFlowers();
  }
  else if($mode=="updateFlowerNum"){
    updateFlowerNum();
  }
  //根据openid查找用户是否存在
  function getUserId(){
  $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
  $openId=$_GET["openId"];
  $sql="select userId from liveUser where openId='$openId'";
  $result = mysqli_query($conn,$sql);
  if(!($row = mysqli_fetch_assoc($result)))//如果不存在
  {
    $userId=0;
  }
  else
  {
    $userId=$row["userId"];
  }
  echo $userId;
  }


  //检查用户是否有直播间
  function checkLivingStatus(){
  $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
  $liveRoomId=$_GET["liveRoomId"];
  $sql="select * from LiveRoom where liveRoomId='$liveRoomId'";
  $result = mysqli_query($conn,$sql);
  if(!($row = mysqli_fetch_assoc($result)))//如果不存在
  {
    $upStatus=0;
  }
  else
  {
    $upStatus=1;
  }
  echo $upStatus;
}

  //删除直播间
  function deleteLiveRoom(){
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $liveRoomId=$_GET["liveRoomId"];
    $sql="delete from LiveRoom where liveRoomId='$liveRoomId'";
    $result = mysqli_query($conn,$sql);
    $sql1="delete from Comments where liveRoomId='$liveRoomId'";
    $result = mysqli_query($conn,$sql1);
    $sql="delete from LiveList where liveRoomId='$liveRoomId'";
    $result = mysqli_query($conn,$sql);
    $sql="delete from UpStatus where liveRoomId='$liveRoomId'";
    $result = mysqli_query($conn,$sql);
    $sql="delete from WarnStatus where liveRoomId='$liveRoomId'";
    $result = mysqli_query($conn,$sql);
  }

  
  function createLiveRoom(){
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $avatar=$_GET["avatar"];
    $nickName=$_GET["nickName"];
    $liveRoomId=$_GET["liveRoomId"];
    $liveRoomIntro=$_GET["liveRoomIntro"];
    $liveType=$_GET["liveType"];
    $imgUrl=$_GET["imgUrl"];
    $sql="insert into LiveRoom values('$avatar','$nickName','$liveRoomId','$liveType','$liveRoomIntro',0,0,0,'$imgUrl',0)";
    $result = mysqli_query($conn,$sql);
  }

  function updateFlowerNum(){
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $userId=$_GET["userId"];
    $sql="select * from liveUser where userId='$userId'";
    $result = mysqli_query($conn,$sql);
    while ($row = mysqli_fetch_assoc($result)) {
         $output[]=array("flowerNum"=>$row["flowerNum"],"balance"=>$row["balance"]);
    }
    print_r(json_encode($output));
  }

  function tradeFlowers(){
    echo "trade Flowers";
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $userId=$_GET["userId"];
    $tradeFlowersNum=$_GET["tradeFlowersNum"];
    $sql="update liveUser set flowerNum=flowerNum+'$tradeFlowersNum',balance=balance-'$tradeFlowersNum' where userId='$userId'";
    $result = mysqli_query($conn,$sql);
    echo $result;
  }

  function getLiveUserInfo(){
    $userId=$_GET["userId"];
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $sql="select * from liveUser where userId='$userId'";
    $result = mysqli_query($conn,$sql);
    while ($row = mysqli_fetch_assoc($result)) {
       $output[]=array("balance"=>$row["balance"],"flowerNum"=>$row["flowerNum"]);
    } 
    print_r(json_encode($output));
  }

  function getLiveRoomInfo()
  {
    $liveRoomId=$_GET["liveRoomId"];
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $sql="select * from LiveRoom where liveRoomId='$liveRoomId'";
    $result = mysqli_query($conn,$sql);
    while ($row = mysqli_fetch_assoc($result)) {
       $output[]=array("avatar"=>$row["avatar"],"nickName"=>$row["nickName"],"upNum"=>$row["upNum"],"flowerNum"=>$row["flowerNum"],"viewNum"=>$row["viewNum"],"warnNum"=>$row["warnNum"]);
    } 
    print_r(json_encode($output));
  }

  function getAllLiveRoom()
  {
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $sql="select * from LiveRoom order by viewNum DESC";
    $result=mysqli_query($conn,$sql);
    while ($row = mysqli_fetch_assoc($result)) {
       $output[]=array("avatar"=>$row["avatar"],"nickName"=>$row["nickName"],"liveRoomId"=>$row["liveRoomId"],"liveType"=>$row["liveType"],"liveRoomIntro"=>$row["liveRoomIntro"],"viewNum"=>$row["viewNum"],"imgUrl"=>$row["imgUrl"]);
    } 
    print_r(json_encode($output));
  }
  

  //获取直播数据
  function getLiveList($liveRoomId)
  {
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $sql1="select * from LiveList where liveRoomId='$liveRoomId'";
    $result1 = mysqli_query($conn,$sql1);
    while ($row = mysqli_fetch_assoc($result1)) {
       $output[]=array("imgUrl"=>$row["imgUrl"],"create_time"=>$row["create_time"],"txt"=>$row["txt"]);
    } 
    print_r(json_encode($output));
  }
  //获取所有评论
  function getAllComments($liveRoomId)
  {
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $sql1="select * from Comments where liveRoomId='$liveRoomId'";
    $result1 = mysqli_query($conn,$sql1);
    while ($row = mysqli_fetch_assoc($result1)) {
       $output[]=array("nickName"=>$row["nickName"],"imgUrl"=>$row["imgUrl"],"create_time"=>$row["create_time"],"txt"=>$row["txt"]);
    } 
    print_r(json_encode($output));
  }

  //添加直播数据
  function addLiveList()
  {
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $liveRoomId=$_GET["liveRoomId"];
    $create_time=$_GET["create_time"];
    $txt=$_GET["txt"];
    $imgUrl=$_GET["imgUrl"];
    $audioUrl=$_GET["audioUrl"];
    $audioLength=$_GET["audioLength"];
    $sql="insert into LiveList values(null,'$liveRoomId','$create_time','$txt','$imgUrl','$audioUrl','$audioLength')";
    $result = mysqli_query($conn,$sql);
    if($result)
    {
      getLiveList($liveRoomId);
    }
  }

  //添加评论
  function addComment()
  {    
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $liveRoomId=$_GET["liveRoomId"];
    $create_time=$_GET["create_time"];
    $txt=$_GET["txt"];
    $nickName=$_GET["nickName"];
    $imgUrl=$_GET["imgUrl"];
    $sql="insert into Comments values(null,'$liveRoomId','$create_time','$txt','$nickName','$imgUrl')";
    $result = mysqli_query($conn,$sql);
    if($result)
    {
      getAllComments($liveRoomId);
    }
  }

  //添加用户
  function addUser(){
    $conn = mysqli_connect("localhost","root","asdf1234","cAuth");
    $openId=$_GET["openId"];    
    $sql="select * from liveUser where openId='$openId'";
    $result = mysqli_query($conn,$sql);
    if(!($row = mysqli_fetch_assoc($result)))//如果不存在
    {
      $sql1 = "insert into liveUser values(null,'$openId',0,100)";
      $result1 = mysqli_query($conn,$sql1);
    }
    $sql2="select * from liveUser where openId='$openId'";
    $result2=mysqli_query($conn,$sql2);
    if($row1 = mysqli_fetch_assoc($result2))
    {
      $userId=$row1["userId"];
      echo $userId;
    }    
  }  
class Live extends CI_Controller {
    public function index() { } 
    }
