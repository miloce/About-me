/**
 * 优化版JavaScript - 提升网站性能和用户体验
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 创建滚动进度条
    createScrollProgressBar();
    
    // 初始化页面
    initPage();

    // 初始化懒加载
    initLazyLoad();

    // 处理标语动画
    animateSlogan();
});

/**
 * 创建滚动进度条
 */
function createScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    // 更新进度条
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercentage + '%';
    });
}

/**
 * 初始化页面
 */
function initPage() {
    // 背景星空效果
    initStarTrack();

    // 监听滚动事件
    window.addEventListener('scroll', function() {
        // 检测滚动位置，控制导航栏和背景
        handleScrollEffects();
    });

    // 添加平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

/**
 * 初始化星空背景
 */
function initStarTrack() {
    const startrack = document.getElementById('startrack');
    if (!startrack) return;

    const ctx = startrack.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let stars = [];
    const maxStars = 1000;

    // 设置canvas大小
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        startrack.width = width;
        startrack.height = height;
        
        // 重新创建星星
        initializeStars();
    }

    // 初始化星星
    function initializeStars() {
        stars = [];
        const density = width * height / 8000;
        const count = Math.min(Math.floor(density), maxStars);
        
        for (let i = 0; i < count; i++) {
            const star = {
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5,
                opacity: Math.random(),
                speed: Math.random() * 0.5
            };
            stars.push(star);
        }
    }

    // 绘制星星
    function drawStars() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();

            // 移动星星
            star.y -= star.speed;
            
            // 如果星星超出视图，重置位置
            if (star.y < -10) {
                star.y = height + 10;
                star.x = Math.random() * width;
            }
        });

        requestAnimationFrame(drawStars);
    }

    // 添加调整大小事件监听
    window.addEventListener('resize', resizeCanvas);
    
    // 初始化并开始动画
    resizeCanvas();
    drawStars();
}

/**
 * 处理滚动效果
 */
function handleScrollEffects() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const background = document.querySelector('.background');
    
    // 背景视差效果
    if (background) {
        if (scrollTop > window.innerHeight) {
            background.classList.add('fixed');
        } else {
            background.classList.remove('fixed');
        }
    }

    // 根据滚动位置添加动画效果
    const animateItems = document.querySelectorAll('.animate-on-scroll');
    animateItems.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (itemTop < windowHeight * 0.85) {
            item.classList.add('animated');
        }
    });
}

/**
 * 初始化懒加载功能
 */
function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img.lazyload');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    const src = image.getAttribute('data-src');
                    
                    // 创建新图像预加载
                    const img = new Image();
                    img.onload = function() {
                        image.src = src;
                        image.classList.add('loaded');
                    };
                    img.src = src;
                    
                    imageObserver.unobserve(image);
                }
            });
        }, {
            rootMargin: '0px 0px 100px 0px',
            threshold: 0.1
        });
        
        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    } else {
        // 降级方案 - 为不支持IntersectionObserver的浏览器
        let lazyLoadThrottleTimeout;
        
        function lazyLoad() {
            if (lazyLoadThrottleTimeout) {
                clearTimeout(lazyLoadThrottleTimeout);
            }
            
            lazyLoadThrottleTimeout = setTimeout(() => {
                const scrollTop = window.pageYOffset;
                
                lazyImages.forEach(image => {
                    if (image.offsetTop < window.innerHeight + scrollTop) {
                        const src = image.getAttribute('data-src');
                        if (src) {
                            image.src = src;
                            image.classList.add('loaded');
                            image.removeAttribute('data-src');
                        }
                    }
                });
                
                if (lazyImages.length === 0) { 
                    document.removeEventListener('scroll', lazyLoad);
                    window.removeEventListener('resize', lazyLoad);
                    window.removeEventListener('orientationChange', lazyLoad);
                }
            }, 20);
        }
        
        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationChange', lazyLoad);
        lazyLoad();
    }
}

/**
 * 随机标语动画
 */
