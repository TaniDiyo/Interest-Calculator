document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculator-form');
    const calculateBtn = document.getElementById('calculate-btn');
    const btnText = calculateBtn.querySelector('span');
    const loader = calculateBtn.querySelector('.loader');
    const errorMessage = document.getElementById('error-message');
    const resultsSection = document.getElementById('results');
    
    // Result elements
    const siInterest = document.getElementById('si-interest');
    const siTotal = document.getElementById('si-total');
    const ciInterest = document.getElementById('ci-interest');
    const ciTotal = document.getElementById('ci-total');

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    // Animate numbers
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // easeOutQuart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const current = start + easeProgress * (end - start);
            
            element.textContent = formatCurrency(current);
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Hide previous errors/results and show loading state
        errorMessage.classList.add('hidden');
        resultsSection.classList.add('hidden');
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        calculateBtn.disabled = true;

        const principal = parseFloat(document.getElementById('principal').value);
        const rate = parseFloat(document.getElementById('rate').value);
        const time = parseFloat(document.getElementById('time').value);

        try {
            const response = await fetch('/api/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ principal, rate, time })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            // Update UI with results
            resultsSection.classList.remove('hidden');
            
            // Animate results
            animateValue(siInterest, 0, data.simple_interest, 1000);
            animateValue(siTotal, 0, data.total_si_amount, 1200);
            animateValue(ciInterest, 0, data.compound_interest, 1000);
            animateValue(ciTotal, 0, data.total_ci_amount, 1200);

            // Scroll to results smoothly
            setTimeout(() => {
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);

        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.classList.remove('hidden');
        } finally {
            // Restore button state
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
            calculateBtn.disabled = false;
        }
    });
});
