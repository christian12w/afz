/**
 * Donation Form JavaScript
 * Handles donation form interactions, validation, and submission
 */

(function() {
    'use strict';

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDonationForm);
    } else {
        initializeDonationForm();
    }

    function initializeDonationForm() {
        // Get form elements
        const form = document.getElementById('donationForm');
        const amountButtons = document.querySelectorAll('.amount-btn');
        const customAmountInput = document.querySelector('.custom-amount-input');
        const customAmountField = document.getElementById('customAmount');
        
        if (!form) return; // Exit if form not found

        // Setup amount button interactions
        setupAmountButtons();
        
        // Setup form validation
        setupFormValidation();
        
        // Setup form submission
        form.addEventListener('submit', handleFormSubmission);
    }

    function setupAmountButtons() {
        const amountButtons = document.querySelectorAll('.amount-btn');
        const customAmountInput = document.querySelector('.custom-amount-input');
        const customAmountField = document.getElementById('customAmount');

        amountButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all buttons
                amountButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const amount = this.dataset.amount;
                
                if (amount === 'custom') {
                    // Show custom amount input
                    customAmountInput.style.display = 'block';
                    customAmountField.focus();
                    customAmountField.required = true;
                } else {
                    // Hide custom amount input
                    customAmountInput.style.display = 'none';
                    customAmountField.required = false;
                    customAmountField.value = '';
                }
            });
        });

        // Handle custom amount input
        if (customAmountField) {
            customAmountField.addEventListener('input', function() {
                if (this.value) {
                    // Remove active class from preset amount buttons
                    amountButtons.forEach(btn => {
                        if (btn.dataset.amount !== 'custom') {
                            btn.classList.remove('active');
                        }
                    });
                }
            });
        }
    }

    function setupFormValidation() {
        const form = document.getElementById('donationForm');
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // Clear error message when user starts typing
                clearFieldError(this);
            });
        });
    }

    function validateField(field) {
        const errorElement = document.getElementById(field.id + '-error');
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        clearFieldError(field);

        // Check if field is required and empty
        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = getFieldName(field) + ' is required.';
        } else if (field.value.trim()) {
            // Field has value, validate specific types
            switch (field.type) {
                case 'email':
                    if (!isValidEmail(field.value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address.';
                    }
                    break;
                case 'tel':
                    if (!isValidPhone(field.value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number.';
                    }
                    break;
                case 'number':
                    const numValue = parseFloat(field.value);
                    const min = parseFloat(field.getAttribute('min')) || 0;
                    const max = parseFloat(field.getAttribute('max')) || Infinity;
                    
                    if (isNaN(numValue) || numValue < min || numValue > max) {
                        isValid = false;
                        errorMessage = `Please enter a valid amount between ${min} and ${max}.`;
                    }
                    break;
            }
        }

        if (!isValid && errorElement) {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
        }

        return isValid;
    }

    function clearFieldError(field) {
        const errorElement = document.getElementById(field.id + '-error');
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    function getFieldName(field) {
        const label = document.querySelector('label[for="' + field.id + '"]');
        return label ? label.textContent.replace('*', '').trim() : field.name || field.id;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        // Allow various phone formats including international
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    function handleFormSubmission(e) {
        e.preventDefault();
        
        // Validate all required fields
        const form = e.target;
        const requiredFields = form.querySelectorAll('input[required]');
        let allValid = true;

        requiredFields.forEach(field => {
            if (!validateField(field)) {
                allValid = false;
            }
        });

        // Check if amount is selected
        const selectedAmount = getSelectedDonationAmount();
        if (!selectedAmount || selectedAmount <= 0) {
            allValid = false;
            showFormError('Please select a donation amount.');
        }

        if (!allValid) {
            // Focus on first error field
            const firstErrorField = form.querySelector('.error');
            if (firstErrorField) {
                firstErrorField.focus();
            }
            return;
        }

        // Collect form data
        const formData = collectFormData(form);
        
        // Show loading state
        showLoadingState();
        
        // Submit donation
        submitDonation(formData);
    }

    function getSelectedDonationAmount() {
        const activeButton = document.querySelector('.amount-btn.active');
        if (!activeButton) return 0;
        
        const amount = activeButton.dataset.amount;
        if (amount === 'custom') {
            const customAmount = document.getElementById('customAmount').value;
            return parseFloat(customAmount) || 0;
        }
        
        return parseFloat(amount) || 0;
    }

    function collectFormData(form) {
        const formData = new FormData(form);
        const data = {
            amount: getSelectedDonationAmount(),
            currency: 'ZMW',
            donationType: formData.get('donationType'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            paymentMethod: formData.get('paymentMethod'),
            anonymous: formData.get('anonymous') === 'on',
            newsletter: formData.get('newsletter') === 'on',
            dedicationMessage: formData.get('dedicationMessage'),
            timestamp: new Date().toISOString()
        };
        
        return data;
    }

    function showLoadingState() {
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
            submitButton.classList.add('loading');
        }
    }

    function hideLoadingState() {
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Proceed to Payment';
            submitButton.classList.remove('loading');
        }
    }

    function submitDonation(donationData) {
        // This is where you would integrate with your payment processor
        // For now, we'll simulate the process
        
        console.log('Donation data:', donationData);
        
        // Simulate API call
        setTimeout(() => {
            // Hide loading state
            hideLoadingState();
            
            // For demonstration, we'll show success message
            showSuccessMessage(donationData);
            
            // In a real implementation, you would:
            // 1. Send data to your backend API
            // 2. Integrate with payment processor (PayPal, Stripe, mobile money API)
            // 3. Handle success/error responses
            // 4. Redirect to payment gateway or show confirmation
            
            /*
            fetch('/api/donations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': getCsrfToken()
                },
                body: JSON.stringify(donationData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Redirect to payment processor
                    window.location.href = data.paymentUrl;
                } else {
                    showFormError(data.message || 'An error occurred. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showFormError('Network error. Please check your connection and try again.');
            })
            .finally(() => {
                hideLoadingState();
            });
            */
            
        }, 2000);
    }

    function showSuccessMessage(donationData) {
        const message = `Thank you for your donation of ZMW ${donationData.amount}! 
                        In a real application, you would be redirected to complete the payment via ${donationData.paymentMethod}.`;
        
        showNotification(message, 'success');
    }

    function showFormError(message) {
        showNotification(message, 'error');
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
                <button type="button" class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-hide after 5 seconds
        const autoHideTimer = setTimeout(() => {
            hideNotification(notification);
        }, 5000);
        
        // Manual close button
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            clearTimeout(autoHideTimer);
            hideNotification(notification);
        });
        
        // Screen reader announcement
        announceToScreenReader(message);
    }

    function hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    function announceToScreenReader(message) {
        const announcer = document.getElementById('sr-announcements');
        if (announcer) {
            announcer.textContent = message;
        }
    }

    // Initialize button links for main page donation buttons
    function initializeDonationButtons() {
        const donationButtons = document.querySelectorAll('[data-translate="cta-donate"], [data-translate="cta-donate-main"]');
        
        donationButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Navigate to donation page
                const currentPage = window.location.pathname;
                let donationUrl = './pages/donate.html';
                
                // Adjust URL based on current page location
                if (currentPage.includes('/pages/')) {
                    donationUrl = './donate.html';
                }
                
                window.location.href = donationUrl;
            });
        });
    }

    // Initialize donation buttons on all pages
    initializeDonationButtons();

})();
