/**
 * SECURE AWARE PRO - ARTICLE JAVASCRIPT
 * Enhanced functionality specifically for article pages
 */

// ===== ARTICLE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.article-content')) {
        initializeArticleNavigation();
        initializeArticleInteractions();
        initializeContentEnhancements();
        initializeArticleAnalytics();
        
        console.log('📖 Article features initialized');
    }
});

// ===== ARTICLE NAVIGATION =====
function initializeArticleNavigation() {
    // Enhanced table of contents with progress tracking
    const tocLinks = document.querySelectorAll('.table-of-contents a');
    const sections = document.querySelectorAll('.article-section');
    
    // Add click handlers for smooth scrolling
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 120;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active state
                updateTocActiveState(this);
                
                // Track section view
                trackSectionView(targetId);
            }
        });
    });
    
    // Update TOC active state on scroll
    window.addEventListener('scroll', throttle(updateTocOnScroll, 100));
    
    // Add section numbering
    addSectionNumbering();
    
    // Initialize reading time calculator
    calculateReadingTime();
}

function updateTocOnScroll() {
    const sections = document.querySelectorAll('.article-section');
    const tocLinks = document.querySelectorAll('.table-of-contents a');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });
    
    // Update active TOC link
    tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
    
    // Update reading progress
    updateReadingProgress();
}

function updateTocActiveState(activeLink) {
    const tocLinks = document.querySelectorAll('.table-of-contents a');
    tocLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function addSectionNumbering() {
    const sections = document.querySelectorAll('.article-section');
    sections.forEach((section, index) => {
        const heading = section.querySelector('h2');
        if (heading && !heading.querySelector('.section-number')) {
            const numberSpan = document.createElement('span');
            numberSpan.className = 'section-number';
            numberSpan.textContent = `${index + 1}. `;
            heading.insertBefore(numberSpan, heading.firstChild);
        }
    });
}

function calculateReadingTime() {
    const content = document.querySelector('.article-body');
    const readTimeElement = document.querySelector('.article-read-time');
    
    if (content && readTimeElement) {
        const text = content.textContent || content.innerText || '';
        const wordsPerMinute = 200; // Average reading speed for Arabic
        const wordCount = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        
        readTimeElement.innerHTML = `<i class="fas fa-clock me-1"></i>${readingTime} دقيقة قراءة`;
    }
}

// ===== ARTICLE INTERACTIONS =====
function initializeArticleInteractions() {
    // Enhanced sharing functionality
    initializeAdvancedSharing();
    
    // Article rating system
    initializeArticleRating();
    
    // Copy link functionality
    initializeCopyLink();
    
    // Text selection sharing
    initializeTextSelection();
    
    // Article bookmarking with local storage
    initializeAdvancedBookmarking();
    
    // Print optimization
    initializePrintOptimization();
    
    // Font size adjustment
    initializeFontSizeControls();
}

function initializeAdvancedSharing() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = Array.from(this.classList).find(cls => 
                ['facebook', 'twitter', 'linkedin', 'whatsapp', 'telegram'].includes(cls)
            );
            
            if (platform) {
                shareArticle(platform);
                trackSocialShare(platform);
            }
        });
    });
    
    // Native Web Share API support
    if (navigator.share) {
        const nativeShareBtn = document.createElement('button');
        nativeShareBtn.className = 'btn btn-outline-primary btn-sm';
        nativeShareBtn.innerHTML = '<i class="fas fa-share-alt me-1"></i>مشاركة';
        
        nativeShareBtn.addEventListener('click', async function() {
            try {
                await navigator.share({
                    title: document.title,
                    text: document.querySelector('meta[name="description"]')?.content || '',
                    url: window.location.href
                });
                trackSocialShare('native');
            } catch (err) {
                console.log('Error sharing:', err);
            }
        });
        
        const shareContainer = document.querySelector('.share-buttons');
        if (shareContainer) {
            shareContainer.appendChild(nativeShareBtn);
        }
    }
}

