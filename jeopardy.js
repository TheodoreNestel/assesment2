// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

// this wiill contain an array of categories
let categories = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

 function randomAndFilter(res){

    
        var currentIndex = res.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element.../
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = res[currentIndex];
          res[currentIndex] = res[randomIndex];
          res[randomIndex] = temporaryValue;
        }
      
        return res.slice(0,6);

      

 }


 //turned out to be useless

// function getCategoryIds(res) {

//     //what purpose is this function
//     return res.map(cat => cat.id );


// }


/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

 //the name was stupid so I changed the GetCategories
function createTable(catID) {

    let $Table = $(`<table id="gameTable"> <tr>${categories.map(cat => `<th>${cat.title}</th>`).join("")}</<tr> </table>`)
    $("body").append($Table);
    let $Button = $(`<button>Restart Game</button>`)
    $("body").append($Button)

    $Table.on("click",handleClick);
    $Button.on("click", Restart);
    
    





}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

     function fillTable() {


    let $Table = $("#gameTable tbody") 

    //categories.forEach(cat => $Table.append(`<tr>${cat.clues.map(clue => `<td data-question="${clue.question}" data-answer="${clue.answer}"> ? </td>`).join("")}</tr>`))

    for(let i = 0; i < 5; i++){

        const $Row = $(`<tr id="row${i}">${categories.map(cat => cat.clues[i]).map(clue => `<td class="clue" data-cat="${clue.category_id}" data-i="${i}" data-flipped="0" data-revealed="0"> ? </td>`).join("")}</tr>`);

        $Table.append($Row);


    }
    

}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {

    const t = evt.target

    

    if(!t.classList.contains("clue")){

        return
    }

    const clue = categories.find(cat => cat.id == t.dataset.cat).clues[parseInt(t.dataset.i)]

    if(!parseInt(t.dataset.flipped)){
        t.innerHTML = clue.question;
        t.dataset.flipped = 1;

    }
    else if(!parseInt(t.dataset.revealed)){
        t.innerHTML = clue.answer;
        t.dataset.flipped = 1;
    }

    



}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */


/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {


    let response = await axios.get("http://jservice.io/api/categories", {params: { count:100 }})
    categories = randomAndFilter(response.data);

    
    const clues = await Promise.all(categories.map( cat => axios.get("http://jservice.io/api/category" , {params: {id:cat.id}}))) 

       
     categories.forEach((cat , i) => { 


        cat.clues = clues[i].data.clues.slice(0,5);
        delete cat.clues_count;
        
     });

     createTable();
     fillTable();
     console.log(categories);


}


function Restart(evt)
{


    $("#gameTable").remove();
    $(evt.target).remove();
    setupAndStart();
    



}


window.addEventListener("load" , setupAndStart);
/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO