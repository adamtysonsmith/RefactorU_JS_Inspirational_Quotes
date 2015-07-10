///////////////////////////////////////////////////////////
// Strategy & Table of Contents
///////////////////////////////////////////////////////////

// Strategy
// LocalStorage can only store strings
// We need to serialize our data objects to json strings when updating LS,
// and deserialize back to objects when reading from LS

// Table of Contents
// I. Initilizing and Accessing Data
    // 1. Initial Data
    // 2. Sort and Serialize Data
    // 3. Push Initial Data to LocalStorage
    // 4. Read Data from LocalStorage

// II. Receiving User Input and Updating Data Structures
    // 1. Random Quote Generation
    // 2. 

// III: Updating UI



//////////////////////////////////////////////////////////////////////////////////
// I. Initilizing and Accessing Data
//////////////////////////////////////////////////////////////////////////////////\
///////////////////////////////////////////////////////////
// 1. Initial Data
///////////////////////////////////////////////////////////

// This initial data will only be loaded once if the quoteData key does not
// exist in LocalStorage database
var initialData = {
    quotes: [
        { author: 'Martin Golding',
          quote: 'Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.',
          rating: 3,
          quoteid: '0'
        },
        { author: 'Edsger Dijkstra',
          quote: 'If debugging is the process of removing software bugs, then programming must be the process of putting them in.',
          rating: 4,
          quoteid: '1'
        },
        { author: 'Eric S. Raymond',
          quote: 'Computer science education cannot make anybody an expert programmer any more than studying brushes and pigment can make somebody an expert painter.',
          rating: 5,
          quoteid: '2'
        },
        { author: 'Michael Sinz',
          quote: 'Programming is like sex. One mistake and you have to support it for the rest of your life.',
          rating: 2,
          quoteid: '3'
        },
        { author: 'Gerald Weinberg',
          quote: 'If builders built buildings the way programmers wrote programs, then the first woodpecker that came along would destroy civilization.',
          rating: 2,
          quoteid: '4'
        }
]};



///////////////////////////////////////////////////////////
// 2. Sort and Serialize the Initial Data
///////////////////////////////////////////////////////////

var sortedData, jsonData;

var sortData = function(data) {
    // Sort our data by rating
    // Return the new data structure
    return { quotes: _.sortBy(data.quotes, 'rating').reverse() };
}
var serializeData = function(data) {
    // Take a data variable as input
    // return the data converted to json string
    return JSON.stringify(data);
}

sortedData = sortData(initialData);
jsonData = serializeData(sortedData);




///////////////////////////////////////////////////////////
// 3. Push Initial JSON Data to LocalStorage
///////////////////////////////////////////////////////////

$(document).ready(function(){
    // Check for LocalStorage in Browser
    function supports_local_storage() {
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch(e){
        return false;
      }
    }
    console.log('Supports LocalStorage?:',supports_local_storage());
    
    // If browser supports LocalStorage, we use it
    if(supports_local_storage() === true) {
        // Does the key exist?
        // YES: Read data from the key.
        // NO: Create the key.
        if (!localStorage.getItem('quoteData')) {
            localStorage.setItem('quoteData', jsonData);
            console.log('Data is loading now!');
        } else {
            console.log('Data has been initialized previosuly.');
        } 
    }
    
    // Update the UI
    updateQuoteTemplate();
}); // End Ready




///////////////////////////////////////////////////////////
// 4. Read Data from LocalStorage
///////////////////////////////////////////////////////////

var quoteDataObject = {};

var readDataFromLocalStorage = function() {
    // Pull a json value from the LS
    // convert the value to a javascript object
    // return the new data object
    var quoteDataJSON = localStorage.getItem('quoteData');
    quoteDataObject = JSON.parse(quoteDataJSON);
    
    // Return the data object with the LS data
    return quoteDataObject;
}






//////////////////////////////////////////////////////////////////////////////////
// II. Receiving User Input and Updating Data Structures
//////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////
// Get Input and Update Data
////////////////////////////////////

// Define a Quote constructor
var Quote = (function() {
    // We are starting the count from 4 because our initial data brings the count up to 4
    var quoteidCounter = 4;
    var allQuotes = initialData.quotes;
    
    var Quote = function(quote, author) {
        var getUniqueQuoteID = function() {
            var lastID = _.sortBy(allQuotes, 'quoteid').reverse()[0];
            return lastID;
        }
        
        this.author = author;
        this.quote = quote;
        this.rating = 0;
        this.quoteid = getUniqueQuoteID();
        
        allQuotes.push(this);
    }
    
    Quote.pushNewQuote = function() {
        console.log(allQuotes);
    }
    
    return Quote;
})();