function shareArticle(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const description = encodeURIComponent(
        document.querySelector('meta[name="description"]')?.content || 
        document.querySelector('.article-subtitle')?.textContent || ''
    );
    
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}&hashtags=الأمان_الرقمي,SecureAware`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${description}`,
        whatsapp: `https://wa.me/?text=${title}%20${url}`,
        telegram: `https://t.me/share/url?url=${url}&text=${title}`
    };
    
    if (shareUrls[platform]) {
        const popup = window.open(
            shareUrls[platform], 
            'share', 
            'width=600,height=400,scrollbars=yes,resizable=yes'
        );
        
        // Check if popup was blocked
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
            showNotification('يرجى السماح بالنوافذ المنبثقة للمشاركة', 'warning');
        }
    }
}

function initializeArticleRating() {
    const ratingContainer = document.querySelector('.article-rating');
    if (!ratingContainer) return;
    
    const articleId = window.location.pathname;
    const savedRating = localStorage.getItem(`rating_${articleId}`);
    
    // Create rating stars
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'rating-star';
        star.dataset.rating = i;
        star.innerHTML = '<i class="far fa-star"></i>';
        
        if (savedRating && i <= parseInt(savedRating)) {
            star.innerHTML = '<i class="fas fa-star"></i>';
            star.classList.add('rated');
        }
        
        star.addEventListener('click', function() {
            rateArticle(i);
        });
        
        star.addEventListener('mouseenter', function() {
            highlightStars(i);
        });
        
        ratingContainer.appendChild(star);
    }
    
    // Reset on mouse leave
    ratingContainer.addEventListener('mouseleave', function() {
        resetStarHighlight(savedRating);
    });
}

function rateArticle(rating) {
    const articleId = window.location.pathname;
    localStorage.setItem(`rating_${articleId}`, rating);
    
    // Update visual state
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.innerHTML = '<i class="fas fa-star"></i>';
            star.classList.add('rated');
        } else {
            star.innerHTML = '<i class="far fa-star"></i>';
            star.classList.remove('rated');
        }
    });
    
    showNotification(`شكراً لك! تم تقييم المقال بـ ${rating} نجوم`, 'success');
    trackArticleRating(rating);
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.innerHTML = '<i class="fas fa-star"></i>';
        } else {
            star.innerHTML = '<i class="far fa-star"></i>';
        }
    });
}

function resetStarHighlight(savedRating) {
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star, index) => {
        if (savedRating && index < parseInt(savedRating)) {
            star.innerHTML = '<i class="fas fa-star"></i>';
        } else {
            star.innerHTML = '<i class="far fa-star"></i>';
        }
    });
}

function initializeCopyLink() {
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', function() {
            copyToClipboard(window.location.href);
            showNotification('تم نسخ رابط المقال', 'success');
            trackLinkCopy();
        });
    }
}

function initializeTextSelection() {
    let selectionTimeout;
    
    document.addEventListener('mouseup', function() {
        clearTimeout(selectionTimeout);
        selectionTimeout = setTimeout(handleTextSelection, 100);
    });
    
    document.addEventListener('keyup', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
            e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            clearTimeout(selectionTimeout);
            selectionTimeout = setTimeout(handleTextSelection, 100);
        }
    });
}

function handleTextSelection() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    // Remove existing selection toolbar
    const existingToolbar = document.querySelector('.selection-toolbar');
    if (existingToolbar) {
        existingToolbar.remove();
    }
    
    if (selectedText.length > 10) {
        createSelectionToolbar(selection, selectedText);
    }
}

function createSelectionToolbar(selection, selectedText) {
    const toolbar = document.createElement('div');
    toolbar.className = 'selection-toolbar';
    
    const shareBtn = document.createElement('button');
    shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
    shareBtn.title = 'مشاركة النص المحدد';
    shareBtn.addEventListener('click', () => shareSelectedText(selectedText));
    
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.title = 'نسخ النص';
    copyBtn.addEventListener('click', () => {
        copyToClipboard(selectedText);
        showNotification('تم نسخ النص المحدد', 'success');
    });
    
    const highlightBtn = document.createElement('button');
    highlightBtn.innerHTML = '<i class="fas fa-highlighter"></i>';
    highlightBtn.title = 'تمييز النص';
    highlightBtn.addEventListener('click', () => highlightSelectedText(selection));
    
    toolbar.appendChild(shareBtn);
    toolbar.appendChild(copyBtn);
    toolbar.appendChild(highlightBtn);
    
    document.body.appendChild(toolbar);
    
    // Position toolbar
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    toolbar.style.left = rect.left + (rect.width / 2) - (toolbar.offsetWidth / 2) + 'px';
    toolbar.style.top = rect.top - toolbar.offsetHeight - 10 + window.scrollY + 'px';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (toolbar.parentNode) {
            toolbar.remove();
        }
    }, 5000);
}

