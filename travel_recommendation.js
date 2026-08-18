let recommendations = []

const resultsContainer = document.getElementById('resultsContainer')
const searchInput = document.getElementById('searchInput')
const searchButton = document.getElementById('searchButton')
const resetButton = document.getElementById('resetButton')

if (resultsContainer){
    fetch('travel_recommendation_api.json')
    .then(response =>{
        if (!response.ok) throw new Error("Sorry. We could not load any recommendations")
        return response.json()
    })
    .then(data => {
        console.log(data)
        recommendations = data
    })
    .catch (error =>{
        console.log(error)
        resultsContainer.innerHTML="<p>Unable to load recommendations</p>"
    })
}

function normalize(value){
    return value.trim().toLowerCase()
}

function searchRecommendations(){
    const keyword = normalize(searchInput.value)
    const aliases = {"beaches":"beaches", "beach":"beaches", "temples":"temples", "temple":"temples", "countries":"countries", "country":"countries"}
    const category = aliases[keyword]
    if (!category){
        resultsContainer.innerHTML = "<p>Plese enter beach, temple or country </p>"
        return
    }
    showResults(recommendations.filter(place => place.category === category))
}

function showResults(items){
    if(!items.length){
        resultsContainer.innerHTML="<p>No recommendations founds.</p>"
        return
    }
    resultsContainer.innerHTML = items.map(place => `
    <article class="resultCard">
        <img src="${place.imageUrl}">
        <div class="resultCardContent">
            <h3>${place.name}</h3>
            <p>${place.description}</p>
            <a href"${place.link}"> Learn More</a>
        </div>
    </article>`).join("")
}



function clearResults(){
    searchInput.value = ''
    resultsContainer.innerHTML = ''
}

if (searchButton) searchButton.addEventListener('click', searchRecommendations)
if (resetButton) resetButton.addEventListener('click', clearResults)
if (searchInput) searchInput.addEventListener('keydown', event => {if (event.key ==="Enter")
searchRecommendations()})