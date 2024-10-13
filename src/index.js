// Your code here
let current_id;
let movieImg = document.getElementById("poster")
let movieTitle = document.getElementById("title")
let movieRuntime = document.getElementById("runtime")
let movieDescription = document.getElementById("film-info")
let showTime = document.getElementById("showtime")
let remainingTickets = document.getElementById("ticket-num")
let buybtn = document.getElementById("buy-ticket")
let currentnum;
let remaining;
let delbutton = document.getElementById("buy-ticket")
document.addEventListener('DOMContentLoaded', (e) => {

    getMovies()
    getMovieInfo(1)//The movie with id 1 will be the movie that will be shown when the page first loads
    e.preventDefault()

})

function getMovies() {
    let list = document.getElementById("films")

    fetch(`http://localhost:3000/films`)
        .then(resp => resp.json())
        .then(data => {
            for (i = 0; i < data.length; i++) {
                let li = document.createElement('li')
                let listId = data[i].id
                li.innerHTML = `<li class="film item" id="${data[i].id}"> ${data[i].title} <button id="delbutton${data[i].id}"> Delete</button></li>`
                li.addEventListener('click', (e) => { getMovieInfo(e.target.id) })
                list.appendChild(li)


            }
        }
        )
}

function getMovieInfo(i) {
    console.log(i)
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
            currentnum = data.tickets_sold
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
    if (remaining > 0) {
        fetch(`http://localhost:3000/films/${current_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                tickets_sold: remaining + 1 // Increment tickets sold by 1
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                remaining--; // Decrease the available tickets
                document.getElementById("ticket-num").innerHTML = `${remaining}`;
               
            })
            .catch(error => {
                console.error('Error purchasing ticket:', error);
            });
    } else {
        document.getElementById("ticket-num").innerHTML = 'Sorry, this showing is sold out!'; // Alert if no tickets are available
    }

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