function shareSelectedText(text) {
    const shareText = `"${text}" - من مقال: ${document.title} ${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'نص محدد من المقال',
            text: shareText
        });
    } else {
        copyToClipboard(shareText);
        showNotification('تم نسخ النص للمشاركة', 'success');
    }
}

function highlightSelectedText(selection) {
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'highlighted-text';
        span.style.backgroundColor = '#fff3cd';
        span.style.padding = '2px 4px';
        span.style.borderRadius = '3px';
        
        try {
            range.surroundContents(span);
            showNotification('تم تمييز النص', 'success');
            
            // Save highlight to local storage
            saveHighlight(span.textContent, span.offsetTop);
        } catch (e) {
            console.log('Could not highlight complex selection');
            showNotification('لا يمكن تمييز هذا النص', 'warning');
        }
    }
    
    selection.removeAllRanges();
}

function saveHighlight(text, position) {
    const articleId = window.location.pathname;
    const highlights = JSON.parse(localStorage.getItem(`highlights_${articleId}`) || '[]');
    
    highlights.push({
        text: text,
        position: position,
        timestamp: Date.now()
    });
    
    localStorage.setItem(`highlights_${articleId}`, JSON.stringify(highlights));
}

function initializeAdvancedBookmarking() {
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    if (!bookmarkBtn) return;
    
    const articleId = window.location.pathname;
    const bookmarkData = JSON.parse(localStorage.getItem(`bookmark_${articleId}`) || 'null');
    
    updateBookmarkButton(bookmarkBtn, !!bookmarkData);
    
    bookmarkBtn.addEventListener('click', function() {
        const isBookmarked = this.classList.contains('bookmarked');
        
        if (isBookmarked) {
            // Remove bookmark
            localStorage.removeItem(`bookmark_${articleId}`);
            updateBookmarkButton(this, false);
            showNotification('تم إزالة المقال من المفضلة', 'info');
        } else {
            // Add bookmark
            const bookmark = {
                title: document.title,
                url: window.location.href,
                timestamp: Date.now(),
                readingProgress: calculateCurrentProgress()
            };
            
            localStorage.setItem(`bookmark_${articleId}`, JSON.stringify(bookmark));
            updateBookmarkButton(this, true);
            showNotification('تم حفظ المقال في المفضلة', 'success');
        }
        
        trackBookmarkAction(!isBookmarked);
    });
}

function updateBookmarkButton(button, isBookmarked) {
    if (isBookmarked) {
        button.classList.add('bookmarked');
        button.innerHTML = '<i class="fas fa-bookmark"></i> محفوظ';
    } else {
        button.classList.remove('bookmarked');
        button.innerHTML = '<i class="far fa-bookmark"></i> حفظ';
    }
}

function calculateCurrentProgress() {
    const article = document.querySelector('.article-body');
    if (!article) return 0;
    
    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.scrollY;
    
    return Math.min(100, Math.max(0, 
        ((scrollTop - articleTop + windowHeight) / articleHeight) * 100
    ));
}

function initializePrintOptimization() {
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            // Add print-specific styles
            document.body.classList.add('printing');
            
            // Hide unnecessary elements
            const elementsToHide = document.querySelectorAll(
                '.navbar, .back-to-top, .share-buttons, .article-sidebar'
            );
            elementsToHide.forEach(el => el.style.display = 'none');
            
            // Print
            window.print();
            
            // Restore after print
            setTimeout(() => {
                document.body.classList.remove('printing');
                elementsToHide.forEach(el => el.style.display = '');
            }, 1000);
            
            trackPrintAction();
        });
    }
}

function initializeFontSizeControls() {
    const fontSizeControls = document.querySelector('.font-size-controls');
    if (!fontSizeControls) return;
    
    const decreaseBtn = fontSizeControls.querySelector('.decrease-font');
    const increaseBtn = fontSizeControls.querySelector('.increase-font');
    const resetBtn = fontSizeControls.querySelector('.reset-font');
    
    let currentFontSize = parseInt(localStorage.getItem('articleFontSize') || '18');
    applyFontSize(currentFontSize);
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            if (currentFontSize > 14) {
                currentFontSize -= 2;
                applyFontSize(currentFontSize);
                localStorage.setItem('articleFontSize', currentFontSize);
            }
        });
    }
    
    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            if (currentFontSize < 24) {
                currentFontSize += 2;
                applyFontSize(currentFontSize);
                localStorage.setItem('articleFontSize', currentFontSize);
            }
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentFontSize = 18;
            applyFontSize(currentFontSize);
            localStorage.setItem('articleFontSize', currentFontSize);
        });
    }
}

function applyFontSize(size) {
    const articleBody = document.querySelector('.article-body');
    if (articleBody) {
        articleBody.style.fontSize = size + 'px';
    }
}

// ===== CONTENT ENHANCEMENTS =====
function initializeContentEnhancements() {
    // Add copy buttons to code blocks
    addCopyButtonsToCodeBlocks();
    
    // Initialize image zoom functionality
    initializeImageZoom();
    
    // Add expand/collapse for long lists
    initializeExpandableLists();
    
    // Initialize glossary tooltips
    initializeGlossaryTooltips();
    
    // Add section anchors
    addSectionAnchors();
}

function addCopyButtonsToCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code, .code-block');
    
    codeBlocks.forEach(block => {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.title = 'نسخ الكود';
        
        copyBtn.addEventListener('click', function() {
            copyToClipboard(block.textContent);
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
            showNotification('تم نسخ الكود', 'success');
        });
        
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);
        wrapper.appendChild(copyBtn);
    });
}

function initializeImageZoom() {
    const images = document.querySelectorAll('.article-body img');
    
    images.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function() {
            openImageModal(this);
        });
    });
}

function openImageModal(img) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-content">
            <span class="image-modal-close">&times;</span>
            <img src="${img.src}" alt="${img.alt || ''}" class="modal-image">
            <div class="image-modal-caption">${img.alt || ''}</div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal handlers
    const closeBtn = modal.querySelector('.image-modal-close');
    closeBtn.addEventListener('click', closeImageModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
    
    function closeImageModal() {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function initializeExpandableLists() {
    const longLists = document.querySelectorAll('ul, ol');
    
    longLists.forEach(list => {
        const items = list.querySelectorAll('li');
        if (items.length > 5) {
            // Hide items after the 5th
            for (let i = 5; i < items.length; i++) {
                items[i].style.display = 'none';
            }
            
            // Add expand button
            const expandBtn = document.createElement('button');
            expandBtn.className = 'expand-list-btn';
            expandBtn.textContent = `عرض ${items.length - 5} عناصر أخرى`;
            
            expandBtn.addEventListener('click', function() {
                const isExpanded = this.textContent.includes('إخفاء');
                
                for (let i = 5; i < items.length; i++) {
                    items[i].style.display = isExpanded ? 'none' : 'list-item';
                }
                
                this.textContent = isExpanded ? 
                    `عرض ${items.length - 5} عناصر أخرى` : 
                    'إخفاء العناصر الإضافية';
            });
            
            list.parentNode.insertBefore(expandBtn, list.nextSibling);
        }
    });
}

function initializeGlossaryTooltips() {
    const glossaryTerms = {
        'الذكاء الاصطناعي': 'تقنية تمكن الآلات من محاكاة الذكاء البشري',
        'البيانات البيومترية': 'معلومات فريدة مرتبطة بالخصائص الجسدية للشخص',
        'التشفير': 'عملية تحويل البيانات إلى شكل غير قابل للقراءة لحمايتها',
        'البرمجيات الخبيثة': 'برامج مصممة لإلحاق الضرر بالأنظمة الحاسوبية'
    };
    
    Object.keys(glossaryTerms).forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        const articleBody = document.querySelector('.article-body');
        
        if (articleBody) {
            articleBody.innerHTML = articleBody.innerHTML.replace(regex, 
                `<span class="glossary-term" data-definition="${glossaryTerms[term]}">${term}</span>`
            );
        }
    });
    
    // Add tooltip functionality
    const glossarySpans = document.querySelectorAll('.glossary-term');
    glossarySpans.forEach(span => {
        span.addEventListener('mouseenter', showGlossaryTooltip);
        span.addEventListener('mouseleave', hideGlossaryTooltip);
    });
}

function showGlossaryTooltip(e) {
    const definition = e.target.dataset.definition;
    if (!definition) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'glossary-tooltip';
    tooltip.textContent = definition;
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    setTimeout(() => tooltip.classList.add('visible'), 10);
}

function hideGlossaryTooltip() {
    const tooltips = document.querySelectorAll('.glossary-tooltip');
    tooltips.forEach(tooltip => {
        tooltip.classList.remove('visible');
        setTimeout(() => tooltip.remove(), 300);
    });
}

function addSectionAnchors() {
    const headings = document.querySelectorAll('.article-section h2, .article-section h3');
    
    headings.forEach(heading => {
        const anchor = document.createElement('a');
        anchor.className = 'section-anchor';
        anchor.href = `#${heading.id}`;
        anchor.innerHTML = '<i class="fas fa-link"></i>';
        anchor.title = 'رابط مباشر لهذا القسم';
        
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            copyToClipboard(window.location.origin + window.location.pathname + this.getAttribute('href'));
            showNotification('تم نسخ رابط القسم', 'success');
        });
        
        heading.appendChild(anchor);
    });
}

