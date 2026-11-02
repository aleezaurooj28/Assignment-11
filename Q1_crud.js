const ENDPOINT = 'https://jsonplaceholder.typicode.com/posts';
let localStore = [];

// DOM Element Registry Queries
const containerEl = document.getElementById('posts-grid-container');
const loadingEl = document.getElementById('loading-spinner');
const addForm = document.getElementById('add-post-form');
const statusBox = document.getElementById('status-container');
const reloadBtn = document.getElementById('btn-reload');

// Log messaging system alerts helper
function displayMessage(text, isSuccess) {
    statusBox.innerText = text;
    statusBox.className = `status-box ${isSuccess ? 'success' : 'error'}`;
    setTimeout(() => { statusBox.className = 'status-box'; }, 4000);
}

// Generate layout cards dynamically mapping from memory reference array 
function renderInterfaceView() {
    containerEl.innerHTML = '';
    if (localStore.length === 0) {
        containerEl.innerHTML = '<p class="loading-state">No entries exist in current system state view.</p>';
        return;
    }
    
    localStore.forEach(entry => {
        const card = document.createElement('article');
        card.className = 'post-card';
        card.innerHTML = `
            <div>
                <span class="post-badge">Post ID: ${entry.id} • User: ${entry.userId}</span>
                <h3 class="post-title">${entry.title}</h3>
                <p class="post-body">${entry.body}</p>
            </div>
            <div class="card-actions">
                <button class="btn-put" onclick="triggerPut(${entry.id})">PUT (Full)</button>
                <button class="btn-patch" onclick="triggerPatch(${entry.id})">PATCH (Field)</button>
                <button class="btn-delete" onclick="triggerDelete(${entry.id})">DELETE</button>
            </div>
        `;
        containerEl.appendChild(card);
    });
}

// [GET] Load Primary First Six Entities Pipelines
async function fetchSystemPosts() {
    loadingEl.style.display = 'block';
    containerEl.innerHTML = '';
    
    try {
        const response = await fetch(`${ENDPOINT}?_limit=6`);
        console.log(`[GET] Response Status Code: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`Server returned error execution state: ${response.status}`);
        }
        
        localStore = await response.json();
        renderInterfaceView();
        displayMessage(`Successfully pulled database records. Status: ${response.status}`, true);
    } catch (error) {
        console.error('Fetch caught pipeline initialization exceptions:', error);
        displayMessage(`GET Request failure connection fault: ${error.message}`, false);
    } finally {
        loadingEl.style.display = 'none';
    }
}

// [POST] Create New Records Announcement
addForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const inputTitle = document.getElementById('post-title').value;
    const inputUid = parseInt(document.getElementById('post-userid').value, 10);
    const inputBody = document.getElementById('post-body').value;
    
    try {
        const requestPayload = { title: inputTitle, body: inputBody, userId: inputUid };
        
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify(requestPayload)
        });
        console.log(`[POST] Response Status Code: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`Failed record initialization pipeline state: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        // Handle mock increment values locally for consistency
        responseData.id = localStore.length ? Math.max(...localStore.map(p => p.id)) + 1 : 1;
        
        localStore.unshift(responseData);
        renderInterfaceView();
        addForm.reset();
        displayMessage(`Post initialized! Assigned mock ID ${responseData.id} (Status ${response.status})`, true);
    } catch (error) {
        console.error(error);
        displayMessage(`POST workflow caught an error: ${error.message}`, false);
    }
});

// [PUT] Modify Complete Node Properties Configuration Context
async function triggerPut(targetId) {
    const updatedTitle = prompt("Update Title Context:");
    const updatedBody = prompt("Update Content Text Area Context:");
    if (!updatedTitle || !updatedBody) return;
    
    // Safety check bypass mapping value translation to 1 if simulated mock ID doesn't exist on server
    const lookupId = targetId > 100 ? 1 : targetId;
    
    try {
        const updatePayload = { id: targetId, title: updatedTitle, body: updatedBody, userId: 1 };
        
        const response = await fetch(`${ENDPOINT}/${lookupId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify(updatePayload)
        });
        console.log(`[PUT] Response Status Code: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`Full update target index assignment invalid status: ${response.status}`);
        }
        
        const matchIndex = localStore.findIndex(item => item.id === targetId);
        if (matchIndex !== -1) {
            localStore[matchIndex] = { ...localStore[matchIndex], title: updatedTitle, body: updatedBody };
            renderInterfaceView();
        }
        displayMessage(`PUT complete on Record #${targetId}. Status: ${response.status}`, true);
    } catch (error) {
        console.error(error);
        displayMessage(`PUT request operation caught exception error: ${error.message}`, false);
    }
}

// [PATCH] Partial Record Modification Pipeline Execution
async function triggerPatch(targetId) {
    const segmentedTitle = prompt("Modify item title via delta PATCH modification branch:");
    if (!segmentedTitle) return;
    
    const lookupId = targetId > 100 ? 1 : targetId;
    
    try {
        const patchPayload = { title: segmentedTitle };
        
        const response = await fetch(`${ENDPOINT}/${lookupId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify(patchPayload)
        });
        console.log(`[PATCH] Response Status Code: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`Delta patch mutation target exception status code response: ${response.status}`);
        }
        
        const matchIndex = localStore.findIndex(item => item.id === targetId);
        if (matchIndex !== -1) {
            localStore[matchIndex].title = segmentedTitle;
            renderInterfaceView();
        }
        displayMessage(`PATCH complete on Record #${targetId}. Status: ${response.status}`, true);
    } catch (error) {
        console.error(error);
        displayMessage(`PATCH compilation engine caught exception error: ${error.message}`, false);
    }
}

// [DELETE] Record Purging Execution Routine Pipeline
async function triggerDelete(targetId) {
    if (!confirm(`Confirm complete wipe execution context sequence for Post Card ID: #${targetId}?`)) return;
    
    const lookupId = targetId > 100 ? 1 : targetId;
    
    try {
        const response = await fetch(`${ENDPOINT}/${lookupId}`, { method: 'DELETE' });
        console.log(`[DELETE] Response Status Code: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`Erasure processing target execution index fault: ${response.status}`);
        }
        
        localStore = localStore.filter(item => item.id !== targetId);
        renderInterfaceView();
        displayMessage(`DELETE complete on Record #${targetId}. Status: ${response.status}`, true);
    } catch (error) {
        console.error(error);
        displayMessage(`DELETE routine operational request failure state error: ${error.message}`, false);
    }
}

// Application Lifecycle Event Listeners
reloadBtn.addEventListener('click', fetchSystemPosts);
window.addEventListener('DOMContentLoaded', fetchSystemPosts);
