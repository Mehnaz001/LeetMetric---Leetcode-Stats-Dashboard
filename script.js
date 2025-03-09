document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.querySelector("#search-button");
    const userInput = document.querySelector("#user-input");
    const statContainer = document.querySelector(".stats");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.querySelector("#easy-label");
    const mediumLabel = document.querySelector("#medium-label");
    const hardLabel = document.querySelector("#hard-label");
    const statsCard = document.querySelector(".stats-card")

    function updateProgress(solved,total,label,circle) {
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent = `${solved}/${total}`
    }

    function displayUserData(parsedData) {
        const totalQues = parsedData.totalQuestions;
        const totalEasy = parsedData.totalEasy;
        const totalMedium = parsedData.totalMedium;
        const totalHard = parsedData.totalHard;

        const totalSolved = parsedData.totalSolved;
        const easySolved = parsedData.easySolved;
        const mediumSolved = parsedData.mediumSolved;
        const hardSolved = parsedData.hardSolved;

        console.log("Total Questions:",totalQues); 
        console.log("Total Solved :",totalSolved);

        updateProgress(easySolved, totalEasy, easyLabel, easyProgressCircle);
        updateProgress(mediumSolved, totalMedium, mediumLabel, mediumProgressCircle);
        updateProgress(hardSolved, totalHard, hardLabel, hardProgressCircle);

        const cardsData = [
            {label:"Acceptance Rate",value:parsedData.acceptanceRate},
            {label:"Contribution points",value:parsedData.contributionPoints},
            {label:"Overall Ranking",value:parsedData.ranking},
            {label:"Total Problem Solved",value:parsedData.totalSolved},
        ];
        console.log("Cards Data:",cardsData);

        statsCard.innerHTML = cardsData.map(
            data => {
                return `<div class="card">
                <h3>${data.label}</h3>
                <p>${data.value}</p> </div>`
            }
        ).join("");
    }


    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            statContainer.classList.remove("hidden");
            const response = await fetch(url);
            if(!response.ok) {
                throw new Error("Unable to fetch user details");
            }
            const parsedData = await response.json();
            console.log("Logging data", parsedData);

            displayUserData(parsedData);
        }
        catch(error) {
            statContainer.innerHTML = "<p> No Data Found";
        }
        finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    //Return true or false based on regex
    function validateUsername(username) {
        if(username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }
    
    searchButton.addEventListener("click", function() {
        const username = userInput.value;
        console.log(username);

        //if username is valid then we will fetch user details
        if(validateUsername(username)) {
            fetchUserDetails(username);
        }
    })
})
