/**
 * International Payment Processing for AFZ Donations
 * Supports multiple payment gateways and currencies
 */

class InternationalPaymentProcessor {
    constructor() {
        this.supportedCurrencies = {
            'USD': { symbol: '$', name: 'US Dollar', rate: 1.0 },
            'EUR': { symbol: '€', name: 'Euro', rate: 0.85 },
            'GBP': { symbol: '£', name: 'British Pound', rate: 0.73 },
            'ZMW': { symbol: 'ZK', name: 'Zambian Kwacha', rate: 24.50 },
            'ZAR': { symbol: 'R', name: 'South African Rand', rate: 18.20 },
            'KES': { symbol: 'KSh', name: 'Kenyan Shilling', rate: 150.00 },
            'UGX': { symbol: 'USh', name: 'Ugandan Shilling', rate: 3700.00 },
            'CAD': { symbol: 'C$', name: 'Canadian Dollar', rate: 1.35 },
            'AUD': { symbol: 'A$', name: 'Australian Dollar', rate: 1.52 }
        };

        this.paymentGateways = {
            'paypal': {
                name: 'PayPal',
                currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
                fees: { fixed: 0.30, percentage: 2.9 },
                logo: '💳'
            },
            'stripe': {
                name: 'Stripe',
                currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'ZAR'],
                fees: { fixed: 0.30, percentage: 2.9 },
                logo: '🔒'
            },
            'flutterwave': {
                name: 'Flutterwave',
                currencies: ['USD', 'ZAR', 'KES', 'UGX', 'ZMW'],
                fees: { fixed: 0.00, percentage: 3.8 },
                logo: '🌍'
            },
            'mobile-money': {
                name: 'Mobile Money',
                currencies: ['ZMW', 'KES', 'UGX'],
                fees: { fixed: 0.00, percentage: 1.5 },
                logo: '📱'
            }
        };

        this.donationAmounts = {
            'USD': [10, 25, 50, 100, 250, 500],
            'EUR': [10, 20, 40, 85, 210, 425],
            'GBP': [8, 18, 37, 73, 183, 365],
            'ZMW': [245, 612, 1225, 2450, 6125, 12250],
            'ZAR': [182, 455, 910, 1820, 4550, 9100],
            'KES': [1500, 3750, 7500, 15000, 37500, 75000]
        };