// ===== READING PROGRESS =====
function updateReadingProgress() {
    const progressBar = document.querySelector('.reading-progress');
    if (!progressBar) return;
    
    const article = document.querySelector('.article-body');
    if (!article) return;
    
    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.scrollY;
    
    const progress = Math.min(100, Math.max(0, 
        ((scrollTop - articleTop + windowHeight) / articleHeight) * 100
    ));
    
    progressBar.style.width = progress + '%';
    
    // Update progress in bookmark if exists
    const articleId = window.location.pathname;
    const bookmark = localStorage.getItem(`bookmark_${articleId}`);
    if (bookmark) {
        const bookmarkData = JSON.parse(bookmark);
        bookmarkData.readingProgress = progress;
        localStorage.setItem(`bookmark_${articleId}`, JSON.stringify(bookmarkData));
    }
}

// ===== ANALYTICS TRACKING =====
function initializeArticleAnalytics() {
    // Track article view
    trackArticleView();
    
    // Track reading time
    trackReadingTime();
    
    // Track scroll depth
    trackScrollDepth();
}

function trackArticleView() {
    const articleData = {
        title: document.title,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
    };
    
    // Send to analytics service (placeholder)
    console.log('Article view tracked:', articleData);
    
    // Store in local analytics
    const views = JSON.parse(localStorage.getItem('articleViews') || '[]');
    views.push(articleData);
    
    // Keep only last 100 views
    if (views.length > 100) {
        views.splice(0, views.length - 100);
    }
    
    localStorage.setItem('articleViews', JSON.stringify(views));
}

