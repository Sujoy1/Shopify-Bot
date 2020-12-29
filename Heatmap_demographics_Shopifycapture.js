//For present purposes we are storing heatmap activities in an array called userActivity which contains 12 elements from 0 to 11
/* 
0  -> mouse X
1  -> mouse y
2 -> mouse hovering
3-> current URL
4-> element associated with single click
5-> number of single clicks
6-> date associated with single click
7-> element associated with double click
8-> number of double clicks
9-> date associated with double click
10-> Engagement time
11-> Scrolling Activity
*/

// Important Note : User OS , browser ,device type ,medium ,channel ,brand are being captured from index_v2

// User Activity is being tracked in real time but with some thershold limits :

var t = 5;
var pos = 1;
var mouse_limit = 25 ;
var double_click_start =1;
var double_click_limit = 5;
var hovering_limit = 30;
var hovering_start = 1;
var scroll_limit = 25 ;
var scroll_start = 1;
var click_limit = 20;
var click_start = 1;
var time_counter=1;
var click_count =1;
var double_click_count =1;

// The user Activtity array captures all the heatmap  details

let userActivity = [];

// The HeatMap object contains the final processed data to be sent to backend

var heatmap = {
  mouseEvents : [],
  clickEvents : [],
  single_clicks_counter : 0,
  last_single_click_time : "",
  last_double_click_time : "",
  last_hovering_time : "",
  double_clicks_counter : 0,
  sessions_count : 0,
  scrolled : false,
  mouse_x : 0,
  mouse_y : 0,
  url : "",
  type: "Ignore_this",
  unique_id : "",
  first_login : "",
  search_keyword : ""
}

var item ="";
// Generate random string for username
function GenUsername(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

// Set   a cookie

function setCookie(cname,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    var e = new Date();
    cvalue= e;
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    heatmap.unique_id = cname;
    heatmap.first_login = cvalue;
    sessionStorage.setItem("HeatmapTrackingJs", JSON.stringify(heatmap));
    console.log(JSON.parse(sessionStorage.getItem("HeatmapTrackingJs")), "HeatmapTrackingJs")
  }

// Get a cookie

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      console.log(c);
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    
  }
var userID;

// Check a cookie

function checkCookie() {
    let username = getCookie("username");
    if (username != "") {
     alert("Welcome again ");
    } else
     {
      username = GenUsername(7);
      userID = username;
      if (username != "" && username != null) {
        setCookie("username", username, 1);
      }
    }
  }
  
