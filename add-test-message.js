// Script to add a test message to JSONbin.io
const JSONBIN_API_KEY = '$2a$10$XGwPbUeqH1q6l4qk9iwB0eeMYLhC3oZu9/oNvvHZtHAD212nVBY46';
const JSONBIN_BIN_ID = '67f159d98960c979a57ecc76';

// Function to add a test message to JSONbin.io
async function addTestMessage() {
    console.log('Adding test message to JSONbin.io...');
    
    // Create a test message
    const testMessage = {
        id: Date.now().toString(),
        name: "Test User",
        email: "test@example.com",
        message: "This is a test message added manually",
        timestamp: new Date().toISOString()
    };
    
    console.log('Test message:', testMessage);
    
    try {
        // First, get existing messages
        console.log('Fetching existing messages from JSONbin.io...');
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
            method: 'GET',
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            console.error('Failed to fetch existing messages:', response.status, response.statusText);
            return;
        }
        
        const result = await response.json();
        console.log('Existing data:', result);
        
        // Get existing messages or create an empty array
        let messages = [];
        if (result.record && result.record.messages) {
            messages = result.record.messages;
            console.log('Existing messages:', messages);
        } else {
            console.log('No existing messages found, creating new array');
        }
        
        // Add the test message
        messages.push(testMessage);
        console.log('Updated messages:', messages);
        
        // Update JSONbin.io with the new messages
        console.log('Updating JSONbin.io...');
        const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify({ messages })
        });
        
        console.log('Update response status:', updateResponse.status);
        
        if (updateResponse.ok) {
            console.log('Successfully added test message to JSONbin.io');
        } else {
            console.error('Failed to update JSONbin.io:', updateResponse.status, updateResponse.statusText);
        }
    } catch (error) {
        console.error('Error adding test message:', error);
    }
}

// Run the function
addTestMessage(); 