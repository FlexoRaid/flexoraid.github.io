document.addEventListener("DOMContentLoaded", function() {

    // ===== MOVIE DATABASE =====
    const movieDatabase = [
    { 
        title: "One Piece", 
        author: "Eiichiro Oda", 
        release: "1999", 
        episodes: "1155", 
        link: "https://www.crunchyroll.com/one-piece", 
        description: "One Piece is the greatest fiction in the world due to its intricate world-building, diverse characters, and profound themes. It explores complex topics like freedom, justice, and the pursuit of dreams, resonating with readers worldwide. However, it's only a 9.9 due to the poor pacing in anime.", 
        rating: 9.9, 
        image: "../../../img/one-piece.webp", 
        category: "top",
        genre: "Action, Adventure"
    },
    { 
        title: "Naruto Shippuden", 
        author: "Masashi Kishimoto", 
        release: "2007", 
        episodes: "500", 
        link: "https://www.crunchyroll.com/naruto-shippuden", 
        description: "Naruto Shippuden is an incredible journey that stands out for its deep emotional storytelling and some of the best-written villains in anime history. The way it explores themes like pain, loneliness, and war makes it a true masterpiece. I give it a 9.5/10—it would be a perfect 10 if it weren't for the high amount of filler episodes that sometimes slow down the main plot.", 
        rating: 9.5, 
        image: "../../../img/naruto-shippuden.jpg", 
        category: "top",
        genre: "Action, Fantasy"
    },
    {
        title: "Naruto", 
        author: "Masashi Kishimoto", 
        release: "2002", 
        episodes: "220", 
        link: "https://www.crunchyroll.com/naruto", 
        description: "The original Naruto series is a classic for a reason, capturing the heart of a young boy's struggle for recognition with incredible fight scenes and emotional depth. However, I give it an 8.3/10 because the series loses significant momentum at the end, where nearly 100 episodes are just filler that don't contribute to the main story.", 
        rating: 8.3, 
        image: "../../../img/naruto.jpg", 
        category: "top",
        genre: "Action, Adventure"
    },
    { 
        title: "Hunter x Hunter", 
        author: "Yoshihiro Togashi",
        release: "2011",
        episodes: "148", 
        link: "https://www.netflix.com/title/70300472", 
        description: "Hunter x Hunter is a masterpiece of the shonen genre, featuring an incredible power system and complex storytelling that constantly subverts expectations. I give it a 9.8/10 because it is nearly perfect in its execution and character development. It is just heartbreaking to know that we will likely never see any more episodes produced, leaving this amazing journey unfinished.", 
        rating: 9.8, 
        image: "../../../img/hunter.png", 
        category: "top",
        genre: "Adventure, Fantasy"
    },
    {
        title: "Cyberpunk Edgerunners", 
        author: "Masahiko Otsuka", 
        release: "2022", 
        episodes: "10", 
        link: "https://www.netflix.com/title/81054853", 
        description: "Cyberpunk Edgerunners is a visual masterpiece with an incredibly intense and gripping story. I give it a 9.1/10 because it is a deeply emotional journey that hit me so hard I actually cried. The ending is absolutely heartbreaking and stays with you long after the credits roll.", 
        rating: 9.1, 
        image: "../../../img/cyberpunk.jpg", 
        category: "top",
        genre: "Sci-Fi, Action"
    },
    { 
        title: "Attack on Titan", 
        author: "Hajime Isayama", 
        release: "2013", 
        episodes: "73", 
        link: "https://www.crunchyroll.com/attack-on-titan", 
        description: "Attack on Titan is a phenomenal series that features some of the biggest and most mind-blowing plot twists in all of fiction. The way the story evolves from a simple survival horror into a complex political drama is masterful. I give it a 9.2/10 because the storytelling is incredibly gripping and keeps you questioning everything until the very end.", 
        rating: 9.2, 
        image: "../../../img/attck-on-titan.jpg", 
        category: "top",
        genre: "Action, Drama"
    },
    { 
        title: "JoJo's Bizarre Adventure", 
        author: "Hirohiko Araki", 
        release: "2012", 
        episodes: "190", 
        link: "https://www.crunchyroll.com/jojos-bizarre-adventure", 
        description: "JoJo’s Bizarre Adventure is a legendary series that delivers absolute peak entertainment with its unique style and creative battles. Most of the seasons are incredible and easily reach the highest levels of fiction. I give it an 9.0/10 it would be rated even higher, but the last season somehow killed the vibe for me and didn't quite live up to the greatness of the previous parts.", 
        rating: 9.0, 
        image: "../../../img/jojos.jpg", 
        category: "top",
        genre: "Action, Supernatural"
    },
    { 
        title: "Solo Leveling", 
        author: "Chugong", 
        release: "2024", 
        episodes: "26", 
        link: "https://www.crunchyroll.com/solo-leveling", 
        description: "Solo Leveling is an absolute thrill ride with some of the most peak action sequences and visual hype in modern anime. I give it an 7.0/10 while it is undeniably exciting and well-produced, it feels slightly overrated because there are many other series with much deeper storytelling and character development. It’s a great watch, but not quite at the level of the all-time masterpieces.", 
        rating: 7.0, 
        image: "../../../img/solo-leveling.png", 
        category: "top",
        genre: "Action, Fantasy"
    },
    { 
        title: "Demon Slayer", 
        author: "Koyoharu Gotouge", 
        release: "2019", 
        episodes: "63", 
        link: "https://www.crunchyroll.com/demon-slayer", // Korrigiert!
        description: "Demon Slayer is absolute peak fiction that sets a new standard for the entire medium. I give it a 8.7/10 because it features some of the best animation ever seen in anime history, making every battle a breathtaking visual experience. The combination of its beautiful art style and high-stakes storytelling makes it a must-watch for any fan.", 
        rating: 8.7, 
        image: "../../../img/demon-slayer.jpeg", 
        category: "top",
        genre: "Action, Fantasy"
    },
    { 
        title: "Jujutsu Kaisen", 
        author: "Gege Akutami", 
        release: "2020", 
        episodes: "55", 
        link: "https://www.crunchyroll.com/jujutsu-kaisen", 
        description: "Jujutsu Kaisen is undeniably peak when it comes to action and high-quality production, but I personally give it a 7.7/10. While it is an exciting watch, I feel it is heavily overhyped considering there are many other series with much stronger storytelling and character depth. It’s a solid show, but compared to the true masterpieces, it just doesn't rank as high for me.", 
        rating: 7.7, 
        image: "../../../img/jjk.avif", 
        category: "top",
        genre: "Action, Supernatural"
    },
    { 
        title: "Chainsaw Man", 
        author: "Tatsuki Fujimoto", 
        release: "2022", 
        episodes: "14", 
        link: "https://www.crunchyroll.com/chainsaw-man", 
        description: "Chainsaw Man is a beautifully crafted series with incredible production value and a very unique style. However, I give it a 7.2/10 because I just didn't feel the vibe as much as my friends did. While I can appreciate how well-made it is, it didn't resonate with me personally in the same way it did for others.", 
        rating: 7.2, 
        image: "../../../img/chainsaw-man.avif", 
        category: "other",
        genre: "Action, Horror"
    },
    { 
        title: "Death Note", 
        author: "Tsugumi Ohba", 
        release: "2006", 
        episodes: "37", 
        link: "https://www.crunchyroll.com/death-note", 
        description: "Death Note is an incredibly gripping and intense series, making it the perfect choice for anyone's very first anime. The psychological battle between the main characters keeps you on the edge of your seat from start to finish. I give it an 8.1/10 because it is a masterclass in suspense and a fantastic introduction to the medium.", 
        rating: 8.1, 
        image: "../../../img/death-note.jpg", 
        category: "other",
        genre: "Psychological, Thriller"
    },
    { 
        title: "Boruto", 
        author: "Ukyo Kodachi", 
        release: "2017", 
        episodes: "293", 
        link: "https://www.crunchyroll.com/boruto", 
        description: "Boruto is actually not as bad as many people say, and I feel it is a bit overhated by the community. It’s an enjoyable watch, but I give it a 7.6/10 because it doesn't top the original Naruto. It fails to capture that same iconic feeling and emotional depth that made the previous series so legendary.", 
        rating: 7.6, 
        image: "../../../img/boruto.jpg", 
        category: "other",
        genre: "Action, Adventure"
    },
    { 
        title: "Our Dating Story", 
        author: "Makiko Nagaoka", 
        release: "2024", 
        episodes: "12", 
        link: "https://www.crunchyroll.com/our-dating-story-the-experienced-you-and-the-inexperienced-me", 
        description: "Our Dating Story is a truly beautiful and heartwarming series with a wonderful narrative. I give it a 7.1/10 because I really enjoyed the story and the connection between the characters. It’s a great watch, but it’s a bit sad knowing that we will most likely never get a second season to continue the journey.", 
        rating: 7.1, 
        image: "../../../img/our-dating-story.avif", 
        category: "other",
        genre: "Romance, Slice of Life"
    },
    { 
        title: "Alya Sometimes Hides Her Feelings in Russian", 
        author: "Sunsunsun", 
        release: "2024", 
        episodes: "12", 
        link: "https://www.crunchyroll.com/alya-sometimes-hides-her-feelings-in-russian", 
        description: "Alya Sometimes Hides Her Feelings in Russian is a wonderful and charming series that balances its beautiful romance with some lighthearted comedy. I really enjoyed the unique dynamic between the characters and the funny moments throughout the show. I give it an 6.9/10 because it is a lovely watch that is both heartwarming and genuinely entertaining.", 
        rating: 6.9, 
        image: "../../../img/alya-sometimes-hides-her-feelings-in-russian.avif", 
        category: "other",
        genre: "Romance, Comedy"
    },
    { 
        title: "My Dress-Up Darling", 
        author: "Shinichi Fukuda", 
        release: "2022", 
        episodes: "24", 
        link: "https://www.crunchyroll.com/my-dress-up-darling", 
        description: "My Dress-Up Darling is absolute PEAK fiction that perfectly captures the passion for cosplay and the beautiful bond between its main characters. I loved it so much that I even read the manga to see more of the story. I give it an 7.3/10 because it’s a high-quality production with great character growth and a truly heartwarming vibe.", 
        rating: 7.3, 
        image: "../../../img/my-dressed-up-darling.avif", 
        category: "other",
        genre: "Romance, Slice of Life"
    },
    { 
        title: "Hell's Paradise", 
        author: "Yuji Kaku", 
        release: "2023", 
        episodes: "21",
        link: "https://www.crunchyroll.com/hells-paradise", 
        description: "Hell’s Paradise is a thrilling and dark journey that stands out with its unique world-building and intense atmosphere. The mix of brutal action and mysterious elements makes it a very compelling watch. I give it an 7.6/10 because it’s a strong, high-quality series that delivers a great experience from start to finish.", 
        rating: 7.6, 
        image: "../../../img/hp.avif", 
        category: "other",
        genre: "Action, Supernatural"
    },
    { 
        title: "The Rising of the Shield Hero", 
        author: "Aneko Yusagi", 
        release: "2019", 
        episodes: "62", 
        link: "https://www.crunchyroll.com/the-rising-of-the-shield-hero", 
        description: "The Rising of the Shield Hero is, in my opinion, the worst anime I have ever watched. I give it a 3.3/10 because I found the execution and the way the story handled its themes to be incredibly frustrating. It was a struggle to get through, and it simply didn't resonate with me at all, making it my least favorite experience in the medium so far.", 
        rating: 3.3, 
        image: "../../../img/the-rising-of-the-shield-hero.jpg", 
        category: "other",
        genre: "Fantasy, Isekai"
    },
    { 
        title: "Horimiya", 
        author: "HERO", 
        release: "2021", 
        episodes: "26", 
        link: "https://www.crunchyroll.com/horimiya", 
        description: "Horimiya is a sweet and refreshing take on the high school romance genre, focusing on the hidden sides of its main characters. While the animation and the chemistry between Hori and Miyamura are great, I give it a 6.8/10. It’s a pleasant and enjoyable watch, but for me, it didn't quite reach the same emotional heights or impact as some of my favorite series.", 
        rating: 6.8, 
        image: "../../../img/horimiya.webp", 
        category: "other",
        genre: "Romance, Slice of Life"
    },
    { 
        title: "Assasination Classroom", 
        author: "Yusei Matsui", 
        release: "2015", 
        episodes: "47", 
        link: "https://www.netflix.com/title/80045948", 
        description: "Assassination Classroom is a very unique and creative series that blends comedy with some surprisingly heartfelt moments. I give it a 6.5/10 because, while it’s an enjoyable and fun journey, it didn't fully blow me away compared to other top-tier shows. However, it is a fantastic choice for anime beginners as it's easy to follow and very entertaining.", 
        rating: 6.5, 
        image: "../../../img/assassination-classroom.webp", 
        category: "other",
        genre: "Comedy, Sci-Fi"
    },
    { 
        title: "Dr.Stone", 
        author: "Riichiro Inagaki",
        release: "2019", 
        episodes: "81", 
        link: "https://www.crunchyroll.com/dr-stone", 
        description: "Dr. Stone is a uniquely entertaining series that takes a very fun and creative premise and turns it into something incredibly gripping. I give it a 7.2/10 because the blend of scientific discovery and high-stakes strategy makes for a very exciting experience. While the concept is lighthearted and funny at times, the underlying tension and the race to rebuild civilization keep it consistently suspenseful.", 
        rating: 7.2, 
        image: "../../../img/DrStone.jpg", 
        category: "other",
        genre: "Sci-Fi, Adventure"
    },
    { 
        title: "The Eminence in Shadow", 
        author: "Daisuke Aizawa", 
        release: "2022", 
        episodes: "20", 
        link: "https://www.netflix.com/title/81642096", 
        description: "The Eminence in Shadow is absolute peak when it comes to its unique blend of dark fantasy and hilarious misunderstandings. I give it a 7.2/10 because the main character’s obsession with being a 'mastermind' is incredibly entertaining and well-executed. While the action and the irony are top-tier, it loses a few points for me due to the amount of fan service, but it remains a very strong and highly creative series.", 
        rating: 7.2, 
        image: "../../../img/eminence-in-the-shadow.jpg", 
        category: "other",
        genre: "Action, Fantasy"
    },
    { 
        title: "Bunny Girl Senpai", 
        author: "Hajime Kamoshida", 
        release: "2018", 
        episodes: "13", 
        link: "https://www.crunchyroll.com/bunny-girl-senpai", 
        description: "Bunny Girl Senpai is a beautifully written series that stands out because of the incredible and funny harmony between the two main characters. Their witty banter and deep emotional connection make every interaction a joy to watch. I give it a 7.5/10 because it’s a wonderful blend of supernatural mystery and heartfelt romance that feels very grounded despite its unusual premise.", 
        rating: 7.5, 
        image: "../../../img/bunny-girl-senpai.jpg", 
        category: "other",
        genre: "Romance, Supernatural"
    },
    { 
        title: "Blue Box", 
        author: "Kouji Miura", 
        release: "2024", 
        episodes: "25", 
        link: "https://www.netflix.com/title/81642096", 
        description: "Blue Box is a visually pleasing series that offers some truly beautiful and touching moments throughout its story. I give it a 6.3/10 because, while I appreciated the heartfelt scenes and the grounded romance, I found that it started to feel a bit boring at a certain point. It’s a solid watch for fans of the genre, but it didn't quite maintain its momentum for me personally.", 
        rating: 6.3, 
        image: "../../../img/bluebox.jpg", 
        category: "other",
        genre: "Romance, Sports"
    },
    { 
        title: "Dandadan", 
        author: "Yukinobu Tatsu", 
        release: "2024", 
        episodes: "24", 
        link: "https://www.crunchyroll.com/dan-da-dan", 
        description: "Dandadan is a wildly creative series with a very beautiful and unique story. I give it a 7.6/10 because the battle sequences are exceptionally well-executed and visually stunning. What really stands out, though, is the shy and awkward developing relationship between the main characters, which adds a lot of heart to the chaotic action. It’s a great mix of supernatural thrills and genuine emotion.", 
        rating: 7.6, 
        image: "../../../img/dandadan.jpg", 
        category: "other",
        genre: "Action, Supernatural"
    },
    { 
        title: "Charlotte", 
        author: "Jun Maeda", 
        release: "2015", 
        episodes: "13", 
        link: "https://www.crunchyroll.com/charlotte", 
        description: "Charlotte is a very special series to me because it was actually my very first anime. I give it a 6.5/10 because I think it is a perfect choice for beginners who are just starting to explore the medium. It has an engaging premise and emotional moments that are easy to follow. However, now that I have seen many more series, I feel it simply can't keep up with the top-tier masterpieces out there.", 
        rating: 6.5, 
        image: "../../../img/charlotte.jpg", 
        category: "other",
        genre: "Drama, Supernatural"
    },
    { 
        title: "The Last: Naruto the Movie", 
        author: "Masashi Kishimoto", 
        release: "2014", 
        episodes: "1", 
        link: "https://www.netflix.com/title/80037677", 
        description: "The Last: Naruto the Movie is an absolutely beautiful film that finally gives the fans the romance they’ve been waiting for. I give it an 7.5/10 because of how wonderfully it portrays the journey of Naruto and Hinata falling in love. Seeing them truly care for one another and watching their relationship deepen throughout the movie is incredibly heartwarming and a perfect conclusion to their long story.", 
        rating: 7.5, 
        image: "../../../img/Naruto-movie.avif", 
        category: "other",
        genre: "Romance, Action"
    },
    { 
        title: "A Couple of Cuckoos", 
        author: "Miki Yoshikawa", 
        release: "2020", 
        episodes: "36", 
        link: "https://www.crunchyroll.com/a-couple-of-cuckoos", 
        description: "A Couple of Cuckoos starts off with a fairly engaging first season that keeps you interested in the unique premise. However, I give it a 5.4/10 because one specific character, completely killed the vibe for me. while the beginning had some potential, the second season was a major disappointment and honestly felt like a total mess. It's a series that unfortunately lost its way and failed to deliver on its early momentum.",
        rating: 5.4, 
        image: "../../../img/cuckoos.avif", 
        category: "other",
        genre: "Romance"
    },
    { 
        title: "More than a Married Couple, but Not Lovers", 
        author: "Yūki Kanamaru", 
        release: "2022", 
        episodes: "12", 
        link: "https://www.crunchyroll.com/more-than-a-married-couple-but-not-lovers", 
        description: "More than a Married Couple, but Not Lovers is a decent watch that follows an interesting and colorful premise. I give it a 6.0/10 because, while it is okay overall, there were several things I didn't like about how the story and certain scenes were written. It has its moments, but the execution of the plot and some character decisions felt a bit off to me, preventing it from being a truly great series.",
        rating: 6.0, 
        image: "../../../img/married-couple.avif", 
        category: "other",
        genre: "Romance"
    }
];

    function updateStars(card, rating) {
        const starsContainer = card.querySelector('.stars');
        if (!starsContainer) return;

        const fillPercentage = Math.min(Math.max(rating * 10, 0), 100);

        starsContainer.innerHTML = `
            <div class="star-container">
                <div class="star-base">★★★★★</div>
                <div class="star-fill-wrapper" style="width: ${fillPercentage}%">★★★★★</div>
            </div>
        `;
    }


    function createMovieCard(movie, index, isTopRank = false, rank = null) {
        const card = document.createElement('button');
        card.className = 'movie-card';
        if (isTopRank) {
            card.classList.add('top-rank');
            if (rank === 1) card.classList.add('top-1');
            if (rank === 2) card.classList.add('top-2');
            if (rank === 3) card.classList.add('top-3');
        }
        

        card.setAttribute('data-tooltip', movie.title);
        card.setAttribute('data-author', movie.author);
        card.setAttribute('data-release', movie.release);
        card.setAttribute('data-episodes', movie.episodes);
        card.setAttribute('data-link', movie.link);
        card.setAttribute('data-description', movie.description);
        card.setAttribute('data-rating', movie.rating);
        card.setAttribute('data-image', movie.image);
        

        let rankBadge = '';
        if (rank) {
            let badgeClass = 'rank-badge';
            if (rank === 1) badgeClass += ' one-piece-badge';
            if (rank === 2) badgeClass += ' naruto-badge';
            if (rank === 3) badgeClass += ' HxH-badge';
            rankBadge = `<div class="${badgeClass}">#${rank}</div>`;
        }


        card.innerHTML = `
            ${rankBadge}
            <div class="movie-poster"><img src="${movie.image}" alt="${movie.title}"></div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-date">${movie.rating}/10</p>
                <div class="stars"></div>
            </div>
        `;


        updateStars(card, movie.rating);


        card.addEventListener('click', () => openPopup(movie));

        return card;
    }

    // ===== POPUP =====
    const readMoreBtn = document.getElementById('read-more-btn');
    const popupDesc = document.getElementById('popup-desc');

    function openPopup(movie) {
        const popup = document.getElementById('movie-popup');
        document.getElementById('popup-img').src = movie.image;
        document.getElementById('popup-title').textContent = movie.title;
        
        popupDesc.textContent = movie.description || "No description available.";
        popupDesc.classList.remove('expanded');
        readMoreBtn.textContent = "more";
        
        readMoreBtn.style.display = (movie.description && movie.description.length > 0) ? "inline-block" : "none";

        document.getElementById('popup-link').href = movie.link;


        const starsContainer = document.getElementById('popup-stars');
        const fillPercentage = Math.min(Math.max(movie.rating * 10, 0), 100);
        starsContainer.innerHTML = `
            <div class="star-container">
                <div class="star-base">★★★★★</div>
                <div class="star-fill-wrapper" style="width: ${fillPercentage}%">★★★★★</div>
            </div>
        `;


        document.getElementById('popup-meta').innerHTML = `
            <span><strong>Author:</strong> ${movie.author}</span>
            <span><strong>Episodes:</strong> ${movie.episodes}</span>
            <span><strong>Release:</strong> ${movie.release}</span>
        `;

        popup.classList.add('active');
    }

    readMoreBtn.addEventListener('click', () => {
        const isExpanded = popupDesc.classList.toggle('expanded');
        readMoreBtn.textContent = isExpanded ? "less" : "more";
    });


    function renderMovies() {
        const sortedMovies = [...movieDatabase].sort((a, b) => b.rating - a.rating);
        const top10Movies = sortedMovies.slice(0, 10);
        const otherMovies = sortedMovies.slice(10).sort((a, b) => a.title.localeCompare(b.title));

        const top10Container = document.querySelector('#top-10 .movie-carousel');
        if (top10Container) {
            top10Container.innerHTML = '';
            top10Movies.forEach((movie, index) => {
                const card = createMovieCard(movie, index, true, index + 1);
                top10Container.appendChild(card);
            });
        }

        const allMoviesGrid = document.querySelector('#all-movies .movie-grid');
        if (allMoviesGrid) {
            allMoviesGrid.innerHTML = '';
            otherMovies.forEach((movie, index) => {
                const card = createMovieCard(movie, index, false);
                allMoviesGrid.appendChild(card);
            });
        }
    }


    const popup = document.getElementById('movie-popup');
    const closePopup = document.querySelector('.close-popup');

    closePopup.addEventListener('click', () => {
        popup.classList.remove('active');
    });

    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('active');
        }
    });

    // ===== SEARCH FUNCTION =====
    const searchInput = document.getElementById('movie-search-input');
    const searchBtn = document.getElementById('movie-search-btn');
    const suggestionsBox = document.getElementById('search-suggestions');
    let currentFocus = -1;

    const movieTitles = movieDatabase.map(m => m.title);

    function performSearch(val) {
        const query = (val || searchInput.value).toLowerCase().trim();
        if (query === "" || query === "#") return;

        const allCards = document.querySelectorAll('.movie-card');
        let found = false;

        allCards.forEach(card => {
            const title = card.querySelector('.movie-title').textContent.toLowerCase();
            if (title.includes(query)) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.classList.add('highlight-card');
                setTimeout(() => card.classList.remove('highlight-card'), 2500);
                found = true;
            }
        });

        if (!found) {
            searchInput.placeholder = "Not found...";
            setTimeout(() => searchInput.placeholder = "Search Anime or Series...", 2000);
        }

        suggestionsBox.style.display = 'none';
        currentFocus = -1;
    }

    function updateSuggestions(list) {
        suggestionsBox.innerHTML = '';
        if (list.length > 0) {
            list.forEach(title => {
                const div = document.createElement('div');
                div.classList.add('suggestion-item');
                div.textContent = title;
                div.addEventListener('click', () => {
                    searchInput.value = title;
                    performSearch(title);
                });
                suggestionsBox.appendChild(div);
            });
            suggestionsBox.style.display = 'block';
        } else {
            suggestionsBox.style.display = 'none';
        }
    }

    searchInput.addEventListener('input', () => {
        const value = searchInput.value.trim();
        currentFocus = -1;

        if (value === "#") {
            updateSuggestions(movieTitles);
        } else if (value.length > 0) {
            const filtered = movieTitles.filter(title => 
                title.toLowerCase().includes(value.toLowerCase())
            );
            updateSuggestions(filtered);
        } else {
            suggestionsBox.style.display = 'none';
        }
    });

    searchInput.addEventListener('keydown', (e) => {
        let items = suggestionsBox.querySelectorAll('.suggestion-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (suggestionsBox.style.display === 'block') {
                currentFocus++;
                addActive(items);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (suggestionsBox.style.display === 'block') {
                currentFocus--;
                addActive(items);
            }
        } else if (e.key === 'Tab') {
            if (suggestionsBox.style.display === 'block' && items.length > 0) {
                e.preventDefault();
                if (e.shiftKey) {
                    currentFocus--;
                } else {
                    currentFocus++;
                }
                addActive(items);
            }
        } else if (e.key === 'Enter') {
            if (currentFocus > -1 && items[currentFocus]) {
                items[currentFocus].click();
            } else {
                performSearch();
            }
        }
    });

    function addActive(items) {
        if (!items.length) return;
        removeActive(items);
        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = items.length - 1;
        items[currentFocus].classList.add('selected');
        items[currentFocus].scrollIntoView({ block: 'nearest' });
    }

    function removeActive(items) {
        items.forEach(item => item.classList.remove('selected'));
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.movie-search-bar')) {
            suggestionsBox.style.display = 'none';
            currentFocus = -1;
        }
    });

    searchBtn.addEventListener('click', () => performSearch());

    // ===== CAROUSEL =====
    const carouselContainers = document.querySelectorAll('.section-center');

    carouselContainers.forEach(container => {
        const carousel = container.querySelector('.carousel-wrapper');
        const progressBar = container.querySelector('.carousel-progress-bar');

        if (carousel && progressBar) {
            carousel.addEventListener('scroll', () => {
                const scrollLeft = carousel.scrollLeft;
                const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
                const progress = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
                progressBar.style.width = progress + '%';
            });

            carousel.addEventListener('wheel', (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    carousel.scrollLeft += (e.deltaY * 3);
                }
            }, { passive: false });

            // Drag to scroll
            let isDown = false;
            let startX;
            let scrollLeftPos;

            carousel.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - carousel.offsetLeft;
                scrollLeftPos = carousel.scrollLeft;
                carousel.style.scrollSnapType = 'none';
            });

            carousel.addEventListener('mouseleave', () => {
                isDown = false;
                carousel.style.scrollSnapType = 'x mandatory';
            });

            carousel.addEventListener('mouseup', () => {
                isDown = false;
                carousel.style.scrollSnapType = 'x mandatory';
            });

            carousel.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - carousel.offsetLeft;
                const walk = (x - startX) * 2;
                carousel.scrollLeft = scrollLeftPos - walk;
            });
        }
    });

    // ===== RENDER MOVIES (endlich!) =====
    renderMovies();
});