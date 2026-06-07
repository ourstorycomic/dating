// Core Configuration
const CONFIG = {
    startDate: '2024-10-13 00:00:00', 
    currentDate: new Date().toISOString(),
    username: 'Tiendev',
    typingTexts: [
        'Mỗi khoảnh khắc bên em là một hạnh phúc',
        'Yêu em hôm qua, hôm nay và mãi mãi',
        'Together forever ❤️'
    ],
    musicPlaylist: [
    {
        title: 'Nơi này có anh',
        artist: 'SƠN TÙNG MTP',
        file: 'noinaycoanh.mp3',
        cover: 'images/noinaycoanh.jpg',
        duration: '3:43'
    },
    {
        title: 'Âm thầm bên em',
        artist: 'SƠN TÙNG MTP',
        file: 'amthambenem.mp3',
        cover: 'images/amthambenem.jpg',
        duration: '4:47'
    },
    {
        title: 'Em là người yêu của anh',
        artist: 'MIN',
        file: 'emlanguoiyeucuaanh.mp3',
        cover: 'images/emmoilanguoiyeucuaanh.jpg',
        duration: '4:10'
    },

    //thêm thì tự thêm đi 
    ]
};

const Utils = {
    // Format time from seconds to MM:SS
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },

    // Calculate time difference between two dates
    calculateTimeDifference(startDate, endDate = '2024-10-13 00:00:00') {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = Math.abs(end - start);

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return {
            days,
            hours,
            minutes,
            seconds,
            total: diff,
            formatted: `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`
        };
    },

    // Shuffle array using Fisher-Yates algorithm
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Format date to locale string
    formatDate(date) {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Get random number between min and max
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Add animation class and remove it after animation ends
    animate(element, animationClass, duration = 1000) {
        if (!element) return;
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, duration);
    }
};
// Theme Manager Class
class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const icon = this.themeToggle.querySelector('i');
        icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

class NavigationManager {
    constructor() {
        // Core configuration
        CONFIG.currentDate = '2024-10-13 00:00:00';
        CONFIG.username = 'Tiendev';

        this.currentPath = window.location.pathname;
        this.navContainer = document.querySelector('.nav-container');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.indicator = document.querySelector('.nav-indicator');
        
        this.init();
    }

    init() {
        // Initialize active link
        this.setActiveLink(this.currentPath);
        
        // Add event listeners
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.setActiveLink(href);
                this.navigateTo(href);
            });
        });

        // Handle back/forward browser buttons
        window.addEventListener('popstate', () => {
            this.setActiveLink(window.location.pathname);
        });
    }

    setActiveLink(path) {
        // Remove active class from all links
        this.navLinks.forEach(link => link.classList.remove('active'));
        
        // Find and activate current link
        const activeLink = Array.from(this.navLinks).find(link => 
            link.getAttribute('href') === path
        );

        if (activeLink) {
            activeLink.classList.add('active');
            this.moveIndicator(activeLink);
        }
    }

    moveIndicator(activeLink) {
        if (!this.indicator) return;

        // Get the position and width of the active link
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = this.navContainer.getBoundingClientRect();

        // Calculate the left position relative to nav container
        const left = linkRect.left - navRect.left;

        // Update indicator position and width
        this.indicator.style.width = `${linkRect.width}px`;
        this.indicator.style.transform = `translateX(${left}px)`;
    }

    navigateTo(path) {
        // Update URL without page reload
        window.history.pushState({}, '', path);
    }
}

