// Check for LocalStorage in Browser
function supports_local_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch(e){
    return false;
  }
}
console.log('Supports LocalStorage?:',supports_local_storage());


