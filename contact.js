document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.submit-btn');
    const formSuccess = document.getElementById('formSuccess');
    const btnLoader = document.getElementById('btnLoader');

    // Form validation
    const validateField = (field, errorElement, validator) => {
        const value = field.value.trim();
        const isValid = validator(value);
        
        if (!isValid.valid) {
            field.classList.add('error');
            errorElement.textContent = isValid.message;
            errorElement.classList.add('show');
            return false;
        } else {
            field.classList.remove('error');
            errorElement.textContent = '';
            errorElement.classList.remove('show');
            return true;
        }
    };

    // Validators
    const validators = {
        name: (value) => {
            if (!value) return { valid: false, message: 'Name is required' };
            if (value.length < 2) return { valid: false, message: 'Name must be at least 2 characters' };
            return { valid: true };
        },
        email: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) return { valid: false, message: 'Email is required' };
            if (!emailRegex.test(value)) return { valid: false, message: 'Please enter a valid email address' };
            return { valid: true };
        },
        subject: (value) => {
            if (!value) return { valid: false, message: 'Please select a subject' };
            return { valid: true };
        },
        message: (value) => {
            if (!value) return { valid: false, message: 'Message is required' };
            if (value.length < 10) return { valid: false, message: 'Message must be at least 10 characters' };
            if (value.length > 1000) return { valid: false, message: 'Message must be less than 1000 characters' };
            return { valid: true };
        }
    };

    // Real-time validation
    const fields = [
        { element: document.getElementById('name'), error: document.getElementById('nameError'), validator: validators.name },
        { element: document.getElementById('email'), error: document.getElementById('emailError'), validator: validators.email },
        { element: document.getElementById('subject'), error: document.getElementById('subjectError'), validator: validators.subject },
        { element: document.getElementById('message'), error: document.getElementById('messageError'), validator: validators.message }
    ];

    fields.forEach(({ element, error, validator }) => {
        element.addEventListener('blur', () => validateField(element, error, validator));
        element.addEventListener('input', () => {
            if (element.classList.contains('error')) {
                validateField(element, error, validator);
            }
        });
    });

    // Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        fields.forEach(({ element, error, validator }) => {
            if (!validateField(element, error, validator)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            contactForm.style.display = 'none';
            formSuccess.classList.add('show');
            
            // Reset form after 5 seconds
            setTimeout(() => {
                contactForm.style.display = 'flex';
                contactForm.reset();
                formSuccess.classList.remove('show');
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                // Clear any validation states
                fields.forEach(({ element, error }) => {
                    element.classList.remove('error');
                    error.classList.remove('show');
                });
            }, 5000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error sending your message. Please try again.');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    // Add character counter to message field
    const messageField = document.getElementById('message');
    const messageLabel = document.querySelector('label[for="message"]');
    
    const charCounter = document.createElement('span');
    charCounter.className = 'char-counter';
    charCounter.textContent = '0/1000';
    messageLabel.appendChild(charCounter);

    messageField.addEventListener('input', function() {
        const count = this.value.length;
        charCounter.textContent = `${count}/1000`;
        
        if (count > 900) {
            charCounter.style.color = 'var(--accent-color)';
        } else {
            charCounter.style.color = 'var(--text-muted)';
        }
    });

    // Add character counter styles
    const counterStyle = document.createElement('style');
    counterStyle.textContent = `
        .char-counter {
            margin-left: auto;
            font-size: 0.8rem;
            color: var(--text-muted);
            font-weight: 400;
        }
        
        .form-label {
            justify-content: space-between;
        }
        
        .form-input.error {
            border-color: var(--accent-color);
            box-shadow: 0 0 10px rgba(255, 0, 102, 0.3);
        }
    `;
    document.head.appendChild(counterStyle);

    // Animate contact cards on scroll
    const cards = document.querySelectorAll('.contact-card, .social-card, .availability-card, .tech-preferences');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });

    // Add typing effect to form placeholders
    const formInputs = document.querySelectorAll('.form-input');
    const placeholders = {
        name: 'Enter your full name...',
        email: 'your.email@example.com',
        message: 'Tell me about your project, ideas, or just say hello...'
    };

    Object.entries(placeholders).forEach(([id, placeholder]) => {
        const input = document.getElementById(id);
        if (input && input.type !== 'select-one') {
            let i = 0;
            const typeWriter = () => {
                if (i < placeholder.length) {
                    input.placeholder += placeholder.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            };
            
            setTimeout(() => {
                input.placeholder = '';
                typeWriter();
            }, 1000);
        }
    });

    // Add ripple effect to social links
    document.querySelectorAll('.social-item').forEach(item => {
        item.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple effect styles
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .social-item {
            position: relative;
            overflow: hidden;
        }
        
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 255, 136, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Add smooth scroll for CTA button
    document.querySelector('a[href="#contactForm"]')?.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('contactForm').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });

    // Add floating animation to tech items
    document.querySelectorAll('.tech-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('floating');
    });

    const floatingStyle = document.createElement('style');
    floatingStyle.textContent = `
        .floating {
            animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-5px);
            }
        }
    `;
    document.head.appendChild(floatingStyle);

    // Add copy email functionality
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.textContent;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    showTooltip(this, 'Email copied!');
                });
            } else {
                // Fallback for older browsers
                const tempInput = document.createElement('input');
                tempInput.value = email;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showTooltip(this, 'Email copied!');
            }
        });
    }

    function showTooltip(element, message) {
        const tooltip = document.createElement('div');
        tooltip.textContent = message;
        tooltip.className = 'copy-tooltip';
        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

        setTimeout(() => tooltip.remove(), 2000);
    }

    // Add tooltip styles
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
        .copy-tooltip {
            position: absolute;
            background: var(--primary-color);
            color: var(--bg-primary);
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 600;
            z-index: 1000;
            animation: tooltipFadeIn 0.3s ease;
        }
        
        @keyframes tooltipFadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(tooltipStyle);
});