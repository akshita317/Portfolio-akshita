document.addEventListener('DOMContentLoaded', function() {
    // Animate skill bars when they come into view
    const skillItems = document.querySelectorAll('.skill-item');
    const skillBars = document.querySelectorAll('.skill-progress');

    // Intersection Observer for skill animations
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add animation class
                entry.target.classList.add('animate');
                
                // Animate skill bar
                const progressBar = entry.target.querySelector('.skill-progress');
                const width = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = width + '%';
                }, index * 100);
                
                // Unobserve after animation
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all skill items
    skillItems.forEach(item => {
        skillObserver.observe(item);
    });

    // Add hover effect for skill categories
    const categoryHeaders = document.querySelectorAll('.category-header');
    
    categoryHeaders.forEach(header => {
        header.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.category-icon');
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        header.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.category-icon');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Add pulse animation to skill percentages
    skillItems.forEach(item => {
        const percentage = item.querySelector('.skill-percentage');
        
        item.addEventListener('mouseenter', function() {
            percentage.style.animation = 'pulse 1s infinite';
        });
        
        item.addEventListener('mouseleave', function() {
            percentage.style.animation = 'none';
        });
    });

    // Add CSS for pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
        }
        
        .skill-item {
            transition: all 0.3s ease;
        }
        
        .category-icon {
            transition: all 0.3s ease;
        }
        
        .skill-percentage {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // Skill level color coding
    function updateSkillColors() {
        skillItems.forEach(item => {
            const skillLevel = parseInt(item.getAttribute('data-skill'));
            const progressBar = item.querySelector('.skill-progress');
            let gradient;
            
            if (skillLevel >= 90) {
                gradient = 'linear-gradient(90deg, #00ff88, #00cc6a)';
            } else if (skillLevel >= 85) {
                gradient = 'linear-gradient(90deg, #0099ff, #007acc)';
            } else if (skillLevel >= 80) {
                gradient = 'linear-gradient(90deg, #f39c12, #e67e22)';
            } else if (skillLevel >= 75) {
                gradient = 'linear-gradient(90deg, #ff9500, #ff7b00)';
            } else {
                gradient = 'linear-gradient(90deg, #e74c3c, #c0392b)';
            }
            
            progressBar.style.background = gradient;
        });
    }

    // Apply color coding
    updateSkillColors();

    // Add typing effect to category titles
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function typing() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            }
        }
        typing();
    }

    // Observe category headers for typing effect
    const categoryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const title = entry.target.querySelector('.category-title');
                const originalText = title.textContent;
                typeWriter(title, originalText, 50);
                categoryObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    categoryHeaders.forEach(header => {
        categoryObserver.observe(header);
    });

    // Add interactive skill comparison
    let selectedSkills = [];
    
    skillItems.forEach(item => {
        item.addEventListener('click', function() {
            const skillName = this.querySelector('.skill-name').textContent;
            const skillLevel = parseInt(this.getAttribute('data-skill'));
            
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                selectedSkills = selectedSkills.filter(skill => skill.name !== skillName);
            } else {
                this.classList.add('selected');
                selectedSkills.push({ name: skillName, level: skillLevel });
            }
            
            updateComparison();
        });
    });

    function updateComparison() {
        // Remove existing comparison
        const existingComparison = document.querySelector('.skills-comparison');
        if (existingComparison) {
            existingComparison.remove();
        }

        if (selectedSkills.length > 1) {
            createComparisonChart();
        }
    }

    function createComparisonChart() {
        const comparison = document.createElement('div');
        comparison.className = 'skills-comparison';
        comparison.innerHTML = `
            <h3>Skill Comparison</h3>
            <div class="comparison-chart">
                ${selectedSkills.map(skill => `
                    <div class="comparison-item">
                        <span class="comparison-name">${skill.name}</span>
                        <div class="comparison-bar">
                            <div class="comparison-progress" style="width: ${skill.level}%"></div>
                        </div>
                        <span class="comparison-percentage">${skill.level}%</span>
                    </div>
                `).join('')}
            </div>
            <button class="clear-comparison" onclick="clearComparison()">Clear Comparison</button>
        `;

        // Add comparison styles
        const comparisonStyle = document.createElement('style');
        comparisonStyle.textContent = `
            .skills-comparison {
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                background: var(--bg-card);
                padding: 2rem;
                border-radius: 16px;
                border: 2px solid var(--primary-color);
                max-width: 300px;
                z-index: 1000;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            
            .skills-comparison h3 {
                color: var(--primary-color);
                margin-bottom: 1rem;
                text-align: center;
            }
            
            .comparison-item {
                margin-bottom: 1rem;
            }
            
            .comparison-name {
                display: block;
                color: var(--text-secondary);
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }
            
            .comparison-bar {
                background: var(--bg-secondary);
                height: 6px;
                border-radius: 3px;
                overflow: hidden;
            }
            
            .comparison-progress {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
                transition: width 1s ease;
            }
            
            .comparison-percentage {
                float: right;
                color: var(--primary-color);
                font-size: 0.8rem;
                font-weight: 600;
            }
            
            .clear-comparison {
                background: var(--accent-color);
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                cursor: pointer;
                width: 100%;
                margin-top: 1rem;
            }
            
            .skill-item.selected {
                border-color: var(--accent-color);
                box-shadow: 0 0 20px rgba(255, 0, 102, 0.3);
            }
        `;
        
        if (!document.querySelector('#comparison-styles')) {
            comparisonStyle.id = 'comparison-styles';
            document.head.appendChild(comparisonStyle);
        }

        document.body.appendChild(comparison);
    }

    // Global function for clearing comparison
    window.clearComparison = function() {
        selectedSkills = [];
        skillItems.forEach(item => item.classList.remove('selected'));
        const comparison = document.querySelector('.skills-comparison');
        if (comparison) {
            comparison.remove();
        }
    };

    // Add skill search functionality
    const searchContainer = document.createElement('div');
    searchContainer.className = 'skills-search';
    searchContainer.innerHTML = `
        <input type="text" placeholder="Search skills..." class="skill-search-input">
    `;

    const searchStyle = document.createElement('style');
    searchStyle.textContent = `
        .skills-search {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        .skill-search-input {
            width: 300px;
            padding: 1rem 1.5rem;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 50px;
            color: var(--text-primary);
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .skill-search-input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
        }
        
        .skill-search-input::placeholder {
            color: var(--text-muted);
        }
    `;
    document.head.appendChild(searchStyle);

    const skillsContent = document.querySelector('.skills-content .container');
    skillsContent.insertBefore(searchContainer, skillsContent.firstChild);

    // Search functionality
    const searchInput = document.querySelector('.skill-search-input');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        skillItems.forEach(item => {
            const skillName = item.querySelector('.skill-name').textContent.toLowerCase();
            const skillDescription = item.querySelector('.skill-description').textContent.toLowerCase();
            
            if (skillName.includes(searchTerm) || skillDescription.includes(searchTerm)) {
                item.style.display = 'block';
                item.style.opacity = '1';
            } else {
                item.style.display = 'none';
                item.style.opacity = '0';
            }
        });
        
        // Hide categories with no visible skills
        document.querySelectorAll('.skill-category').forEach(category => {
            const visibleSkills = Array.from(category.querySelectorAll('.skill-item')).filter(item => 
                item.style.display !== 'none'
            );
            
            if (visibleSkills.length === 0) {
                category.style.display = 'none';
            } else {
                category.style.display = 'block';
            }
        });
    });
});