// Test script for JSONbin.io API
const JSONBIN_API_KEY = '$2a$10$XGwPbUeqH1q6l4qk9iwB0eeMYLhC3oZu9/oNvvHZtHAD212nVBY46';
const JSONBIN_BIN_ID = '67f159d98960c979a57ecc76';

// Function to test JSONbin.io API
async function testJSONbinAPI() {
    console.log('Testing JSONbin.io API...');
    console.log('API Key:', JSONBIN_API_KEY);
    console.log('Bin ID:', JSONBIN_BIN_ID);
    
    try {
        // Try to fetch data from JSONbin.io
        console.log('Fetching data from JSONbin.io...');
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });
        
        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);
        
        if (response.ok) {
            const result = await response.json();
            console.log('Response data:', result);
            
            if (result.record && result.record.messages) {
                console.log('Messages found:', result.record.messages);
                console.log('Number of messages:', result.record.messages.length);
            } else {
                console.log('No messages found in the response');
            }
        } else {
            console.error('Failed to fetch data from JSONbin.io');
        }
    } catch (error) {
        console.error('Error testing JSONbin.io API:', error);
    }
}

// Don't run automatically, wait for button click
document.addEventListener('DOMContentLoaded', () => {
    const runTestBtn = document.getElementById('runTest');
    if (runTestBtn) {
        runTestBtn.addEventListener('click', testJSONbinAPI);
    }
}); 