// Get user input and create new Quote
var getUserInput = function() {
    var userQuote = $('.input-quote').val();
    var userAuthor = $('.input-author').val();
    return new Quote(userQuote, userAuthor);
}

// Update LS on Click
$('.button.submit').on('click', function() {
    var newQuote = getUserInput();
    quoteDataObject.quotes.push(newQuote);
    
    // Clear the inputs
    $('.input-quote').val('');
    $('.input-author').val('');
    
    // Update the Local Storage
    updateLocalStorage();
    
    // Update the UI with new LS Data
    updateQuoteTemplate();
});



////////////////////////////////////
// Sort, Serialize and Update LS
////////////////////////////////////

var updateLocalStorage = function() {
    var sortNewData = sortData(quoteDataObject);
    var newJSON = serializeData(sortNewData);
    localStorage.setItem('quoteData', newJSON);
}



////////////////////////////////////
// Magical Random Quote Generation
////////////////////////////////////

var generateRandomQuote = function(data) {
    // We can just alert data from the js object
    var random = _.sample(data.quotes);
    alert('"' + random.quote + '"' + '\n\n-' + random.author);
}
$('.button.generate').on('click', function(){
    generateRandomQuote(initialData);
});



////////////////////////////////////
// Delete a Quote - In progress
////////////////////////////////////
// Find 'this' object that was clicked and delete the object, update the storage and reload DOM

// Show the delete link on hover
$('.quote-container').on('mouseenter', '.quote-entry', function(){
        $(this).find('.quote-delete').css('display','inline-block');
}).on('mouseleave', '.quote-entry', function(){
    $(this).find('.quote-delete').css('display','none');
});

// Delete the quote on click and update the Data Object
$('.quote-container').on('click', '.quote-delete', function(){
    // Get the unique ID of the element clicked
    var entryID = $(this).parent().attr('data-quoteid');
    console.log('Entry id is',entryID);
    
    // Remove the item from the Data Object
    quoteDataObject = { 
        quotes: quoteDataObject.quotes.filter(function(obj){
            return obj.quoteid !== entryID;
        })
    }
    console.log('This object should have removed the item',quoteDataObject);
    
    // We operated on the QDO succesfully - but we need to update LS before calling updateQuoteTemplate()
    updateLocalStorage();
    
    // Update UI with the new LS Data
    updateQuoteTemplate();
});



////////////////////////////////////
// Rate a Quote
////////////////////////////////////

// On click, set the number of stars
// Each star should probably be a unique element so you know which one they clicked
    // 1 through 5
    // Conditionnaly set the content to be solid||hollow star
//$('.quote-container').on('click','.quote-entry',function(){
//	console.log($(this).attr('data-quoteid'));
//    // Update the object rating (with this quoteid) to the value of the star clicked
//});


////////////////////////////////////
// Persisting Data Workflow
////////////////////////////////////

// The persistence workflows
// 1. Create a Sorted Data Object first from the initial hardcoded data object
// 2. Stringify our data object, push it to storage
// 3. Parse the Data back from storage to populate our Content

// Now we will perform this process each time an event triggers (clicks star, submits quote, deletes quote)
// 1. Grab data from user
// 2. Update the data object
// 3. Sort the data object
// 3. Update the storage object
// 4. Parse the Data back from storage to populate our Content
  // (Either Object.observe or update when event triggers)






//////////////////////////////////////////////////////////////////////////////////
// III. Updating the User Interface
//////////////////////////////////////////////////////////////////////////////////

// Generate our HTML as strings
var quoteContent = '<h2 class="quote-content">"{{quote}}"</h2>';
var quoteStars = '<span class="quote-stars">{{rating}}&nbsp;&nbsp; &#9733;&#9733;&#9733;&star;&star;</span>';
var quoteAuthor = '<h3 class="quote-author">-{{author}}' + quoteStars + '</h3>';
var quoteDelete = '<a href="javascript:void(0)" class="quote-delete">Delete Quote</a>';

// Handlebars Template Code
var quoteEntry = '{{#each quotes}}<div class="quote-entry" data-quoteid="{{quoteid}}">'
                 + quoteContent + quoteAuthor + quoteDelete
                 + '</div>{{/each}}';

// Handlebars Template Compilation
var quoteTemplate = Handlebars.compile(quoteEntry);

// Update the Template
// This is initially called on page load above, 
// then called again every time data is updated
var updateQuoteTemplate = function() {
    // readDataFromLocalStorage returns our updated quoteDataObject
    $('.quote-container').html(quoteTemplate(readDataFromLocalStorage()));
}