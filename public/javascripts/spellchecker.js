const vowels = new Set(['a', 'e', 'i', 'o', 'u']);

function checkVowelConsonant(char1, char2) {
    if (char1 === char2) return 0;
    if (vowels.has(char1) && vowels.has(char2)) return 1;
    if (!vowels.has(char1) && !vowels.has(char2)) return 1;
    return 3;
}

function calculatePenalty(word1, word2) {
    const n = word1.length;
    const m = word2.length;
    const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

    for (let i = 0; i <= n; i++) {
        dp[i][0] = i * 2;
    }

    for (let j = 0; j <= m; j++){
        dp[0][j] = j * 2;
    }

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            const match = dp[i - 1][j - 1] + checkVowelConsonant(word1[i - 1], word2[j - 1]);
            const deleteChar = dp[i - 1][j] + 2;
            const insertChar = dp[i][j - 1] + 2;
            dp[i][j] = Math.min(match, deleteChar, insertChar);
        }
    }
    return dp[n][m];
}

async function getSuggestions(inputWord, dictionary) {
    const scores = dictionary.map(word => ({
        word,
        score: calculatePenalty(inputWord, word)
    }));

    scores.sort((a, b) => a.score - b.score);
    return scores.slice(0, 10);
}

document.addEventListener('DOMContentLoaded', () => {
    let input = document.querySelector('#inputWord');
    let button = document.querySelector('#checkButton');
    let suggestionsList = document.querySelector('#suggestions');

    button.addEventListener('click', async () => {
        let inputWord = input.value.toLowerCase();
        let dictionary = await fetch('../data/dictionary.txt').then(res => res.text()).then(text => text.split('\n'));
        let suggestions = await getSuggestions(inputWord, dictionary);
        suggestionsList.innerHTML = suggestions.map(entry => `<li>${entry.word} <span>(penalty: ${entry.score})</span></li>`).join('');
    });
});
