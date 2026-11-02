/**
 * CODE COMMENT EXPLAINING SERIALIZATION REQUIREMENT:
 * 
 * 1. Why request objects need JSON.stringify():
 *    JavaScript runtime entities exist natively within system memory heaps as objects or reference nodes. 
 *    Network transmission over HTTP transport wires requires serialization into standard plaintext string streams format (JSON).
 *    JSON.stringify() converts native memory structures into compliant payload byte-streams.
 * 
 * 2. Why an appropriate Content-Type header is required:
 *    The 'Content-Type: application/json' header informs destination receiving APIs precisely how to parse incoming data.
 *    Without this standard structural indicator metadata declaration, backend servers might evaluate the stream as undefined plaintext, 
 *    failing to route or deserialize properties successfully into backend properties.
 */

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';
const terminal = document.getElementById('terminal');

// Reusable fetch execution abstractions helper wrapper
async function requestHelper(url, method = 'GET', bodyData = null) {
    const configurations = {
        method: method,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    };

    if (bodyData && (method !== 'GET' && method !== 'HEAD')) {
        configurations.body = JSON.stringify(bodyData);
    }

    const response = await fetch(url, configurations);
    
    // Process delete gracefully since data body payload will be blank
    let parsedData = null;
    if (method !== 'DELETE') {
        parsedData = await response.json();
    }
    
    return {
        status: response.status,
        ok: response.ok,
        data: parsedData
    };
}

function logToTerminal(action, outcome) {
    const timestamp = new Date().toLocaleTimeString();
    const formattedLog = `\n[${timestamp}] === ${action} ===\nStatus Received: ${outcome.status}\nPayload Output:\n${JSON.stringify(outcome.data, null, 2)}\n---------------------------------------`;
    terminal.innerText += formattedLog;
    terminal.scrollTop = terminal.scrollHeight;
}

// POST Event Implementation
document.getElementById('announcement-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('announce-title').value;
    const userId = parseInt(document.getElementById('announce-uid').value);
    const body = document.getElementById('announce-content').value;

    try {
        const payload = { title, userId, body };
        const result = await requestHelper(BASE_URL, 'POST', payload);
        logToTerminal('POST REQUEST', result);
    } catch (err) {
        terminal.innerText += `\nPOST Pipeline caught error: ${err.message}`;
    }
});

// PUT Trigger Implementation
document.getElementById('put-trigger').addEventListener('click', async () => {
    try {
        const replacementPayload = {
            id: 1,
            userId: 99,
            title: "Overwritten Title Context via PUT",
            body: "Complete replacement structural payload content field required by specifications."
        };
        const result = await requestHelper(`${BASE_URL}/1`, 'PUT', replacementPayload);
        logToTerminal('PUT REQUEST (REPLACE)', result);
    } catch (err) {
        terminal.innerText += `\nPUT Pipeline caught error: ${err.message}`;
    }
});

// PATCH Trigger Implementation
document.getElementById('patch-trigger').addEventListener('click', async () => {
    try {
        const patchPayload = { title: "Targeted Title Mutation Delta (PATCH)" };
        const result = await requestHelper(`${BASE_URL}/1`, 'PATCH', patchPayload);
        logToTerminal('PATCH REQUEST (DELTA)', result);
    } catch (err) {
        terminal.innerText += `\nPATCH Pipeline caught error: ${err.message}`;
    }
});

// DELETE Trigger Implementation
document.getElementById('delete-trigger').addEventListener('click', async () => {
    try {
        const result = await requestHelper(`${BASE_URL}/1`, 'DELETE');
        result.data = { message: "Resource deletion successful. Entity erased from simulation." };
        logToTerminal('DELETE REQUEST', result);
    } catch (err) {
        terminal.innerText += `\nDELETE Pipeline caught error: ${err.message}`;
    }
});