// CSS for navigation
const style = document.createElement('style');
style.textContent = `
.nav-container {
    position: relative;
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 1rem;
    background: var(--background-color);
    border-radius: 12px;
}

.nav-link {
    position: relative;
    padding: 0.5rem 1rem;
    color: var(--text-color);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    white-space: nowrap;
}

.nav-link:hover {
    color: var(--primary-color);
}

.nav-link.active {
    color: var(--primary-color);
}

.nav-indicator {
    position: absolute;
    bottom: 0;
    height: 2px;
    background: var(--primary-color);
    border-radius: 1px;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

/* Mobile responsive */
@media (max-width: 768px) {
    .nav-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none; /* Firefox */
    }

    .nav-container::-webkit-scrollbar {
        display: none; /* Chrome, Safari */
    }

    .nav-link {
        padding: 0.5rem 0.75rem;
        font-size: 0.9rem;
    }
}

/* Active state animation */
.nav-link.active::after {
    transform: scaleX(1);
}

/* Hover animation */
.nav-link:hover::after {
    transform: scaleX(1);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .nav-container {
        background: var(--background-color-dark);
    }

    .nav-link {
        color: var(--text-color-dark);
    }

    .nav-link:hover,
    .nav-link.active {
        color: var(--primary-color);
    }
}
`;
document.head.appendChild(style);
// Initialize navigation
document.addEventListener('DOMContentLoaded', () => {
    const navigation = new NavigationManager();
});
// Music Player Class
class MusicPlayer {
    constructor(playlist) {
        this.playlist = playlist;
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.repeatMode = 'none'; // none, one, all
        this.audio = new Audio();
        this.originalPlaylist = [...playlist];
        this.playlistItems = [];

        this.initializeElements();
        this.initializeEventListeners();
        this.loadTrack(this.currentTrackIndex);
        this.setVolume(0.5);
    }

    initializeElements() {
        // Main player elements
        this.playerElement = document.querySelector('.music-player');
        this.playBtns = document.querySelectorAll('.play-btn');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.shuffleBtn = document.querySelector('.shuffle-btn');
        this.repeatBtn = document.querySelector('.repeat-btn');
        this.minimizeToggle = document.querySelector('.minimize-toggle');

        // Progress elements
        this.progressBar = document.querySelector('.progress-bar');
        this.progress = document.querySelector('.progress');
        this.currentTimeEl = document.querySelector('.current-time');
        this.durationEl = document.querySelector('.duration');

        // Volume elements
        this.volumeSlider = document.querySelector('.volume-slider');
        this.volumeBar = document.querySelector('.volume-bar');
        this.volumeIcon = document.querySelector('.volume-icon');

        // Playlist elements
        this.playlistContainer = document.querySelector('.playlist');
        this.initializePlaylist();
    }

    initializePlaylist() {
        this.playlist.forEach((track, index) => {
            const li = document.createElement('li');
            li.className = 'playlist-item' + (index === 0 ? ' active' : '');
            li.innerHTML = `
                <div class="playlist-item-info">
                    <span class="playlist-item-title">${track.title}</span>
                    <span class="playlist-item-artist">${track.artist}</span>
                </div>
                <span class="playlist-item-duration">${track.duration}</span>
            `;
            this.playlistContainer.appendChild(li);
            this.playlistItems.push(li);

            li.addEventListener('click', () => this.playTrack(index));
        });
    }

