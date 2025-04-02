import handleSignInCallback from './handle-signin-callback';
import handleLlmRequest from './handle-llm-request';
import { getStripeCustomer } from '../lib/stripe';

handleLlmRequest();
handleSignInCallback();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openWebSelectPopup') {
        chrome.action.openPopup();
    }
    
    if (request.action === 'verifyStripeCustomer') {
        getStripeCustomer(request.email)
            .then(customer => sendResponse(customer))
            .catch(error => sendResponse({ error: error.message }));
        return true; // Required for async response
    }
});