function animateSlogan() {
    const slogans = [
        "期待在比特之海与你相遇",
        "We are all Stardust",
        "每个人都是平凡的奇迹",
        "想和我一起启程吗？",
        "寻找那传说中的蘑菇森林",
        "There have an interesting soul"
    ];
    
    const sloganElement = document.getElementById('slogan');
    if (!sloganElement) return;
    
    // 随机获取一个标语
    const randomSlogan = slogans[Math.floor(Math.random() * slogans.length)];
    
    // 先清空标语
    sloganElement.textContent = '';
    
    // 初始化打字动画
    let charIndex = 0;
    const typingSpeed = 100; // ms
    
    function typeSlogan() {
        if (charIndex < randomSlogan.length) {
            sloganElement.textContent += randomSlogan.charAt(charIndex);
            charIndex++;
            setTimeout(typeSlogan, typingSpeed);
        } else {
            // 打字动画完成后，添加闪烁的光标效果
            sloganElement.classList.add('typed');
        }
    }
    
    // 开始动画
    typeSlogan();
}

/**
 * 在页面加载完成后执行一些额外的优化
 */
window.addEventListener('load', function() {
    // 加载非关键资源
    loadNonCriticalResources();
    
    // 预加载页面可能需要的其他页面
    prefetchPages();
    
    // 页面加载完成后的其他初始化
    initAudioControls();
    
    // 添加回到顶部按钮
    addBackToTopButton();
});

/**
 * 加载非关键资源
 */
function loadNonCriticalResources() {
    // 延迟加载统计脚本
    setTimeout(() => {
        const statisticsScript = document.createElement('script');
        statisticsScript.src = '/js/stats.js';
        statisticsScript.async = true;
        document.body.appendChild(statisticsScript);
    }, 3000);
}

/**
 * 预加载其他页面
 */
function prefetchPages() {
    const pagesToPrefetch = [
        'https://luozhinet.com/'
    ];
    
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            pagesToPrefetch.forEach(url => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = url;
                document.head.appendChild(link);
            });
        });
    } else {
        setTimeout(() => {
            pagesToPrefetch.forEach(url => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = url;
                document.head.appendChild(link);
            });
        }, 5000);
    }
}

/**
 * 初始化音频控制
 */
function initAudioControls() {
    const audio = document.getElementById('bgMusic');
    if (!audio) return;
    
    // 创建音频控制按钮
    const audioBtn = document.createElement('button');
    audioBtn.id = 'audioControl';
    audioBtn.innerHTML = '<span>♫</span>';
    audioBtn.classList.add('audio-control');
    audioBtn.title = '点击播放/暂停背景音乐';
    document.body.appendChild(audioBtn);
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .audio-control {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(93, 139, 244, 0.8);
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }
        .audio-control:hover {
            transform: scale(1.1);
            background: rgba(93, 139, 244, 1);
        }
        .audio-control.playing span {
            animation: rotate 3s linear infinite;
        }
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // 音频点击事件
    audioBtn.addEventListener('click', function() {
        if (!audio.src) {
            audio.src = "https://api.uomg.com/api/rand.music?sort=热歌榜";
            audio.play();
            audioBtn.classList.add('playing');
        } else if (audio.paused) {
            audio.play();
            audioBtn.classList.add('playing');
        } else {
            audio.pause();
            audioBtn.classList.remove('playing');
        }
    });
}

/**
 * 添加回到顶部按钮
 */
function addBackToTopButton() {
    // 创建回到顶部按钮
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.innerHTML = '<span>↑</span>';
    backToTopBtn.classList.add('back-to-top');
    backToTopBtn.title = '回到顶部';
    document.body.appendChild(backToTopBtn);
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 70px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(171, 74, 219, 0.8);
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            opacity: 0;
            visibility: hidden;
        }
        .back-to-top:hover {
            transform: translateY(-5px);
            background: rgba(171, 74, 219, 1);
        }
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
    `;
    document.head.appendChild(style);
    
    // 监听滚动事件，显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // 点击事件 - 平滑滚动到顶部
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
} 