    initializeEventListeners() {
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => {
            this.durationEl.textContent = this.formatTime(this.audio.duration);
            this.updateProgress();
        });

        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleTrackEnd());

        // Control buttons
        this.playBtns.forEach(btn => 
            btn.addEventListener('click', () => this.togglePlay())
        );
        this.prevBtn.addEventListener('click', () => this.playPrev());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.minimizeToggle.addEventListener('click', () => this.toggleMinimize());

        // Progress bar
        this.progressBar.addEventListener('click', (e) => this.updateProgressFromEvent(e));
        
        // Volume control
        this.volumeSlider.addEventListener('click', (e) => this.updateVolumeFromEvent(e));
        this.volumeIcon.addEventListener('click', () => this.toggleMute());
    }

    loadTrack(index) {
        const track = this.playlist[index];
        this.audio.src = track.file;
        this.audio.load();

        // Update display information
        document.getElementById('songTitle').textContent = track.title;
        document.getElementById('songArtist').textContent = track.artist;
        document.getElementById('albumArt').src = track.cover;

        // Update playlist highlight
        this.playlistItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.isPlaying = true;
        this.audio.play();
        this.updatePlayButton();
        this.playerElement.classList.add('playing');
    }

    pause() {
        this.isPlaying = false;
        this.audio.pause();
        this.updatePlayButton();
        this.playerElement.classList.remove('playing');
    }

    playNext() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
        if (this.isPlaying) this.play();
    }

    playPrev() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
        if (this.isPlaying) this.play();
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        this.shuffleBtn.classList.toggle('active');
        this.playlist = this.isShuffled ? 
            Utils.shuffleArray([...this.playlist]) : 
            [...this.originalPlaylist];
    }

    toggleRepeat() {
        switch(this.repeatMode) {
            case 'none':
                this.repeatMode = 'all';
                this.repeatBtn.classList.add('active');
                break;
            case 'all':
                this.repeatMode = 'one';
                this.repeatBtn.classList.add('active');
                this.repeatBtn.querySelector('i').className = 'fas fa-redo-alt';
                break;
            case 'one':
                this.repeatMode = 'none';
                this.repeatBtn.classList.remove('active');
                this.repeatBtn.querySelector('i').className = 'fas fa-redo';
                break;
        }
    }

    handleTrackEnd() {
        switch(this.repeatMode) {
            case 'one':
                this.audio.currentTime = 0;
                this.play();
                break;
            case 'all':
                this.playNext();
                break;
            default:
                if (this.currentTrackIndex < this.playlist.length - 1) {
                    this.playNext();
                } else {
                    this.isPlaying = false;
                    this.updatePlayButton();
                }
        }
    }

    updateProgressFromEvent(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.audio.currentTime = pos * this.audio.duration;
        this.updateProgress();
    }

    updateProgress() {
        const pos = this.audio.currentTime / this.audio.duration;
        this.progress.style.width = `${pos * 100}%`;
        this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    }

    updateVolumeFromEvent(e) {
        const rect = this.volumeSlider.getBoundingClientRect();
        const volume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.setVolume(volume);
    }

    setVolume(volume) {
        this.audio.volume = volume;
        this.volumeBar.style.width = `${volume * 100}%`;
        this.updateVolumeIcon(volume);
    }

    toggleMute() {
        if (this.audio.volume > 0) {
            this.lastVolume = this.audio.volume;
            this.setVolume(0);
        } else {
            this.setVolume(this.lastVolume || 0.5);
        }
    }

    updateVolumeIcon(volume) {
        const icon = this.volumeIcon;
        icon.className = volume === 0 ? 'fas fa-volume-mute' :
                        volume < 0.5 ? 'fas fa-volume-down' :
                        'fas fa-volume-up';
    }

    toggleMinimize() {
        this.playerElement.classList.toggle('minimized');
    }

    updatePlayButton() {
        this.playBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        });
    }

    formatTime(seconds) {
        return Utils.formatTime(seconds);
    }
}

// Notes System
class NotesManager {
    constructor() {
        // Core configuration
        this.CONFIG = {
            currentDate: '2024-10-13 00:00:00',
            username: 'Tiendev'
        };

        this.notesContainer = document.querySelector('.notes-container');
        this.addNoteBtn = document.querySelector('.add-note-btn');
        this.notes = JSON.parse(localStorage.getItem('loveNotes') || '[]');
        this.currentUser = this.CONFIG.username;
        this.init();
    }

    init() {
        // Load existing notes
        this.renderNotes();

        // Add note button event
        this.addNoteBtn.addEventListener('click', () => this.openModal());

        // Initialize SweetAlert2 if available
        if (typeof Swal === 'undefined') {
            console.warn('SweetAlert2 is not loaded. Using default modal.');
        }
    }

    openModal() {
        Swal.fire({
            title: '✨ Thêm lời nhắn mới',
            input: 'textarea',
            inputLabel: 'Lời nhắn của bạn',
            inputPlaceholder: 'Viết lời nhắn yêu thương của bạn...',
            inputAttributes: {
                minlength: '10',
                maxlength: '500'
            },
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-paper-plane"></i> Gửi lời nhắn',
            cancelButtonText: '<i class="fas fa-times"></i> Hủy bỏ',
            customClass: {
                popup: 'swal2-note-modal',
                confirmButton: 'submit-btn',
                cancelButton: 'cancel-btn'
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'Vui lòng nhập lời nhắn!';
                }
                if (value.length < 10) {
                    return 'Lời nhắn phải có ít nhất 10 ký tự!';
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.addNote(result.value);
            }
        });

        // Add character counter
        const textarea = document.querySelector('.swal2-textarea');
        if (textarea) {
            const counterHtml = document.createElement('div');
            counterHtml.className = 'character-count';
            counterHtml.innerHTML = `<span class="current">0</span>/<span class="maximum">500</span>`;
            textarea.parentNode.appendChild(counterHtml);

            textarea.addEventListener('input', () => {
                const current = textarea.value.length;
                const currentSpan = counterHtml.querySelector('.current');
                currentSpan.textContent = current;
                counterHtml.classList.toggle('limit-near', current > 400);
            });
        }
    }

