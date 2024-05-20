let tab=document.querySelector('.tab')
let yourWeather = document.querySelector('.yourweather')   
let search = document.querySelector('.search')      
let grant = document.querySelector('.grant')
let weather = document.querySelector("[data-weather]")    
let weatherIcon = document.querySelector('.weatherimage')
let temp = document.querySelector('.temp')
let locationName=document.querySelector('.location-name')
let noAccess = document.querySelector('.no-access')
const wind = document.querySelector('[data-wind]')
const humidity = document.querySelector('[data-humidity]')
const cloud = document.querySelector('[data-cloud]')
const submit = document.querySelector('.submit')
const input = document.querySelector('#search')
const form=document.querySelector('form')
const access=document.querySelector('.acess-given')
const loadingScreen = document.querySelector('.loading-container');
let errorCode = document.querySelector('.error')

let currentTab=tab;
currentTab.classList.add('current-tab')

function switchTab(clickedTab)
{
    if(clickedTab!=currentTab){
     currentTab.classList.remove('current-tab')
     currentTab=clickedTab
     currentTab.classList.add('current-tab')  
     if(!form.classList.contains('active'))   //by deafault current tab me your weather hai so if this function is called and the upper if is executed then,
     // it only means that tab is switched to search weather so search form should be visible and if again tab is switched then form will be having active class so inner if won't be executed.
        {
            errorCode.classList.remove('active') 
            console.log('if chala')
            noAccess.classList.add('hidden')
            access.classList.remove('active')
            form.classList.add('active')
        }
        else{
            //since upper if is executed and inner isn't then it means main phle seach wale tab pe tha and ab your weather visible krna hai
            errorCode.classList.remove('active') 
            form.classList.remove('active')
            access.classList.remove('active')
             //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we have saved them there.
            getfromSessionStorage();
        }
    }
}


function getfromSessionStorage()
{
    const localCoordinates=sessionStorage.getItem('user-coordinates')
    if(!localCoordinates){
        //agar local coordinates nhi mile
        noAccess.classList.remove('hidden')
    }
    else{
        loadingScreen.classList.add('active')
        const coordinates=JSON.parse(localCoordinates)
        fetchUserWeatherInfo(coordinates)
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates
    //make grant container invisible
    noAccess.classList.add('hidden')
    //make loading list visible
    loadingScreen.classList.add("active");
    myWeather(lat,lon)
}


function showPosition(position){
    let latitude = position.coords.latitude
    let longitude = position.coords.longitude
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    myWeather(latitude,longitude)
}


async function myWeather(lat,lon)  //function to call api to get my weather
{
 try {
    loadingScreen.classList.remove("active");
 let API="b7e19a6bed4a3d0ac93484dbdc0d8942"   
 let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=metric`)
 let weather= await response.json()
 console.log(weather)
 const myLocation=weather.name;   //will tell my location
 const myWeather = weather.weather[0].main   //will tell how's the weather
 const myWeatherIcon= `http://openweathermap.org/img/w/${weather?.weather?.[0]?.icon}.png`  //will give img for weather
 const myTemp = weather.main.temp  //will tell temperature in degreee celsius
 const myHumidity = weather.main.humidity;
 const myWind = weather.wind.speed;
 const myCloud=weather.clouds.all;
 displayMyWeather(myLocation,myWeather,myWeatherIcon,myTemp,myHumidity,myWind,myCloud)  //calling function to display weather
} 
 catch (error) {
  console.log(error)  
 }
}


async function searchedWeather(city)  //function to call api to get weather of searched location
{ 
 try {
 let API="b7e19a6bed4a3d0ac93484dbdc0d8942"   
 let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}&units=metric`)
 let weather= await response.json()
 console.log(weather)

 const searchedLocation=weather.name;   //will tell location searched
 const searchedLocationWeather = weather.weather[0].main   //will tell how's the weather
 const searchedLocationWeatherIcon= `http://openweathermap.org/img/w/${weather?.weather?.[0]?.icon}.png`  //will give img for weather
 const searchedLocationTemp = weather.main.temp  //will tell temperature in degreee celsius
 const searchedLocationHumidity = weather.main.humidity;
 const searchedLocationWind = weather.wind.speed;
 const searchedLocationCloud=weather.clouds.all;


 displayMyWeather(searchedLocation,searchedLocationWeather,searchedLocationWeatherIcon,searchedLocationTemp,searchedLocationHumidity,searchedLocationWind,searchedLocationCloud)  //calling function to display weather
} 
 catch (error) {
  loadingScreen.classList.remove('active')
  if(access.classList.contains('active'))
    {
        access.classList.remove('active')
    }
    errorCode.classList.add('active')  
 }
}


function displayMyWeather(myLocation,myWeather,myWeatherIcon,myTemp,myHumidity,myWind,myCloud)   //fucntion to display my weather and searched location weather as well
{
 locationName.innerHTML=myLocation
 weather.innerHTML= myWeather
 weatherIcon.src=myWeatherIcon
 temp.innerHTML=`${myTemp +""+`\u00B0`}C`
 humidity.innerHTML=`${myHumidity}%`
 wind.innerHTML=`${myWind}m/s`
 cloud.innerHTML=`${myCloud}%`

loadingScreen.classList.remove('active')
access.classList.add('active')
}


async function getGeolocation()
{
    if(navigator.geolocation) {
    noAccess.classList.add('hidden')   //so that if perm is given it won't display grant permission container
    loadingScreen.classList.add('active')
    navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        noAccess.classList.remove('hidden')
    }
}


grant.addEventListener('click',function(){
    navigator.permissions.query({name:'geolocation'}).then(function(result) {
        if (result.state === 'granted') {
          // The permission has been granted
          console.log('Geolocation permission granted');
          loadingScreen.classList.add("active");
          getGeolocation()
        } else if (result.state === 'prompt') {
          // The permission is being prompted
          console.log('Geolocation permission prompt');
        } else if (result.state === 'denied') {
          // The permission has been denied
          console.log('Geolocation permission denied');
        }
      });
      
})
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    errorCode.classList.remove('active') 
    let inputValue=input.value
    if(inputValue==="")
        return;
    console.log(inputValue)
    console.log('form chala')
    loadingScreen.classList.add('active')
    searchedWeather(inputValue)
})


yourWeather.addEventListener('click',function(){
    switchTab(yourWeather)
    // form.classList.remove('active')   //so that input field won't be visible
})


search.addEventListener('click',function(){
    switchTab(search)
})
