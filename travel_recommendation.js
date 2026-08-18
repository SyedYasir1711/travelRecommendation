let recommendations = [];

const resultsContainer = document.getElementById("resultsContainer");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resetButton = document.getElementById("resetButton");

fetch("travel_recommendation_api.json")
  .then(function (response) {
    if (!response.ok) {
      throw new Error("Unable to load JSON data");
    }
    return response.json();
  })
  .then(function (data) {
    console.log("JSON data loaded:", data);
    const countryRecommendations = data.countries.flatMap(function (country) {
      return country.cities.map(function (city) {
        return {
          category: "country",
          country: country.name,
          name: city.name,
          imageUrl: city.imageUrl,
          description: city.description
        };
      });
    });

    const templeRecommendations = data.temples.map(function (temple) {
      return {
        category: "temple",
        name: temple.name,
        imageUrl: temple.imageUrl,
        description: temple.description
      };
    });

    const beachRecommendations = data.beaches.map(function (beach) {
      return {
        category: "beach",
        name: beach.name,
        imageUrl: beach.imageUrl,
        description: beach.description
      };
    });

    recommendations = [
      ...countryRecommendations,
      ...templeRecommendations,
      ...beachRecommendations
    ];

    console.log("Flattened recommendations:", recommendations);
  })
  .catch(function (error) {
    console.error("Error:", error);

    if (resultsContainer) {
      resultsContainer.innerHTML = "<p>There was a problem loading the recommendations.</p>";
    }
  });

function normalizeKeyword(keyword) {
  return keyword.trim().toLowerCase();
}

function showResults(results) {
  if (results.length === 0) {
    resultsContainer.innerHTML =
      "<p>No recommendations found. Try beach, temple, or country.</p>";
    return;
  }

  resultsContainer.innerHTML = results
    .map(function (place) {
      return `
        <article class="result-card">
          <img src="${place.imageUrl}" alt="${place.name}">

          <div class="result-card-content">
            <h3>${place.name}</h3>
            <p>${place.description}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function searchRecommendations() {
  const keyword = normalizeKeyword(searchInput.value);
  const keywordMap = {beach: "beach", beaches: "beach", temple: "temple", temples: "temple", country: "country", countries: "country"};
  const category = keywordMap[keyword];
  if (!category) {
    resultsContainer.innerHTML =
      "<p>Please search for beach, temple, or country.</p>";
    return;
  }
  const filteredResults = recommendations.filter(function (place) {
    return place.category === category;
  });
  showResults(filteredResults);
}

function clearResults() {
  searchInput.value = "";
  resultsContainer.innerHTML = "";
}

if (searchButton) {
  searchButton.addEventListener("click", searchRecommendations);
}

if (resetButton) {
  resetButton.addEventListener("click", clearResults);
}

if (searchInput) {
  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchRecommendations();
    }
  });
}