
const setIntervalDelay = 100;
let progressBarWidth = 1;
let products;
let details;

//Responsive nav-bar-user can access nav-bar by clicking on the hamburguer when screen in <= 900px
const hamburguer = document.querySelector('.hamburguer');
hamburguer.onclick = function() {
    navBar = document.querySelector('.nav-bar');
    navBar.classList.toggle('active');    
};

//AJAX REQUEST TO BUILD THE MAIN PAGE VIEW
let http = new XMLHttpRequest();

//prepare the request
http.open('get', '/json/products.json', true);

//send request
http.send();

//catch the reponse 
http.onload = function onloadPage() {

    //Load bar activated
    moveBar();     

    //Check ready state
    if (this.readyState === 4) { 

        //Check status 
        if (this.status >= 200 && this.status < 300) {

            //Successful response -> parse .json
            products = JSON.parse(this.responseText);                      

        } else {

            //If connection is not successful, log the error
            console.log('Request Failed: ' + this.statusText);
        }
    }    
};

//Progress bar loading (progress increases accoding to images display)
function moveBar() {
    let i = 0;
    if (i == 0) {
        i = 1;
        let myBar = document.getElementById("myBar");    

        //set a delay
        let progress = setInterval(frame, setIntervalDelay);
        function frame() {
            if (progressBarWidth >= 100) {
                clearInterval(progress);
                i = 0;
            } else {
                progressBarWidth++;
                myBar.style.width = progressBarWidth + "%";
            }

            //add images according to the prograss bar
            addImageToHtml(progressBarWidth / 10);
        }
    }
};

// Reads images from products.json and populates into html
function addImageToHtml(numImages) {
    let output = "";
    for (let index = 0; index < numImages - 1; index++) {
        const item = products[index];

        // Check for URL to display or not display price and "VIEW" link
        if (item.actionURL) {  
        output += `
        <div id="product" class="product">
            <img src="${item.src}" alt="${item.alt}">
            <p class="title">${item.title} </p>
            <p class="description">${item.description}</p>
            <p class="price">
                <span>$ ${item.price}</span>
            </p>
            <button class="cart" onclick="viewDetails('${item.actionURL}')">${item.actionLabel}</button>
        
        </div>`
        } else {
        output += `
        <div id="product" class="product">
            <img src="${item.src}" alt="${item.alt}">
            <p class="title">${item.title} </p>
            <p class="description">${item.description}</p>
            <p class="price">
                <span>SOLD-OUT</span>
            </p>            
        </div>`
        }      

        document.querySelector(".products").innerHTML = output;
    }             
};

 //FETCH REQUEST TO DISPLAY IMAGE DETAIL
 // Called when user clicks on "view" button 
function viewDetails(actionURL) {

    fetch(actionURL)
    .then (function (response) {
        return response.json();
    })

    .then (function (object) {

        let output = `
        <div id="productDetailed" class="productDetailed">
            <img src="${object.src}" alt="${object.alt}">
            <p class="description">${object.description}</p>
            <button class="close" onclick="closeDetails()">${object.actionLabel}</button>        
        </div>`;

        document.getElementById('productDetailsModal').innerHTML = output;
    })
    
    .catch (function (error) {
        console.error('something went wrong with retrieving products.json');
        console.error(error);
    })
};
 
//Called when user clicks on close button 
function closeDetails() {
    // Select the parent div element
    let parentDiv = document.getElementById('productDetailsModal');
   
    // Select the inner div element
    let innerDiv = document.getElementById('productDetailed');

    // Remove the inner div from the parent div    
    parentDiv.removeChild(innerDiv);

};