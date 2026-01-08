// ==========================================
// EMAIL WAITLIST FORM HANDLING
// ==========================================

const waitlistForm = document.getElementById('waitlist-form');
const emailInput = document.getElementById('email-input');
const submitBtn = document.getElementById('submit-btn');
const formMessage = document.getElementById('form-message');

// Check if redirected back with success parameter
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showMessage('🎉 Success! You\'re on the list. Check your email for confirmation.', 'success');
        // Remove success parameter from URL
        window.history.replaceState({}, document.title, window.location.pathname);

        // Track conversion
        trackEvent('waitlist_signup', { method: 'formsubmit' });
    }
});

// Note: Form now submits directly to FormSubmit.co
// The service will handle email delivery to xivi.tech@gmail.com
// and redirect back to the site with ?success=true parameter

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show loading state
function setLoading(loading) {
    if (loading) {
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        submitBtn.disabled = true;
        emailInput.disabled = true;
    } else {
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
        emailInput.disabled = false;
    }
}

// Show form message
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';

    // Auto-hide error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// Simulate API call (replace with real implementation)
function simulateAPICall(email) {
    return new Promise((resolve) => {
        // Simulate 1.5 second API delay
        setTimeout(() => {
            console.log('Email submitted:', email);
            // Store in localStorage as a fallback (not for production)
            const waitlist = JSON.parse(localStorage.getItem('waitlist') || '[]');
            waitlist.push({ email, timestamp: new Date().toISOString() });
            localStorage.setItem('waitlist', JSON.stringify(waitlist));
            resolve();
        }, 1500);
    });
}

// Update waitlist count (social proof)
function updateWaitlistCount() {
    const countElement = document.getElementById('waitlist-count');
    if (countElement) {
        const currentText = countElement.textContent;
        const match = currentText.match(/(\d+)\+/);
        if (match) {
            const currentCount = parseInt(match[1]);
            const newCount = currentCount + 1;
            countElement.textContent = `Join ${newCount}+ innovators on our waitlist`;
        }
    }
}

// ==========================================
// SOCIAL SHARING FUNCTIONALITY
// ==========================================

const shareButtons = document.querySelectorAll('.share-btn');

shareButtons.forEach(button => {
    button.addEventListener('click', () => {
        const platform = button.dataset.platform;
        shareOnPlatform(platform);

        // Track share event
        trackEvent('social_share', { platform });
    });
});

function shareOnPlatform(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out XIVI - Deep Tech Innovation Coming Soon! 🚀');

    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`
    };

    // Try native share API first (mobile support)
    if (navigator.share && platform === 'native') {
        navigator.share({
            title: 'XIVI - Deep Tech Innovation',
            text: 'Check out XIVI - Deep Tech Innovation Coming Soon! 🚀',
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else if (shareUrls[platform]) {
        // Fallback to opening share URL in new window
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// ==========================================
// ANALYTICS TRACKING
// ==========================================

function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4 tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }

    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
        fbq('trackCustom', eventName, eventData);
    }

    // Console log for development
    console.log('Event tracked:', eventName, eventData);
}

// Track page view on load
document.addEventListener('DOMContentLoaded', () => {
    trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
});

// ==========================================
// SMOOTH SCROLLING (if adding more sections later)
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// PREVENT ZOOM ON MOBILE INPUT FOCUS (iOS)
// ==========================================

if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1';
    }
}