function trackReadingTime() {
    const startTime = Date.now();
    let isActive = true;
    let totalTime = 0;
    
    // Track when user becomes inactive
    let inactivityTimer;
    
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        isActive = true;
        
        inactivityTimer = setTimeout(() => {
            isActive = false;
        }, 30000); // 30 seconds of inactivity
    }
    
    // Reset timer on user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetInactivityTimer, true);
    });
    
    resetInactivityTimer();
    
    // Track reading time every 10 seconds
    const trackingInterval = setInterval(() => {
        if (isActive) {
            totalTime += 10;
        }
    }, 10000);
    
    // Send reading time when user leaves
    window.addEventListener('beforeunload', () => {
        clearInterval(trackingInterval);
        
        const readingData = {
            url: window.location.href,
            totalTime: totalTime,
            timestamp: Date.now()
        };
        
        console.log('Reading time tracked:', readingData);
        
        // Store locally
        const readingTimes = JSON.parse(localStorage.getItem('readingTimes') || '[]');
        readingTimes.push(readingData);
        localStorage.setItem('readingTimes', JSON.stringify(readingTimes));
    });
}

function trackScrollDepth() {
    const milestones = [25, 50, 75, 100];
    const reached = new Set();
    
    window.addEventListener('scroll', throttle(() => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        milestones.forEach(milestone => {
            if (scrollPercent >= milestone && !reached.has(milestone)) {
                reached.add(milestone);
                console.log(`Scroll depth: ${milestone}%`);
                
                // Track milestone
                const scrollData = {
                    url: window.location.href,
                    milestone: milestone,
                    timestamp: Date.now()
                };
                
                const scrollDepths = JSON.parse(localStorage.getItem('scrollDepths') || '[]');
                scrollDepths.push(scrollData);
                localStorage.setItem('scrollDepths', JSON.stringify(scrollDepths));
            }
        });
    }, 1000));
}

