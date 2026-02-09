
async function fetchData() {
    try {

        const wordInput = document.getElementById('wordInput').value;
        const outputElement = document.getElementById('output');
        outputElement.textContent = `${wordInput} is a valid word!`;
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordInput}`);

        if (!response.ok) {
            console.log(`${wordInput} is not a valid word!`);
            outputElement.textContent = `${wordInput} is not a valid word!`;
            throw new Error('Network response was not ok ' + response.statusText);
        }else{
        const data = await response.json();
        outputElement.textContent = `${wordInput} is a valid word!`;
        }
   
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

/*
fetch("https://api.dictionaryapi.dev/api/v2/entries/en/hello")
    .then(response => {
        
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
*/