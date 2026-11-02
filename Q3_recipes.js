// async/await runtime orchestration handling
const statusBar = document.getElementById('status-bar');
const loadingMsg = document.getElementById('loading-msg');
const errorBox = document.getElementById('error-box');
const container = document.getElementById('recipes-container');

async function fetchRecipes() {
    try {
        const response = await fetch('https://dummyjson.com/recipes');
        statusBar.innerText = `HTTP Status: ${response.status}`;
        
        if (!response.ok) {
            throw new Error(`Culinary remote server failure returned state code ${response.status}`);
        }

        const data = await response.json();
        loadingMsg.style.display = 'none';
        
        // Output minimum of six items
        data.recipes.slice(0, 6).forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            
            card.innerHTML = `
                <img src="${recipe.image || 'https://placeholder.com'}" class="recipe-img" alt="${recipe.name}">
                <div class="recipe-content">
                    <span class="recipe-cuisine">${recipe.cuisine}</span>
                    <h3 class="recipe-name">${recipe.name}</h3>
                    <div class="recipe-time">⏱ Prep Time: ${recipe.prepTimeMinutes || 'N/A'} mins</div>
                    
                    <button class="details-btn">View Ingredients</button>
                    
                    <div class="ingredients-list">
                        <h4>Ingredients Checklist</h4>
                        <ul>
                            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;

            // Toggle view visibility scope functionality context
            const btn = card.querySelector('.details-btn');
            const list = card.querySelector('.ingredients-list');
            btn.addEventListener('click', () => {
                const isOpen = list.classList.toggle('visible');
                btn.innerText = isOpen ? 'Hide Ingredients' : 'View Ingredients';
            });

            container.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        loadingMsg.style.display = 'none';
        errorBox.innerText = `Error: ${error.message}. Please try again later.`;
        errorBox.style.display = 'block';
    }
}

window.addEventListener('DOMContentLoaded', fetchRecipes);
