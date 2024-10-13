// Your code here

let movieImg = document.getElementById("poster")
let movieTitle = document.getElementById("title")
let movieRuntime = document.getElementById("runtime")
let movieDescription = document.getElementById("film-info")



document.addEventListener('DOMContentLoaded',(e)=>{
    e.preventDefault()
    getMovies()
    handleItem(1)//The movie with id 1 will be the movie that will be shown when the page first loads
})

function getMovies(){
    let list = document.getElementById("films")
  
    fetch(`http://localhost:3000/films`)
    .then(resp=>resp.json())
    .then(data=>{
        for(i=0;i<data.length;i++){
            let  li = document.createElement('li')
            let listId = data[i].id
        li.innerHTML =`<li class="film item" id="${data[i].id}"> ${data[i].title}</li>`
       
        li.addEventListener('click',(e)=> {handleItem(e.target.id)})
        
        
        
        list.appendChild(li)

        }}
    )
}

function handleItem(i){
    console.log(i)

    fetch(`http://localhost:3000/films/${i}`)
    .then(resp=>resp.json())
    .then(data=>{console.log(data)
    movieTitle.innerHTML = data.title 
    //movieImg.innerHTML = `<img id="poster" src="${data.poster}"`
    movieImg.src = data.poster
    movieRuntime.innerHTML = `Runtime: ${data.runtime} minutes`
    movieDescription.innerHTML = data.description
    }
    )
}