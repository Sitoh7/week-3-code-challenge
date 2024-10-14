// Your code here
let current_id;// the id of the movie that is currently being shown
let movieImg = document.getElementById("poster")
let movieTitle = document.getElementById("title")
let movieRuntime = document.getElementById("runtime")
let movieDescription = document.getElementById("film-info")
let showTime = document.getElementById("showtime")
let remainingTickets = document.getElementById("ticket-num")
let buybtn = document.getElementById("buy-ticket")
let currentnum;
let remaining;
let currentMovie;
let delbutton = document.getElementById("buy-ticket")
document.addEventListener('DOMContentLoaded', (e) => {

    getMovies()
    getMovieInfo(1)//The movie with id 1 will be the movie that will be shown when the page first loads
    e.preventDefault()
    iszero()
    

})

function getMovies() {
    let list = document.getElementById("films")

    fetch(`http://localhost:3000/films`)
        .then(resp => resp.json())
        .then(data => {
            for (i = 0; i < data.length; i++) {
                let li = document.createElement(`li`)
                let listId = data[i].id
                li.id = data[i].id
                li.innerHTML = `${data[i].title}`
                li.addEventListener('click', (e) => { getMovieInfo(e.target.id) })
                list.appendChild(li)
                
                
                //  delete button
               
                let btn = document.createElement("button")
                 btn.id = `${data[i].id}delbutton`
                btn.innerHTML = `Delete`
                li.appendChild(btn)
                btn.addEventListener('click',(e)=>{
                    e.preventDefault()
                    deleteMovie(e.target.id)// removes element from db.json file
                    const parentElement = btn.parentElement// removes element locally on user browser
                    parentElement.remove();

                })
            }
        }
        )
}

function getMovieInfo(i) {
    // console.log(i)
    current_id = Number(i)
    fetch(`http://localhost:3000/films/${i}`)
        .then(resp => resp.json())
        .then(data => {
            let dataid = data.id
            movieTitle.innerHTML = data.title
            movieImg.src = data.poster
            movieRuntime.innerHTML = `Runtime: ${data.runtime} minutes`
            movieDescription.innerHTML = data.description
            showTime.innerHTML = data.showtime
            remainingTickets.innerHTML = data.capacity - data.tickets_sold
            tickets_sold = data.tickets_sold
            remaining = Number(remainingTickets.textContent)
        }
        )
}
let movob;




buybtn.addEventListener('click', (e) => {
    e.preventDefault()

    //buytickets(current_id)
    buytickets()
}

)

function buytickets() {
    if (remaining >1) {
        fetch(`http://localhost:3000/films/${current_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                tickets_sold: tickets_sold + 1 // update tickets sold on the db
            })
        })
            .then(data => {
                remaining--; 
                document.getElementById("ticket-num").innerHTML = `${remaining}`;//update tickets remaining on the browser
                post()
            })}
    else if(remaining == 1){
        fetch(`http://localhost:3000/films/${current_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                tickets_sold: tickets_sold + 1 
            })
        })
            .then(data => {
                remaining--; 
                document.getElementById("ticket-num").innerHTML = `${remaining}`;
                document.getElementById("buy-ticket").innerHTML = 'SOLD OUT!'; 
        currentMovie = document.getElementById(`${current_id}`)
        currentMovie.classList.add('sold-out')
        post()
            })
    }
        else{
            document.getElementById("ticket-num").innerHTML = `${remaining}`;
            document.getElementById("buy-ticket").innerHTML = 'SOLD OUT!'; 
            currentMovie = document.getElementById(`${current_id}`)
            currentMovie.classList.add('sold-out')
        }
     
    // else if(remaining<1 ){
    //     document.getElementById("buy-ticket").innerHTML = 'SOLD OUT!'; 
    //     currentMovie = document.getElementById(`${current_id}`)
    //     currentMovie.classList.add('sold-out')

    // }
}
    
function post(){
    fetch(`http://localhost:3000/tickets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            film_id: current_id,
            number_of_tickets: remaining
        })
    })
}

function deleteMovie(buttonid){
    buttonnumber = buttonid.charAt(0)
    console.log(buttonnumber)
    fetch(`http://localhost:3000/films/${buttonnumber}`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    })
}
function iszero(){
if(remaining == 0){
    document.getElementById("buy-ticket").innerHTML = 'SOLD OUT!'; 
    currentMovie = document.getElementById(`${current_id}`)
    currentMovie.classList.add('sold-out')
    console.log("zero")
    soldout()
}}

function soldout(){
    document.getElementById("buy-ticket").innerHTML = 'SOLD OUT!';
}