    addNote(content) {
        const note = {
            id: Date.now(),
            content: content,
            author: this.currentUser,
            date: this.CONFIG.currentDate,
            likes: 0,
            isLiked: false
        };

        // Add to beginning of array
        this.notes.unshift(note);
        
        // Save to localStorage
        this.saveNotes();

        // Create and add new note element
        const noteEl = this.createNoteElement(note);
        if (this.notesContainer.firstChild) {
            this.notesContainer.insertBefore(noteEl, this.notesContainer.firstChild);
        } else {
            this.notesContainer.appendChild(noteEl);
        }

        // Show success message
        Swal.fire({
            icon: 'success',
            title: 'Đã thêm lời nhắn!',
            text: 'Cảm ơn bạn đã chia sẻ tình yêu.',
            showConfirmButton: false,
            timer: 1500
        });

        // Animate new note
        setTimeout(() => {
            noteEl.classList.add('visible');
            Utils.createFloatingHearts();
        }, 100);
    }

    createNoteElement(note) {
        const noteEl = document.createElement('div');
        noteEl.className = 'note';
        noteEl.dataset.id = note.id;
        
        const formattedDate = new Date(note.date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        noteEl.innerHTML = `
            <div class="note-content">${note.content}</div>
            <div class="note-footer">
                <div class="note-info">
                    <span class="note-author">@${note.author}</span>
                    <span class="note-date">${formattedDate}</span>
                </div>
                <div class="note-actions">
                    <button class="note-like ${note.isLiked ? 'liked' : ''}" aria-label="Thích">
                        <i class="fas fa-heart"></i>
                        <span>${note.likes}</span>
                    </button>
                    ${note.author === this.currentUser ? `
                        <button class="note-delete" title="Xóa lời nhắn">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        // Add like functionality
        const likeBtn = noteEl.querySelector('.note-like');
        likeBtn.addEventListener('click', () => this.toggleLike(note.id));

        // Add delete functionality if it's current user's note
        if (note.author === this.currentUser) {
            const deleteBtn = noteEl.querySelector('.note-delete');
            deleteBtn.addEventListener('click', () => this.confirmDelete(note.id));
        }

        return noteEl;
    }

    confirmDelete(noteId) {
        Swal.fire({
            title: 'Xác nhận xóa?',
            text: 'Bạn có chắc chắn muốn xóa lời nhắn này không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '<i class="fas fa-trash-alt"></i> Xóa',
            cancelButtonText: '<i class="fas fa-times"></i> Hủy',
            customClass: {
                popup: 'swal2-delete-modal',
                confirmButton: 'delete-btn',
                cancelButton: 'cancel-btn'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteNote(noteId);
            }
        });
    }

    deleteNote(noteId) {
        const noteEl = this.notesContainer.querySelector(`[data-id="${noteId}"]`);
        if (!noteEl) return;

        // Add removing animation
        noteEl.classList.add('removing');

        // Remove note after animation
        setTimeout(() => {
            // Remove from array
            this.notes = this.notes.filter(note => note.id !== noteId);
            // Save to localStorage
            this.saveNotes();
            // Remove from DOM
            noteEl.remove();

            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Đã xóa lời nhắn!',
                showConfirmButton: false,
                timer: 1500
            });
        }, 300);
    }

    toggleLike(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;

        note.isLiked = !note.isLiked;
        note.likes += note.isLiked ? 1 : -1;

        // Save to localStorage
        this.saveNotes();
        
        // Update UI
        const noteEl = this.notesContainer.querySelector(`[data-id="${noteId}"]`);
        const likeBtn = noteEl.querySelector('.note-like');
        const likesCount = noteEl.querySelector('.note-like span');
        
        likeBtn.classList.toggle('liked');
        likesCount.textContent = note.likes;

        if (note.isLiked) {
            Utils.createFloatingHearts();
        }
    }

    saveNotes() {
        localStorage.setItem('loveNotes', JSON.stringify(this.notes));
    }

    renderNotes() {
        this.notesContainer.innerHTML = '';
        this.notes.forEach(note => {
            const noteEl = this.createNoteElement(note);
            this.notesContainer.appendChild(noteEl);
            setTimeout(() => noteEl.classList.add('visible'), 100);
        });
    }
}

