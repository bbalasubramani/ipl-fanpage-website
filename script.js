// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navMenu = document.querySelector('nav ul');
const backToTopBtn = document.getElementById('backToTop');
const matchContainer = document.getElementById('matchContainer');
const playerContainer = document.getElementById('playerContainer');
const newsContainer = document.getElementById('newsContainer');
const tweetContainer = document.getElementById('tweetContainer');
const fanPoll = document.getElementById('fanPoll');

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Back to Top Button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// Filter Matches
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        loadMatches(filter);
    });
});

// Filter Players
document.querySelectorAll('.player-filter').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.player-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        loadPlayers(filter);
    });
});

// Fan Poll Submission
fanPoll.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedOption = document.querySelector('input[name="poll"]:checked').value;
    alert(`Thanks for voting! You selected ${selectedOption} as CSK's potential MVP.`);
    fanPoll.reset();
});

// Load Data from JSON
async function loadData() {
    try {
        const response = await fetch('fixtures.json');
        const data = await response.json();
        
        // Load matches
        loadMatches('all', data.matches);
        
        // Load players
        loadPlayers('all', data.players);
        
        // Load news
        loadNews();
        
        // Load tweets
        loadTweets();
        
        // Initialize chart
        initChart();
        
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Load Matches
function loadMatches(filter, matches) {
    if (filter === 'home') {
        matches = matches.filter(match => match.venue.includes('Chennai'));
    } else if (filter === 'away') {
        matches = matches.filter(match => !match.venue.includes('Chennai'));
    }
    
    matchContainer.innerHTML = '';
    
    matches.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        matchCard.innerHTML = `
            <div class="match-header">
                <h3>${match.date}</h3>
            </div>
            <div class="match-teams">
                <div class="team">
                    <img src="${match.team1.logo}" alt="${match.team1.name}">
                    <p>${match.team1.name}</p>
                </div>
                <div class="vs">vs</div>
                <div class="team">
                    <img src="${match.team2.logo}" alt="${match.team2.name}">
                    <p>${match.team2.name}</p>
                </div>
            </div>
            <div class="match-info">
                <p><i class="fas fa-map-marker-alt"></i> ${match.venue}</p>
                <p><i class="fas fa-clock"></i> ${match.time}</p>
            </div>
        `;
        matchContainer.appendChild(matchCard);
    });
}

// Load Players
function loadPlayers(filter, players) {
    playerContainer.innerHTML = '';
    
    // Filter players if needed
    const displayedPlayers = filter === 'all' 
        ? players 
        : players.filter(player => player.role === filter);
    
    displayedPlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';
        
        playerCard.innerHTML = `
            <div class="player-img-container">
                <img src="${player.image}" 
                     alt="${player.name}"
                     class="player-image"
                     onerror="this.onerror=null;this.src='images/default-player.jpg'">
            </div>
            <div class="player-info">
                <h3>${player.name}</h3>
                <span class="player-role">${player.role}</span>
                <div class="player-stats">
                    <div class="stat">
                        <p class="stat-value">${player.runs}</p>
                        <p class="stat-label">Runs</p>
                    </div>
                    <div class="stat">
                        <p class="stat-value">${player.wickets}</p>
                        <p class="stat-label">Wickets</p>
                    </div>
                </div>
            </div>
        `;

        playerContainer.appendChild(playerCard);
        
        // Adjust image after load
        const img = playerCard.querySelector('img');
        img.onload = function() {
            // Calculate and apply proper scaling for portrait/landscape
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            if (aspectRatio < 0.8) { // Very portrait
                img.style.objectPosition = 'center top';
            } else if (aspectRatio > 1.2) { // Very landscape
                img.style.width = 'auto';
                img.style.height = '100%';
            }
        };
    });
}


// Load News
function loadNews() {
    // Sample news loading logic
    const news = [
        { title: "CSK wins the IPL 2025!", date: "2025-05-01", content: "Chennai Super Kings clinched the title in a thrilling final." },
        { title: "Player of the Match: Ruturaj Gaikwad", date: "2025-04-30", content: "Ruturaj scored a brilliant century in the final." }
    ];
    
    newsContainer.innerHTML = '';
    
    news.forEach(article => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.innerHTML = `
            <div class="news-content">
                <p class="news-date">${article.date}</p>
                <h3>${article.title}</h3>
                <p>${article.content}</p>
                <a href="#" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        newsContainer.appendChild(newsCard);
    });
}

// Load Tweets
function loadTweets() {
    // Sample tweets loading logic
    const tweets = [
        { content: "What a match! CSK for the win! #WhistlePodu", user: "CSK_Fan1" },
        { content: "Can't wait for the next game! Go CSK! #Yellove", user: "CSK_Fan2" }
    ];
    
    tweetContainer.innerHTML = '';
    
    tweets.forEach(tweet => {
        const tweetDiv = document.createElement('div');
        tweetDiv.className = 'tweet';
        tweetDiv.innerHTML = `<p><strong>${tweet.user}:</strong> ${tweet.content}</p>`;
        tweetContainer.appendChild(tweetDiv);
    });
}

// Initialize Chart (Placeholder)
function initChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Matches Played', 'Wins', 'Losses'],
            datasets: [{
                label: 'CSK Performance',
                data: [14, 10, 4],
                backgroundColor: [
                    'rgba(253, 185, 19, 0.6)',
                    'rgba(0, 93, 183, 0.6)',
                    'rgba(255, 0, 0, 0.6)'
                ],
                borderColor: [
                    'rgba(253, 185, 19, 1)',
                    'rgba(0, 93, 183, 1)',
                    'rgba(255, 0, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Load Data on Page Load
window.onload = loadData;
