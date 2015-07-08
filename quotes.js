// Check for LocalStorage in Browser
function supports_local_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch(e){
    return false;
  }
}
console.log('Supports LocalStorage?:',supports_local_storage());


////////////////////////////////////
// Storage Strategy
////////////////////////////////////

// Since localStorage can only store strings:
// We will store a json object in our data var, then serialize into localStorage using json.stringify()
// We deserialize using json.parse() to work with the data as a JavaScript object
var storage = this.localStorage;
var data;


////////////////////////////////////
// Storage Strategy
////////////////////////////////////