// Initialize Notes Manager
document.addEventListener('DOMContentLoaded', () => {
    const notesManager = new NotesManager();
});

// Timeline Gallery Manager
class TimelineGalleryManager {
    constructor() {
        this.gallery = document.querySelector('.gallery-grid');
        this.filters = document.querySelectorAll('.filter-btn');
        this.items = document.querySelectorAll('.gallery-item');
        this.timeline = document.querySelector('.timeline');
        this.timelineItems = document.querySelectorAll('.timeline-item');
        
        this.init();
    }

    init() {
        // Initialize Fancybox
        if (typeof Fancybox !== 'undefined') {
            Fancybox.bind('[data-fancybox]', {
                dragToClose: false,
                wheel: false,
                Image: {
                    zoom: true,
                },
                on: {
                    reveal: () => {
                        Utils.createFloatingHearts();
                    }
                }
            });
        }

        // Gallery filtering
        this.initializeFilters();

        // Timeline animations
        this.initializeTimelineAnimations();
    }

    initializeFilters() {
        this.filters.forEach(filter => {
            filter.addEventListener('click', () => {
                const category = filter.dataset.filter;
                
                // Update active filter
                this.filters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                
                // Filter items
                this.items.forEach(item => {
                    const itemCategory = item.dataset.category;
                    if (category === 'all' || category === itemCategory) {
                        item.style.display = 'block';
                        setTimeout(() => item.classList.add('visible'), 50);
                    } else {
                        item.classList.remove('visible');
                        setTimeout(() => item.style.display = 'none', 300);
                    }
                });
            });
        });
    }

    initializeTimelineAnimations() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        Utils.createFloatingHearts();
                    }
                });
            }, {
                threshold: 0.2
            });

            this.timelineItems.forEach(item => observer.observe(item));
        } else {
            // Fallback for older browsers
            this.timelineItems.forEach(item => item.classList.add('visible'));
        }
    }
}


// Stats Manager
class StatsManager {
    constructor() {
        this.loveTimer = document.getElementById('loveTimer');
        this.daysCounter = document.getElementById('days-together');
        this.hoursCounter = document.getElementById('hours-together');
        this.typingElement = document.querySelector('.typing-text');
        this.cursor = document.querySelector('.cursor');
        
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typingSpeed = 100;
        this.deletingSpeed = 50;
        this.pauseEnd = 2000;
        this.pauseStart = 500;

        this.init();
    }

    init() {
        // Start love timer
        this.updateLoveTimer();
        setInterval(() => this.updateLoveTimer(), 1000);

        // Start typing effect
        this.typeWriter();
        this.cursorBlink();
    }

    updateLoveTimer() {
        const timeDiff = Utils.calculateTimeDifference(CONFIG.startDate, new Date().toISOString());
        
        // Update main timer
        this.loveTimer.textContent = `${timeDiff.days} ngày ${timeDiff.hours} giờ ${timeDiff.minutes} phút ${timeDiff.seconds} giây`;
        
        // Update counters with animation
        this.animateNumber(this.daysCounter, timeDiff.days);
        this.animateNumber(this.hoursCounter, timeDiff.hours + (timeDiff.days * 24));
    }

    animateNumber(element, target) {
        if (!element) return;
        const current = parseInt(element.textContent) || 0;
        if (current !== target) {
            const increment = target > current ? 1 : -1;
            element.textContent = current + increment;
            setTimeout(() => this.animateNumber(element, target), 50);
        }
    }

