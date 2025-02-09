let jokesArray = [];
let currentIndex = 0;
let textPosition = 0;
let showingPunchline = false;

// Load jokes from API
async function loadJokes() {
    try {
        // Load 15 jokes
        const jokes = [];
        for (let i = 0; i < 15; i++) {
            const response = await fetch('https://peter-api.up.railway.app/api/darkjoke');
            const data = await response.json();
            jokes.push({
                buildup: data.buildup + '?',
                punchline: data.punchline
            });
        }
        jokesArray = jokes;
        return true;
    } catch (error) {
        console.error('Error fetching jokes:', error);
        // Fallback jokes if API fails
        jokesArray = [
            { buildup: "Why did the API fail?", punchline: "Because it was too dark to respond!" },
            { buildup: "Why did the developer go broke?", punchline: "Because he used up all his cache!" },
            { buildup: "Why did the API request feel lonely?", punchline: "Because it got no response!" }
        ];
        return false;
    }
}

async function typewriter() {
    const jokeElement = document.querySelector("#quote");
    
    // If we haven't loaded jokes yet or need to refresh
    if (jokesArray.length === 0) {
        jokeElement.innerHTML = "Loading jokes...";
        await loadJokes();
    }
    
    const currentJoke = jokesArray[currentIndex];
    const currentText = showingPunchline ? currentJoke.punchline : currentJoke.buildup;
    
    // Display text with cursor
    jokeElement.innerHTML = currentText.substring(0, textPosition) + '<span>\u25AE</span>';
    
    // If we haven't reached the end of the current text
    if (textPosition < currentText.length) {
        textPosition++;
        setTimeout(typewriter, 100);
    } else {
        // If we just finished the buildup, prepare to show punchline
        if (!showingPunchline) {
            showingPunchline = true;
            textPosition = 0;
            setTimeout(typewriter, 1500); // Pause before showing punchline
        } else {
            // W
            setTimeout(async () => {
                textPosition = 0;
                showingPunchline = false;
                currentIndex = (currentIndex + 1) % jokesArray.length;
                
            
                if (currentIndex === 0) {
                    jokesArray = [];
                }
                
                await typewriter();
            }, 4000);
        }
    }
}


window.addEventListener('load', typewriter);