        this.init();
    }

    init() {
        this.detectUserLocation();
        this.setupCurrencySelector();
        this.setupPaymentMethodSelector();
        this.setupDonationAmountButtons();
        this.setupFormValidation();
        this.initializeAnalytics();
    }

    async detectUserLocation() {
        try {
            // Try to detect user's location for currency suggestion
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            const countryToCurrency = {
                'US': 'USD', 'GB': 'GBP', 'EU': 'EUR', 'ZM': 'ZMW',
                'ZA': 'ZAR', 'KE': 'KES', 'UG': 'UGX', 'CA': 'CAD',
                'AU': 'AUD'
            };

            const suggestedCurrency = countryToCurrency[data.country_code] || 'USD';
            this.setDefaultCurrency(suggestedCurrency);
            
        } catch (error) {
            console.log('Could not detect location, using USD as default');
            this.setDefaultCurrency('USD');
        }
    }

    setDefaultCurrency(currency) {
        this.currentCurrency = currency;
        this.updateCurrencyDisplay();
        this.updateDonationAmounts();
        this.updatePaymentGatewaysForCurrency();
    }

    setupCurrencySelector() {
        const form = document.getElementById('donationForm');
        if (!form) return;

        // Create currency selector
        const currencyGroup = document.createElement('fieldset');
        currencyGroup.className = 'currency-selection-group';
        currencyGroup.innerHTML = `
            <legend class="form-legend" data-translate="currency-label">Currency</legend>
            <select id="currencySelect" name="currency" class="currency-select">
                ${Object.entries(this.supportedCurrencies).map(([code, info]) => 
                    `<option value="${code}">${info.symbol} ${code} - ${info.name}</option>`
                ).join('')}
            </select>
        `;

        // Insert after donation type group
        const donationTypeGroup = form.querySelector('.donation-type-group');
        donationTypeGroup.insertAdjacentElement('afterend', currencyGroup);

        // Setup event listener
        document.getElementById('currencySelect').addEventListener('change', (e) => {
            this.setDefaultCurrency(e.target.value);
        });
    }

    updateCurrencyDisplay() {
        const currencySelect = document.getElementById('currencySelect');
        if (currencySelect) {
            currencySelect.value = this.currentCurrency;
        }

        // Update amount legend
        const amountLegend = document.querySelector('[data-translate="donation-amount-label"]');
        if (amountLegend) {
            const currency = this.supportedCurrencies[this.currentCurrency];
            amountLegend.textContent = `Donation Amount (${currency.symbol} ${this.currentCurrency})`;
        }
    }

    updateDonationAmounts() {
        const amounts = this.donationAmounts[this.currentCurrency] || this.donationAmounts['USD'];
        const amountButtons = document.querySelectorAll('.amount-btn:not(.custom-amount)');
        
        amountButtons.forEach((btn, index) => {
            if (amounts[index]) {
                const currency = this.supportedCurrencies[this.currentCurrency];
                btn.setAttribute('data-amount', amounts[index]);
                btn.innerHTML = `${currency.symbol}${amounts[index].toLocaleString()}`;
            }
        });
    }

    updatePaymentGatewaysForCurrency() {
        const paymentOptions = document.querySelector('.payment-options');
        if (!paymentOptions) return;

        // Clear existing options
        paymentOptions.innerHTML = '';

        // Add available payment methods for current currency
        Object.entries(this.paymentGateways).forEach(([gateway, info]) => {
            if (info.currencies.includes(this.currentCurrency)) {
                const option = document.createElement('div');
                option.className = 'payment-option';
                option.innerHTML = `
                    <input type="radio" id="${gateway}" name="paymentMethod" value="${gateway}">
                    <label for="${gateway}" class="payment-label">
                        <span class="payment-icon">${info.logo}</span>
                        <span class="payment-name">${info.name}</span>
                        <span class="payment-fee">${info.fees.percentage}% + ${this.supportedCurrencies[this.currentCurrency].symbol}${info.fees.fixed}</span>
                    </label>
                `;
                paymentOptions.appendChild(option);
            }
        });

        // Select first available option
        const firstOption = paymentOptions.querySelector('input[type="radio"]');
        if (firstOption) firstOption.checked = true;
    }

    setupDonationAmountButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.amount-btn')) {
                // Remove active class from all buttons
                document.querySelectorAll('.amount-btn').forEach(btn => 
                    btn.classList.remove('active')
                );
                
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Handle custom amount
                const customInput = document.querySelector('.custom-amount-input');
                if (e.target.classList.contains('custom-amount')) {
                    customInput.style.display = 'block';
                    customInput.querySelector('input').focus();
                } else {
                    customInput.style.display = 'none';
                    this.updateDonationSummary(parseFloat(e.target.getAttribute('data-amount')));
                }
            }
        });

        // Handle custom amount input
        const customAmountInput = document.getElementById('customAmount');
        if (customAmountInput) {
            customAmountInput.addEventListener('input', (e) => {
                const amount = parseFloat(e.target.value);
                if (amount > 0) {
                    this.updateDonationSummary(amount);
                }
            });
        }
    }

    updateDonationSummary(amount) {
        // Create or update donation summary display
        let summaryDiv = document.querySelector('.donation-summary');
        if (!summaryDiv) {
            summaryDiv = document.createElement('div');
            summaryDiv.className = 'donation-summary';
            document.querySelector('.donation-form-container').appendChild(summaryDiv);
        }

        const currency = this.supportedCurrencies[this.currentCurrency];
        const gateway = document.querySelector('input[name="paymentMethod"]:checked')?.value;
        const gatewayInfo = this.paymentGateways[gateway] || this.paymentGateways['paypal'];
        
        const fees = (amount * gatewayInfo.fees.percentage / 100) + gatewayInfo.fees.fixed;
        const total = amount + fees;

        summaryDiv.innerHTML = `
            <div class="summary-card">
                <h4 data-translate="donation-summary-title">Donation Summary</h4>
                <div class="summary-line">
                    <span data-translate="donation-amount">Donation Amount:</span>
                    <span class="amount">${currency.symbol}${amount.toFixed(2)}</span>
                </div>
                <div class="summary-line">
                    <span data-translate="processing-fees">Processing Fees:</span>
                    <span class="fees">${currency.symbol}${fees.toFixed(2)}</span>
                </div>
                <div class="summary-line total">
                    <span data-translate="total-amount">Total Amount:</span>
                    <span class="total-amount">${currency.symbol}${total.toFixed(2)}</span>
                </div>
                <div class="impact-note">
                    <small data-translate="impact-note">
                        ${currency.symbol}${amount.toFixed(2)} goes directly to AFZ programs
                    </small>
                </div>
            </div>
        `;
    }

    setupPaymentMethodSelector() {
        document.addEventListener('change', (e) => {
            if (e.target.matches('input[name="paymentMethod"]')) {
                this.showPaymentMethodDetails(e.target.value);
            }
        });
    }

    showPaymentMethodDetails(method) {
        // Remove existing details
        document.querySelectorAll('.payment-details').forEach(el => el.remove());

        const details = document.createElement('div');
        details.className = 'payment-details';

        switch (method) {
            case 'mobile-money':
                details.innerHTML = `
                    <div class="mobile-money-details">
                        <h5 data-translate="mobile-money-instructions">Mobile Money Instructions</h5>
                        <ol>
                            <li data-translate="mobile-step-1">You'll receive SMS instructions after clicking "Proceed to Payment"</li>
                            <li data-translate="mobile-step-2">Dial the provided USSD code or use your mobile money app</li>
                            <li data-translate="mobile-step-3">Enter the transaction PIN to complete donation</li>
                        </ol>
                        <p class="supported-networks" data-translate="supported-networks">
                            Supported: Airtel Money, MTN Mobile Money, Zamtel Kwacha
                        </p>
                    </div>
                `;
                break;
            case 'paypal':
                details.innerHTML = `
                    <div class="paypal-details">
                        <p data-translate="paypal-instructions">
                            You'll be redirected to PayPal to complete your secure donation. 
                            You can pay with your PayPal account or any major credit/debit card.
                        </p>
                    </div>
                `;
                break;
            case 'stripe':
                details.innerHTML = `
                    <div class="stripe-details">
                        <p data-translate="stripe-instructions">
                            Secure card payment powered by Stripe. We accept Visa, Mastercard, 
                            American Express, and local payment methods.
                        </p>
                    </div>
                `;
                break;
            case 'flutterwave':
                details.innerHTML = `
                    <div class="flutterwave-details">
                        <p data-translate="flutterwave-instructions">
                            African payment gateway supporting cards, mobile money, bank transfers, 
                            and local payment methods across Africa.
                        </p>
                    </div>
                `;
                break;
        }

        const paymentMethodGroup = document.querySelector('.payment-method-group');
        paymentMethodGroup.appendChild(details);
    }

    setupFormValidation() {
        const form = document.getElementById('donationForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processDonation();
        });
    }

    async processDonation() {
        const form = document.getElementById('donationForm');
        const formData = new FormData(form);
        
        // Collect donation data
        const donationData = {
            amount: this.getSelectedAmount(),
            currency: this.currentCurrency,
            donationType: formData.get('donationType'),
            paymentMethod: formData.get('paymentMethod'),
            donor: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone')
            },
            options: {
                anonymous: formData.get('anonymous') === 'on',
                newsletter: formData.get('newsletter') === 'on',
                dedication: formData.get('dedicationMessage')
            },
            timestamp: new Date().toISOString(),
            source: 'afz-website'
        };

        // Validate required fields
        if (!this.validateDonationData(donationData)) {
            return;
        }

        // Show processing state
        this.showProcessingState();

        try {
            // Process payment based on selected method
            await this.processPaymentMethod(donationData);
        } catch (error) {
            console.error('Payment processing error:', error);
            this.showError('Payment processing failed. Please try again or contact support.');
        }
    }

    getSelectedAmount() {
        const activeBtn = document.querySelector('.amount-btn.active');
        if (activeBtn && activeBtn.classList.contains('custom-amount')) {
            return parseFloat(document.getElementById('customAmount').value);
        } else if (activeBtn) {
            return parseFloat(activeBtn.getAttribute('data-amount'));
        }
        return 0;
    }

    validateDonationData(data) {
        const errors = [];

        if (!data.amount || data.amount <= 0) {
            errors.push('Please select or enter a donation amount');
        }

        if (!data.donor.firstName.trim()) {
            errors.push('First name is required');
        }

        if (!data.donor.lastName.trim()) {
            errors.push('Last name is required');
        }

        if (!data.donor.email.trim() || !this.isValidEmail(data.donor.email)) {
            errors.push('Valid email address is required');
        }

        if (errors.length > 0) {
            this.showValidationErrors(errors);
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showValidationErrors(errors) {
        // Create or update error display
        let errorDiv = document.querySelector('.form-errors');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form-errors';
            document.querySelector('.form-actions').insertAdjacentElement('beforebegin', errorDiv);
        }

        errorDiv.innerHTML = `
            <div class="error-message">
                <h5>Please correct the following errors:</h5>
                <ul>
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        `;

        // Scroll to errors
        errorDiv.scrollIntoView({ behavior: 'smooth' });
    }

    showProcessingState() {
        const submitBtn = document.querySelector('.form-actions .cta-button');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        submitBtn.classList.add('processing');

        // Store original text for later restoration
        submitBtn.setAttribute('data-original-text', originalText);
    }

    async processPaymentMethod(donationData) {
        const { paymentMethod } = donationData;

        switch (paymentMethod) {
            case 'paypal':
                await this.processPayPal(donationData);
                break;
            case 'stripe':
                await this.processStripe(donationData);
                break;
            case 'flutterwave':
                await this.processFlutterwave(donationData);
                break;
            case 'mobile-money':
                await this.processMobileMoney(donationData);
                break;
            default:
                throw new Error('Unsupported payment method');
        }
    }

    async processPayPal(donationData) {
        // In production, this would integrate with PayPal API
        console.log('Processing PayPal payment:', donationData);
        
        // Simulate PayPal redirect
        const paypalUrl = this.generatePayPalUrl(donationData);
        
        // Store donation data for post-payment processing
        this.storePendingDonation(donationData);
        
        // Redirect to PayPal (in production)
        // window.location.href = paypalUrl;
        
        // For demo, show success message
        this.showPaymentSuccess(donationData, 'PayPal');
    }

    generatePayPalUrl(donationData) {
        const baseUrl = 'https://www.paypal.com/donate';
        const params = new URLSearchParams({
            business: 'donations@afz.org.zm', // Replace with actual PayPal business account
            item_name: 'AFZ Donation',
            amount: donationData.amount,
            currency_code: donationData.currency,
            return: `${window.location.origin}/donation-success`,
            cancel_return: `${window.location.origin}/donation-cancelled`,
            notify_url: `${window.location.origin}/api/paypal-webhook`
        });

        return `${baseUrl}?${params.toString()}`;
    }

    async processStripe(donationData) {
        // In production, this would use Stripe's JavaScript SDK
        console.log('Processing Stripe payment:', donationData);
        
        // For demo, show success message
        this.showPaymentSuccess(donationData, 'Stripe');
    }

    async processFlutterwave(donationData) {
        // In production, this would integrate with Flutterwave API
        console.log('Processing Flutterwave payment:', donationData);
        
        // For demo, show success message
        this.showPaymentSuccess(donationData, 'Flutterwave');
    }

    async processMobileMoney(donationData) {
        // In production, this would integrate with mobile money APIs
        console.log('Processing Mobile Money payment:', donationData);
        
        // For demo, show success message
        this.showPaymentSuccess(donationData, 'Mobile Money');
    }

    showPaymentSuccess(donationData, method) {
        const form = document.getElementById('donationForm');
        const currency = this.supportedCurrencies[donationData.currency];
        
        form.innerHTML = `
            <div class="payment-success">
                <div class="success-icon">✅</div>
                <h3 data-translate="payment-success-title">Thank You for Your Donation!</h3>
                <div class="donation-details">
                    <p><strong>Amount:</strong> ${currency.symbol}${donationData.amount}</p>
                    <p><strong>Payment Method:</strong> ${method}</p>
                    <p><strong>Reference:</strong> AFZ-${Date.now()}</p>
                </div>
                <p data-translate="payment-success-message">
                    Your generous donation will help AFZ continue advocating for the rights of persons with albinism in Zambia.
                    A receipt has been sent to your email address.
                </p>
                <div class="success-actions">
                    <a href="../index.html" class="cta-button primary" data-translate="return-home">Return to Home</a>
                    <button onclick="window.print()" class="cta-button secondary" data-translate="print-receipt">Print Receipt</button>
                </div>
            </div>
        `;

        // Track donation completion
        this.trackDonationCompletion(donationData);
    }

    showError(message) {
        const submitBtn = document.querySelector('.form-actions .cta-button');
        const originalText = submitBtn.getAttribute('data-original-text');
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('processing');

        // Show error message
        let errorDiv = document.querySelector('.form-errors');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form-errors';
            document.querySelector('.form-actions').insertAdjacentElement('beforebegin', errorDiv);
        }

        errorDiv.innerHTML = `
            <div class="error-message">
                <strong>Error:</strong> ${message}
            </div>
        `;
    }

    storePendingDonation(donationData) {
        // Store in localStorage for post-payment processing
        localStorage.setItem('pendingDonation', JSON.stringify(donationData));
    }

    trackDonationCompletion(donationData) {
        // Google Analytics or other tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'donation_completed', {
                currency: donationData.currency,
                value: donationData.amount,
                payment_method: donationData.paymentMethod
            });
        }

        // Remove pending donation
        localStorage.removeItem('pendingDonation');
    }

    initializeAnalytics() {
        // Initialize donation tracking
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                custom_map: { donation_amount: 'amount', donation_currency: 'currency' }
            });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('donationForm')) {
        window.paymentProcessor = new InternationalPaymentProcessor();
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InternationalPaymentProcessor;
}