function trackSectionView(sectionId) {
    console.log('Section viewed:', sectionId);
    
    const sectionData = {
        url: window.location.href,
        section: sectionId,
        timestamp: Date.now()
    };
    
    const sectionViews = JSON.parse(localStorage.getItem('sectionViews') || '[]');
    sectionViews.push(sectionData);
    localStorage.setItem('sectionViews', JSON.stringify(sectionViews));
}

function trackSocialShare(platform) {
    console.log('Social share:', platform);
    
    const shareData = {
        url: window.location.href,
        platform: platform,
        timestamp: Date.now()
    };
    
    const socialShares = JSON.parse(localStorage.getItem('socialShares') || '[]');
    socialShares.push(shareData);
    localStorage.setItem('socialShares', JSON.stringify(socialShares));
}

function trackArticleRating(rating) {
    console.log('Article rated:', rating);
    
    const ratingData = {
        url: window.location.href,
        rating: rating,
        timestamp: Date.now()
    };
    
    const ratings = JSON.parse(localStorage.getItem('articleRatings') || '[]');
    ratings.push(ratingData);
    localStorage.setItem('articleRatings', JSON.stringify(ratings));
}

function trackLinkCopy() {
    console.log('Link copied');
    
    const copyData = {
        url: window.location.href,
        timestamp: Date.now()
    };
    
    const linkCopies = JSON.parse(localStorage.getItem('linkCopies') || '[]');
    linkCopies.push(copyData);
    localStorage.setItem('linkCopies', JSON.stringify(linkCopies));
}

function trackBookmarkAction(isBookmarked) {
    console.log('Bookmark action:', isBookmarked ? 'added' : 'removed');
    
    const bookmarkData = {
        url: window.location.href,
        action: isBookmarked ? 'added' : 'removed',
        timestamp: Date.now()
    };
    
    const bookmarkActions = JSON.parse(localStorage.getItem('bookmarkActions') || '[]');
    bookmarkActions.push(bookmarkData);
    localStorage.setItem('bookmarkActions', JSON.stringify(bookmarkActions));
}

function trackPrintAction() {
    console.log('Article printed');
    
    const printData = {
        url: window.location.href,
        timestamp: Date.now()
    };
    
    const printActions = JSON.parse(localStorage.getItem('printActions') || '[]');
    printActions.push(printData);
    localStorage.setItem('printActions', JSON.stringify(printActions));
}

// ===== UTILITY FUNCTIONS =====
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        return new Promise((resolve, reject) => {
            if (document.execCommand('copy')) {
                textArea.remove();
                resolve();
            } else {
                textArea.remove();
                reject();
            }
        });
    }
}

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `article-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('visible'), 10);
    
    // Auto hide
    const autoHide = setTimeout(() => hideNotification(notification), duration);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoHide);
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('visible');
    setTimeout(() => notification.remove(), 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