function include(file) { 
  
    var script  = document.createElement('script'); 
    script.src  = file; 
    script.type = 'text/javascript'; 
    script.defer = true; 
    
  //  document.getElementsByTagName('head').item(0).appendChild(script); 
    
  } 
    
  /* Include  js files by greenstick ; Module name :Interactor ; Module URL :https://github.com/greenstick/interactor  */
 include('../interactor-master/intreractor.js'); 
  include('../interactor-master/interactor.min.js');

  // The function below will identify the type of data, segregate the data , finally process the data
  
  function handleProcessing(data, key, type){
    let processedData = [...heatmap.mouseEvents];
  if(type === "processing" && key === "hovering"){
      let value =  data.innerHTML;
      if(heatmap.mouseEvents.indexOf(value) === -1 && value !== null){
        console.log(value, "hshs");
        processedData.push(value)
        heatmap.mouseEvents = processedData;
      sessionStorage.setItem("userTrackingJs", JSON.stringify(heatmap))
      console.log("Heat Map data : ", heatmap)
      }
  }else if(type === "needtoprocessed"){
      if(heatmap.mouseEvents.indexOf(data.getAttribute("src")) === -1 && data.getAttribute("src") !== null){
        console.log(data.getAttribute("src"), "addaddaad2222");
        processedData.push(data.getAttribute("src"))
        heatmap.mouseEvents = processedData;
      sessionStorage.setItem("userTrackingJs", JSON.stringify(heatmap))
      console.log("Heatmap data :", heatmap)
  
      }
  }
  }
  

  // Getting real time cursor position and also on which element hovering is happening
  onmousemove = function(e)
    {   
      if(!item)
      {
      item = e.target;
      }
        hovering_start =hovering_start + 1;
        pos = pos+1;
        userActivity[0]=e.clientX;
        userActivity[1]=e.clientY;
        userActivity[2]= e.target.localName;
         if(pos%mouse_limit==0)
         {
     //  console.log("mouse location :", userActivity[0] , userActivity [1]);
     heatmap.mouse_x =userActivity[0];
     heatmap.mouse_y = userActivity[1];
     sessionStorage.setItem("HeatmapTrackingJs", JSON.stringify(heatmap));
     console.log(JSON.parse(sessionStorage.getItem("HeatmapTrackingJs")), "HeatmapTrackingJs")
     pos=1;
         }
         if(hovering_start > hovering_limit)
         {
           var hv_time = new Date();
           heatmap.last_hovering_time = hv_time ;
     // console.log("Mouse Hovering over:",userActivity[2]);
     if(item.innerHTML === e.target.innerHTML){
      handleProcessing(e.target, "hovering", "processing");
      item = ""
      hovering_start =1;
        }
  else 
  {
      handleProcessing(e.target, "basicData", "needtoprocessed")
      hovering_start=1;
      item = ""
       }
        pos =1;
         }

    }

    // Get current URL : Helps you to understand user's navigation across webpages every t seconds

    setTimeout(() => {
    userActivity[3]=document.URL;
    heatmap.url = userActivity[3]; 
   // console.log("Current URL :" ,userActivity[3]);
    },t);

  //  function mouse_poition
  
  function mouse_position()
  {
      var e = window.event;
  
      var posX = e.clientX;
      var posY = e.clientY;
  
     // userActivity[0] = posX;
     // userActivity[1] = posY;
  
      var t = setTimeout(mouse_position,100);
  
  }

  // Get Engagement Time using getTimeSpentonPage()

  function diff_minutes(dt2, dt1) 
 {
 console.log(dt1);
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
  
 }

 // Writing the function for the engagement time
 /*function get_time(){
 setInterval(() => {
   time_counter = time_counter +1;
   heatmap.sessions_count = time_counter/10;
  sessionStorage.setItem("HeatmapTrackingJs", JSON.stringify(heatmap));
   console.log(JSON.parse(sessionStorage.getItem("HeatmapTrackingJs")), "HeatmapTrackingJs")
 },1000)
}*/
setInterval(function()
{
  time_counter = time_counter +1;
   heatmap.sessions_count = time_counter/120;
  sessionStorage.setItem("HeatmapTrackingJs", JSON.stringify(heatmap));
   console.log(JSON.parse(sessionStorage.getItem("HeatmapTrackingJs")), "HeatmapTrackingJs")
  }, 3000);

 
 var k= new Date();
  function getTimeSpentonPage()
  {
     
     var date2 = k;
     var date1 = getCookie(userID);
     var difference = date2 - date1;
     var x = Date.parse(date2);
     var y = Date.parse(date1);
     var z = x -y;
     var minutespent = Math.floor(difference / (1000));
    // var timeDiff = Math.abs(date2.getTime() - date1.getTime());
     //var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    // userActivity [10] = minutespent;
    // heatmap.Engagement_time =userActivity[10];
    // console.log("Date login :",date1)
     //  console.log("Time spent in seconds :", z);
   //  window.setTimeout(getTimeSpentonPage(), 1000);
          return minutespent;
  }

  // Capturing all User activity with Mouse Clicks and Mouse Hovering

  // Activity capture for single clicks

  let clicks_count =0;
    window.onclick = function (e) {
      var single_targetClicked = e.target.innerHTML;
        click_start = click_start + 1;
        var d = new Date();
        var target_name_1 = e.target.localName;
        userActivity[4]=target_name_1;
        clicks_count = clicks_count+1;
        userActivity[5]=clicks_count;
        userActivity[6]=d;
        if(heatmap.clickEvents.indexOf(single_targetClicked.replace(/[^a-zA-Z ]/g, "").replace("&nbsp", " ").trim(" ")) === -1 )
     {
      console.log(single_targetClicked.replace(/[^a-zA-Z ]/g, "").trim(" "),'a tag single clicked!');
      let newlyclickEvents = [...heatmap.clickEvents, single_targetClicked.replace(/[^a-zA-Z ]/g, "").trim(" ")];
      heatmap.clickEvents = newlyclickEvents;
     }
        if(click_start > click_limit)
        {
      //   console.log("User clicked on : "+target_name_1 + " on time" , d);
      //  console.log("Number of single clicks till now:",clicks_count);
      var sc_time = new Date();
      heatmap.last_single_click_time =sc_time;
            heatmap.single_clicks_counter = click_count;
      sessionStorage.setItem("HeatmapTrackingJs", JSON.stringify(heatmap));
     console.log(JSON.parse(sessionStorage.getItem("HeatmapTrackingJs")), "HeatmapTrackingJs")
      click_start=1;
        }
        }

        // Activity capture for Mouse double Clicks

        let double_clicks_count =0;
    window.ondblclick = function (e) {
      var double_targetClicked = e.target.innerHTML;
      double_click_start = double_click_start + 1;
        var f = new Date();
        var target_name_2 = e.target.localName;
        double_clicks_count = double_clicks_count+1;
        userActivity[7]=target_name_2;
        userActivity[8]=double_clicks_count;
        userActivity[9]=f;
        if(heatmap.clickEvents.indexOf(double_targetClicked.replace(/[^a-zA-Z ]/g, "").replace("&nbsp", " ").trim(" ")) === -1 )
     {
      console.log(double_targetClicked.replace(/[^a-zA-Z ]/g, "").trim(" "),'a tag double  clicked!');
      let newlyclickEvents = [...heatmap.clickEvents, double_targetClicked.replace(/[^a-zA-Z ]/g, "").trim(" ")];
      heatmap.clickEvents = newlyclickEvents;
     }
        if(double_click_start > double_click_limit)
        {
       //    console.log("User double clicked on : "+target_name_2 + " on time" , f);
       //   console.log("Number of double clicks till now:",double_clicks_count);
       var dsc_time = new Date();
       heatmap.last_double_click_time =dsc_time;
       heatmap.double_clicks_counter = double_click_count;
       sessionStorage.setItem("HeatmapTrackingJs", JSON.stringify(heatmap));
     console.log(JSON.parse(sessionStorage.getItem("HeatmapTrackingJs")), "HeatmapTrackingJs")
             double_click_start=1;
        }
      }
    
  // Activity capture for scrolling of mouse

  window.addEventListener('wheel', function(event)
{
    userActivity[11]=false;
    scroll_start = scroll_start +1;
    if(scroll_start > scroll_limit)
    {
 if (event.deltaY < 0)
 {
 // console.log('scrolling up');
  userActivity[11] =true;
  //document.getElementById('status').textContent= 'scrolling up';
  scroll_start=1;
 }
 else if (event.deltaY > 0)
 {
 //  console.log('scrolling down');
  userActivity[11]= true;
 // document.getElementById('status').textContent= 'scrolling down';
 scroll_start=1;
 }
 else
 {
   //  console.log("No scrolling now");
   userActivity[11]=false;
   }
 heatmap.scrolled = userActivity[11];

      sessionStorage.setItem("HeatmapTrackingJs", JSON.stringify(heatmap));
       console.log(JSON.parse(sessionStorage.getItem("HeatmapTrackingJs")), "HeatmapTrackingJs")
}
});

//Code to demographics
var demographics;
if('geolocation' in navigator) {
  console.log('geolocation is available')
  navigator.geolocation.getCurrentPosition((position) => {
    demographics = position;
  console.log(position)
});
} else {
 console.log('geolocation is not available')
}

// Put the heatmap and demographic data together and send to the CLient Server 

// Create the object
const data = { heatmap , demographics}

const options = {
  method: 'POST',
  header : {
    'Content-Type' : 'application/json'
  },
  body : JSON.stringify(data)
};


fetch('http://4256000e7bcd.ngrok.io/api',options).then(response =>{
  console.log("Info sending to Database...")
  console.log(response.json())
})


// Dummy Data
/*

*/

// Lets build the api with Jquery AJAX
/*
$.post('localhost:8080/api', data, function(response){
 data2 = response.json();
 console.log(data2);
});
*/