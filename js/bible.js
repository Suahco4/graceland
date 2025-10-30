(function($) {
    "use strict";

    const ssBibleReader = function() {
        const form = document.getElementById('bible-search-form');
        if (!form) return;

        const bookInput = document.getElementById('bible-book');
        const chapterInput = document.getElementById('bible-chapter');
        const verseInput = document.getElementById('bible-verse');
        const translationSelect = document.getElementById('bible-translation-select');
        const randomVerseButton = document.getElementById('bible-random-verse');
        
        const resultContainer = document.getElementById('bible-result');
        const display = document.getElementById('bible-display');
        const loading = document.getElementById('bible-loading');
        const error = document.getElementById('bible-error');

        const referenceEl = document.getElementById('bible-reference');
        const textEl = document.getElementById('bible-text');
        const translationDisplayEl = document.getElementById('bible-translation-display');
        const copyButton = document.getElementById('bible-copy-verse');

        // List of Bible books with chapter counts for random selection
        const bibleBooks = [
            { name: "Genesis", chapters: 50 }, { name: "Exodus", chapters: 40 }, { name: "Leviticus", chapters: 27 },
            { name: "Numbers", chapters: 36 }, { name: "Deuteronomy", chapters: 34 }, { name: "Joshua", chapters: 24 },
            { name: "Judges", chapters: 21 }, { name: "Ruth", chapters: 4 }, { name: "1 Samuel", chapters: 31 },
            { name: "2 Samuel", chapters: 24 }, { name: "1 Kings", chapters: 22 }, { name: "2 Kings", chapters: 25 },
            { name: "1 Chronicles", chapters: 29 }, { name: "2 Chronicles", chapters: 36 }, { name: "Ezra", chapters: 10 },
            { name: "Nehemiah", chapters: 13 }, { name: "Esther", chapters: 10 }, { name: "Job", chapters: 42 },
            { name: "Psalms", chapters: 150 }, { name: "Proverbs", chapters: 31 }, { name: "Ecclesiastes", chapters: 12 },
            { name: "Song of Solomon", chapters: 8 }, { name: "Isaiah", chapters: 66 }, { name: "Jeremiah", chapters: 52 },
            { name: "Lamentations", chapters: 5 }, { name: "Ezekiel", chapters: 48 }, { name: "Daniel", chapters: 12 },
            { name: "Hosea", chapters: 14 }, { name: "Joel", chapters: 3 }, { name: "Amos", chapters: 9 },
            { name: "Obadiah", chapters: 1 }, { name: "Jonah", chapters: 4 }, { name: "Micah", chapters: 7 },
            { name: "Nahum", chapters: 3 }, { name: "Habakkuk", chapters: 3 }, { name: "Zephaniah", chapters: 3 },
            { name: "Haggai", chapters: 2 }, { name: "Zechariah", chapters: 14 }, { name: "Malachi", chapters: 4 },
            { name: "Matthew", chapters: 28 }, { name: "Mark", chapters: 16 }, { name: "Luke", chapters: 24 },
            { name: "John", chapters: 21 }, { name: "Acts", chapters: 28 }, { name: "Romans", chapters: 16 },
            { name: "1 Corinthians", chapters: 16 }, { name: "2 Corinthians", chapters: 13 }, { name: "Galatians", chapters: 6 },
            { name: "Ephesians", chapters: 6 }, { name: "Philippians", chapters: 4 }, { name: "Colossians", chapters: 4 },
            { name: "1 Thessalonians", chapters: 5 }, { name: "2 Thessalonians", chapters: 3 }, { name: "1 Timothy", chapters: 6 },
            { name: "2 Timothy", chapters: 4 }, { name: "Titus", chapters: 3 }, { name: "Philemon", chapters: 1 },
            { name: "Hebrews", chapters: 13 }, { name: "James", chapters: 5 }, { name: "1 Peter", chapters: 5 },
            { name: "2 Peter", chapters: 3 }, { name: "1 John", chapters: 5 }, { name: "2 John", chapters: 1 },
            { name: "3 John", chapters: 1 }, { name: "Jude", chapters: 1 }, { name: "Revelation", chapters: 22 }
        ];

        // Function to fetch a random verse
        function fetchRandomVerse() {
            // Clear previous inputs
            bookInput.value = '';
            chapterInput.value = '';
            verseInput.value = '';

            loading.classList.remove('is-hidden');
            display.classList.add('is-hidden');
            error.classList.add('is-hidden');
            resultContainer.classList.remove('is-hidden');

            const randomBookIndex = Math.floor(Math.random() * bibleBooks.length);
            const randomBook = bibleBooks[randomBookIndex];
            const randomChapter = Math.floor(Math.random() * randomBook.chapters) + 1;

            const translation = translationSelect.value;
            const query = `${randomBook.name} ${randomChapter}`;

            fetch(`https://bible-api.com/${encodeURIComponent(query)}?translation=${translation}`)
                .then(response => response.json())
                .then(data => {
                    loading.classList.add('is-hidden');
                    if (data.error || !data.verses || data.verses.length === 0) {
                        error.textContent = `Could not find a random verse for "${query}". Trying again...`;
                        error.classList.remove('is-hidden');
                        // Optionally, retry fetching a random verse if the first attempt fails
                        setTimeout(fetchRandomVerse, 1000); 
                    } else {
                        const randomVerseIndex = Math.floor(Math.random() * data.verses.length);
                        const selectedVerse = data.verses[randomVerseIndex];

                        referenceEl.textContent = `${selectedVerse.book_name} ${selectedVerse.chapter}:${selectedVerse.verse}`;
                        textEl.textContent = selectedVerse.text.replace(/\n/g, ' ');
                        translationDisplayEl.textContent = `Translation: ${data.translation_name}`;
                        display.classList.remove('is-hidden');
                    }
                })
                .catch(err => {
                    loading.classList.add('is-hidden');
                    error.textContent = 'Failed to fetch a random verse. Please try again later.';
                    error.classList.remove('is-hidden');
                    console.error('Error fetching random verse:', err);
                });
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const book = bookInput.value.trim();
            const chapter = chapterInput.value.trim();
            const verse = verseInput.value.trim();
            const translation = translationSelect.value;

            if (!book || !chapter) {
                error.textContent = 'Please provide a book and chapter.';
                error.classList.remove('is-hidden');
                return;
            }

            let query = `${book} ${chapter}`;
            if (verse) {
                query += `:${verse}`;
            }

            loading.classList.remove('is-hidden');
            display.classList.add('is-hidden');
            error.classList.add('is-hidden');
            resultContainer.classList.remove('is-hidden');

            fetch(`https://bible-api.com/${encodeURIComponent(query)}?translation=${translation}`)
                .then(response => response.json())
                .then(data => {
                    loading.classList.add('is-hidden');
                    if (data.error) {
                        error.textContent = `Could not find "${query}". Please check your spelling and try again.`;
                        error.classList.remove('is-hidden');
                    } else {
                        referenceEl.textContent = data.reference;
                        textEl.textContent = data.text.replace(/\n/g, ' '); // Clean up newlines
                        translationDisplayEl.textContent = `Translation: ${data.translation_name}`;
                        display.classList.remove('is-hidden');
                    }
                });
        });

        if (copyButton) {
            copyButton.addEventListener('click', function() {
                const verseText = textEl.textContent;
                const verseReference = referenceEl.textContent;
                const textToCopy = `"${verseText}" - ${verseReference}`;

                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Success feedback
                    const originalText = copyButton.textContent;
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = originalText;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });
        }

        if (randomVerseButton) {
            randomVerseButton.addEventListener('click', fetchRandomVerse);
        }
    };

    ssBibleReader();

})(jQuery);