// Button functionality (for demonstration purposes)
document.getElementById("novel-button").addEventListener("click", () => {
    // Logic for displaying novels (if necessary)
    fetchLightNovels(); // Reload novels
});

document.getElementById("manga-button").addEventListener("click", () => {
    // Logic for displaying manga (you might implement this later)
    alert("Manga feature is not implemented yet!");
});

// Fetch default novels from scraper
async function fetchLightNovels() {
    try {
        const response = await fetch("http://localhost:3000/scrape");
        const novels = await response.json();
        displayNovels(novels);
    } catch (error) {
        console.error("Error fetching novels:", error);
    }
}

// Fetch novels from search query
async function fetchSearchResults(query) {
    if (!query.trim()) {
        return fetchLightNovels(); // Fetch default novels if search is empty
    }

    try {
        const response = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`);
        const novels = await response.json();
        displayNovels(novels);
    } catch (error) {
        console.error("Error fetching search results:", error);
    }
}

// Display novels with smoother transitions
async function displayNovels(novels) {
    const container = document.getElementById("novel-container");
    container.innerHTML = ""; // Clear previous results

    for (let i = 0; i < novels.length; i++) {
        const novel = novels[i];
        addNovel(novel, container);
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
}

// Add individual novel to the container
function addNovel(novel, container) {
    const novelDiv = document.createElement("div");
    novelDiv.className = "novel-item";

    novelDiv.innerHTML = `
        <div class="novel-image-container">
            <img src="${novel.image}" alt="${novel.title}" />
        </div>
    `;

    container.appendChild(novelDiv);
}

// Search input event
const searchInput = document.getElementById("search-input");
let typingTimer;

searchInput.addEventListener("keyup", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => fetchSearchResults(searchInput.value), 300);
});

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        fetchSearchResults(searchInput.value);
    }
});

// Initial fetch for light novels on page load
fetchLightNovels();
