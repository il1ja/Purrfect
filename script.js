const apiKey = '3tCrdhVBZWYZTN8bfLl3cPJZ2Yd3oof66eukRWo36yrktz7QiF';
const secret = 'IZAG2o6QDVal1fONI6IXbGqWoAtu6mR69amQZTi6';
let access_token = ' ';
const searchURL = 'https://api.petfinder.com/v2/animals/';
const accessURL = 'https://api.petfinder.com/v2/oauth2/token'
let expires = ' '

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  if (responseJson.animals.length === 0) {
    $('#results-list').append(`<h2>No results found! Please try again</h2>`);
  }
  else {
    for (let i = 0; i < responseJson.animals.length; i++) {
      console.log(i);
      $('#results-list').append(`
 <li> <h3>${responseJson.animals[i].name}</h3>
 <p>Breed: ${responseJson.animals[i].breeds.primary}</p>
 <p>Age: ${responseJson.animals[i].age}</p>
 <p>Location: ${responseJson.animals[i].contact.address.city}</p>
 <p>Status: ${responseJson.animals[i].status}</p>
 <p>Email: ${responseJson.animals[i].contact.email}</p>
 <a href="${responseJson.animals[i].url}">Find out more</a>`)
    };
  }
}

function getAnimal(location, type) {
  const params = {
    location: location,
    type: type
  };
  console.log(params);
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;
  console.log(url);
  fetch(url, {
    headers: {
      'Authorization': 'Bearer ' +  access_token
    },
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(function (event) {
    event.preventDefault();
    console.log('checked');
    const location = $('#js-search-term').val();
    console.log(location);
    const type = $('#js-search-type').val();
    console.log(type);
    //getAccess();
    getAnimal(location, type);
  })
}

let auth = function (){
  fetch(`https://api.petfinder.com/v2/oauth2/token`, {
  method: 'POST',
  body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${secret}`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
})
.then(res => res.json())
.then(function (json){
  console.log(json);
  access_token = json.access_token;
  console.log(access_token);
  //so i have the token here and I fell like i need to push this to the global variable.
  expires = json.expires_in;
  console.log(expires);
});
}

function checkToken(){
  if(expires < 0){
    auth();
  }
  else {
    watchForm();
  }
  }

function handleSearch(){
  auth();
  checkToken();
}

$(handleSearch);