    typeWriter() {
        const texts = CONFIG.typingTexts;
        const currentText = texts[this.currentTextIndex];

        if (this.isDeleting) {
            this.currentCharIndex--;
            this.typingSpeed = this.deletingSpeed;
        } else {
            this.currentCharIndex++;
            this.typingSpeed = 100;
        }

        if (this.typingElement) {
            this.typingElement.textContent = currentText.substring(0, this.currentCharIndex);
        }

        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            this.typingSpeed = this.pauseEnd;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % texts.length;
            this.typingSpeed = this.pauseStart;
        }

        setTimeout(() => this.typeWriter(), this.typingSpeed);
    }

    cursorBlink() {
        if (this.cursor) {
            setInterval(() => {
                this.cursor.classList.toggle('blink');
            }, 500);
        }
    }
}

// Main Initializer
class MainInitializer {
    constructor() {
        // Update configuration
        CONFIG.currentDate = '2024-10-13 00:00:00';
        CONFIG.username = 'Tiendev';
        
        this.preloader = document.getElementById('preloader');
        this.progressFill = this.preloader?.querySelector('.progress-fill');
        this.progressText = this.preloader?.querySelector('.progress-text');
        this.components = [];

        this.startLoading();
    }

    startLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            this.updateProgress(progress);
            
            if (progress >= 100) {
                clearInterval(interval);
                this.finishLoading();
            }
        }, 100); 
    }

    updateProgress(progress) {
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }
        if (this.progressText) {
            this.progressText.textContent = `${progress}%`;
        }
    }

    finishLoading() {
        // Fade out preloader
        if (this.preloader) {
            this.preloader.style.opacity = '0';
            setTimeout(() => {
                this.preloader.style.display = 'none';
                document.body.classList.add('loaded');
                this.initializeComponents();
            }, 500);
        } else {
            this.initializeComponents();
        }
    }

    async initializeComponents() {
        try {
            this.components.push(new ThemeManager());
            this.components.push(new MusicPlayer(CONFIG.musicPlaylist));
            this.components.push(new TimelineGalleryManager());
            this.components.push(new NotesManager());
            this.components.push(new StatsManager());

            // Initialize AOS
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 800,
                    easing: 'ease-in-out',
                    once: true,
                    mirror: false
                });
            }

            this.setupHeaderScroll();
            this.setupMobileMenu();
            this.setupSmoothScroll();
            this.startFloatingHearts();

        } catch (error) {
            console.error('Error initializing components:', error);
        }
    }

    setupHeaderScroll() {
        const header = document.querySelector('.header');
        if (header) {
            window.addEventListener('scroll', Utils.debounce(() => {
                header.classList.toggle('scrolled', window.scrollY > 100);
            }, 100));
        }
    }

    setupMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav') && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        }
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    const navLinks = document.querySelector('.nav-links');
                    const menuToggle = document.querySelector('.menu-toggle');
                    navLinks?.classList.remove('active');
                    menuToggle?.classList.remove('active');
                }
            });
        });
    }

    startFloatingHearts() {
        Utils.createFloatingHearts();
        
        setInterval(() => {
            if (Math.random() < 0.1) {
                Utils.createFloatingHearts();
            }
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new MainInitializer();
});

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        CONFIG.currentDate = new Date().toISOString();
    }
});


class HeartLoader {
    constructor() {
        this.heartLoader = document.querySelector('.heart-loader');
        this.init();
    }

    init() {
        const heartShape = document.createElement('div');
        heartShape.className = 'heart-shape';
        this.heartLoader.appendChild(heartShape);

        const heartGlow = document.createElement('div');
        heartGlow.className = 'heart-glow';
        this.heartLoader.appendChild(heartGlow);

        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'heart-particles';
        this.heartLoader.appendChild(particlesContainer);

        this.createParticles(particlesContainer);
    }

    createParticles(container) {
        setInterval(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const angle = Math.random() * Math.PI * 2;
            const radius = 40;
            const startX = 50 + Math.cos(angle) * radius;
            const startY = 45 + Math.sin(angle) * radius;
            
            const endX = (Math.random() - 0.5) * 200;
            const endY = (Math.random() - 0.5) * 200;
            
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            particle.style.setProperty('--tx', endX + 'px');
            particle.style.setProperty('--ty', endY + 'px');
            
            container.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }, 50);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HeartLoader();
});