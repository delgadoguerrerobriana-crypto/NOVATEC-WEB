document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // INICIALIZAR AOS (Animate On Scroll)
    // Biblioteca que hace que los elementos aparezcan
    // con animaciones suaves al bajar la pagina.
    // ============================================
    AOS.init({
        duration: 800,              // Duracion de cada animacion (ms)
        easing: 'ease-out-cubic',   // Tipo de movimiento suave
        once: true,                 // Animar solo una vez
        offset: 100                 // Distancia antes de activar
    });

    // ============================================
    // PANTALLA DE CARGA (Loading Screen)
    // Se oculta automaticamente despues de 2.5 segundos
    // para dar tiempo a que todo cargue.
    // ============================================
    const loadingScreen = document.getElementById('loadingScreen');

    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 2500);

    // ============================================
    // SCROLL SUAVE PARA TODOS LOS ENLACES INTERNOS
    // ============================================
    function smoothScrollTo(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Calcular posicion considerando la altura de la navbar
            const navbarHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

            // Desplazamiento suave
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Aplicar a todos los enlaces que tienen data-scroll
    document.querySelectorAll('a[data-scroll]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();  // Evitar recarga de pagina
            const targetId = this.getAttribute('href');

            // Si es un enlace interno (#seccion), hacer scroll suave
            if (targetId.startsWith('#')) {
                smoothScrollTo(targetId);

                // Si el menu movil esta abierto, cerrarlo
                const navMenu = document.getElementById('navMenu');
                const navToggle = document.getElementById('navToggle');
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.querySelector('i').classList.remove('fa-times');
                    navToggle.querySelector('i').classList.add('fa-bars');
                }

                // Actualizar el enlace activo en el menu
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                if (this.classList.contains('nav-link')) {
                    this.classList.add('active');
                }
            }
        });
    });

    // El logo tambien lleva al inicio con scroll suave
    document.querySelector('.nav-logo')?.addEventListener('click', function(e) {
        e.preventDefault();
        smoothScrollTo('#inicio');
    });

    // ============================================
    // NAVEGACION MOVIL (Menu Hamburguesa)
    // En celulares, el menu se oculta y aparece
    // un boton de tres lineas (hamburguesa).
    // ============================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');

        // Cambiar icono: barras -> X cuando esta abierto
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // ============================================
    // NAVEGACION ACTIVA AL HACER SCROLL
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY + 150;

        // Detectar que seccion esta visible
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // Resaltar el enlace correspondiente
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ============================================
    // NAVBAR CON EFECTO AL SCROLL
    // Cuando el usuario baja mas de 50px, la navbar
    // cambia de transparente a oscura con blur.
    // ============================================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ============================================
    // BOTON VOLVER ARRIBA
    // ============================================
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================
    // AUDIO AMBIENTAL
    // Control para activar/desactivar sonido de fondo.
    // El usuario debe hacer clic manualmente para activarlo.
    // ============================================
    const ambientAudio = document.getElementById('ambientAudio');
    const audioBtn = document.getElementById('audioBtn');
    const audioIcon = document.getElementById('audioIcon');
    let isAudioPlaying = false;

    // Configurar volumen medio alto para que se escuche bien pero no moleste
    if (ambientAudio) {
        ambientAudio.volume = 0.70;
    }

    audioBtn.addEventListener('click', () => {
        if (isAudioPlaying) {
            // Pausar audio
            ambientAudio.pause();
            audioIcon.classList.remove('fa-volume-up');
            audioIcon.classList.add('fa-volume-mute');
            audioBtn.classList.remove('active');
            isAudioPlaying = false;
        } else {
            // Reproducir audio
            ambientAudio.play().then(() => {
                audioIcon.classList.remove('fa-volume-mute');
                audioIcon.classList.add('fa-volume-up');
                audioBtn.classList.add('active');
                isAudioPlaying = true;
            }).catch(error => {
                console.log('Error al reproducir audio:', error);
            });
        }
    });

    // ============================================
    // VIDEO DE FONDO DEL HERO
    // Se reproduce automaticamente y se pausa
    // cuando el usuario no esta viendo la seccion
    // para ahorrar recursos del navegador.
    // ============================================
    const bgVideo = document.getElementById('bgVideo');

    if (bgVideo) {
        // Intentar reproducir al cargar
        bgVideo.play().catch(error => {
            console.log('Autoplay prevented:', error);
        });

        // Observador: pausar cuando no es visible
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bgVideo.play();
                } else {
                    bgVideo.pause();
                }
            });
        }, { threshold: 0.1 });

        videoObserver.observe(bgVideo);
    }

    // ============================================
    // PARTICULAS ANIMADAS EN CANVAS
    // Version optimizada segun el dispositivo detectado
    // ============================================
    const canvas = document.getElementById('particlesCanvas');

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        let isActive = true;

        // Configuracion segun dispositivo
        function getParticleConfig() {
            const isMobile = window.DeviceDetector?.isMobile?.() || window.innerWidth < 768;
            const isTablet = window.DeviceDetector?.isTablet?.() || (window.innerWidth >= 768 && window.innerWidth < 1024);
            const isLowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
            
            if (isMobile || isLowPower) {
                return {
                    count: 25,           // Menos particulas en moviles
                    connectionDist: 80,  // Distancia de conexion menor
                    speed: 0.3,          // Velocidad reducida
                    size: { min: 0.5, max: 2 }
                };
            } else if (isTablet) {
                return {
                    count: 40,
                    connectionDist: 90,
                    speed: 0.4,
                    size: { min: 0.5, max: 2.5 }
                };
            } else {
                return {
                    count: 60,           // Maximo en desktop
                    connectionDist: 100,
                    speed: 0.5,
                    size: { min: 0.5, max: 3 }
                };
            }
        }

        let config = getParticleConfig();

        // Ajustar tamano del canvas
        function resizeCanvas() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limitar DPR para rendimiento
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ctx.scale(dpr, dpr);
        }

        resizeCanvas();

        // Recalcular configuracion en resize
        window.addEventListener('resize', () => {
            config = getParticleConfig();
            resizeCanvas();
            initParticles();
        });

        // Clase Particle optimizada
        class Particle {
            constructor() {
                const w = window.innerWidth;
                const h = window.innerHeight;
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * (config.size.max - config.size.min) + config.size.min;
                this.speedX = (Math.random() - 0.5) * config.speed;
                this.speedY = (Math.random() - 0.5) * config.speed;
                this.opacity = Math.random() * 0.4 + 0.2;
            }

            update() {
                const w = window.innerWidth;
                const h = window.innerHeight;
                
                this.x += this.speedX;
                this.y += this.speedY;

                // Rebotar en los bordes en lugar de reaparecer (mejor rendimiento)
                if (this.x < 0 || this.x > w) this.speedX *= -1;
                if (this.y < 0 || this.y > h) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 170, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < config.count; i++) {
                particles.push(new Particle());
            }
        }

        // Conectar particulas cercanas (optimizado)
        function connectParticles() {
            const maxDist = config.connectionDist;
            const maxDistSq = maxDist * maxDist;
            
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < maxDistSq) {
                        const dist = Math.sqrt(distSq);
                        const opacity = 0.15 * (1 - dist / maxDist);
                        
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 212, 170, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Bucle de animacion con control de FPS
        let lastTime = 0;
        const targetFPS = window.DeviceDetector?.isMobile?.() ? 30 : 60;
        const frameInterval = 1000 / targetFPS;

        function animateParticles(currentTime) {
            if (!isActive) return;
            
            animationId = requestAnimationFrame(animateParticles);
            
            const deltaTime = currentTime - lastTime;
            if (deltaTime < frameInterval) return;
            
            lastTime = currentTime - (deltaTime % frameInterval);
            
            const w = window.innerWidth;
            const h = window.innerHeight;
            
            ctx.clearRect(0, 0, w, h);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            connectParticles();
        }

        initParticles();
        animateParticles(0);

        // Pausar cuando no es visible (IntersectionObserver)
        const heroSection = document.querySelector('.hero');
        if (heroSection && 'IntersectionObserver' in window) {
            const particlesObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isActive = entry.isIntersecting;
                    if (isActive && !animationId) {
                        animateParticles(0);
                    }
                });
            }, { threshold: 0.05 });

            particlesObserver.observe(heroSection);
        }

        // Pausar cuando la pestana no esta activa
        document.addEventListener('visibilitychange', () => {
            isActive = document.visibilityState === 'visible';
            if (isActive && !animationId) {
                animateParticles(0);
            }
        });
    }
    
    // ============================================
    // NOTIFICACIONES PERSONALIZADAS
    // Muestra mensajes tipo "toast" en la esquina
    // superior derecha en lugar de alerts feos.
    // Se cierra automaticamente despues de 5 seg.
    // ============================================
    function showNotification(title, message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <div>
                    <h4>${title}</h4>
                    <p>${message}</p>
                </div>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;

        // Estilos inline para la notificacion
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #00d4aa, #00b894)' : 'linear-gradient(135deg, #1a3a5c, #0a1628)'};
            color: white;
            padding: 20px 25px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 5000;
            display: flex;
            align-items: center;
            gap: 15px;
            max-width: 400px;
            animation: slideInRight 0.5s ease;
        `;

        document.body.appendChild(notification);

        // Boton para cerrar manualmente
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        });

        // Cerrar automaticamente despues de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.5s ease forwards';
                setTimeout(() => notification.remove(), 500);
            }
        }, 5000);
    }

    // Agregar keyframes de animacion para notificaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .notification-content i {
            font-size: 1.5rem;
        }
        .notification-content h4 {
            margin: 0 0 5px 0;
            font-size: 1rem;
        }
        .notification-content p {
            margin: 0;
            font-size: 0.85rem;
            opacity: 0.9;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1rem;
            padding: 5px;
            opacity: 0.7;
            transition: opacity 0.3s;
        }
        .notification-close:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);


    // ============================================
    // CONTADOR ANIMADO PARA ESTADISTICAS
    // Los numeros suben desde 0 hasta su valor final
    // cuando la seccion "Nosotros" se hace visible.
    // ============================================
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');

                statNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    const suffix = stat.textContent.replace(/[0-9]/g, '');
                    let current = 0;
                    const increment = target / 50;  // Velocidad de conteo

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            stat.textContent = target + suffix;
                            clearInterval(timer);
                        } else {
                            stat.textContent = Math.floor(current) + suffix;
                        }
                    }, 30);
                });

                // Dejar de observar despues de animar una vez
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.about-stats');
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }

    // ============================================
    // MODAL DEL ORGANIGRAMA
    // Ventana emergente que muestra la imagen del
    // organigrama. Se abre con un boton y se cierra
    // con X, clic fuera, o tecla Escape.
    // ============================================
    const organigramaBtn = document.getElementById('organigramaBtn');
    const organigramaModal = document.getElementById('organigramaModal');
    const modalClose = document.getElementById('modalClose');

    if (organigramaBtn && organigramaModal) {
        // Abrir modal
        organigramaBtn.addEventListener('click', () => {
            organigramaModal.classList.add('active');
            document.body.style.overflow = 'hidden';  // Bloquear scroll
        });

        // Cerrar con boton X
        modalClose.addEventListener('click', () => {
            organigramaModal.classList.remove('active');
            document.body.style.overflow = '';  // Restaurar scroll
        });

        // Cerrar al hacer clic fuera del contenido
        organigramaModal.addEventListener('click', (e) => {
            if (e.target === organigramaModal) {
                organigramaModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && organigramaModal.classList.contains('active')) {
                organigramaModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // LIGHTBOX PARA PORTAFOLIO E IDENTIDAD
    // Visor de imagenes en pantalla completa.
    // Permite navegar entre imagenes con flechas
    // o teclado (<- ->).
    // ============================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentImageIndex = 0;
    const allLightboxImages = [];

    // Recopilar todas las imagenes del portafolio e identidad
    document.querySelectorAll('.portfolio-item, .identity-card').forEach((item) => {
        const img = item.querySelector('img');
        const title = item.querySelector('h3')?.textContent || '';
        if (img) {
            allLightboxImages.push({
                src: img.src,
                title: title
            });
        }
    });

    // Funcion global para abrir el lightbox
    window.openLightbox = function(btn) {
        const item = btn.closest('.portfolio-item, .identity-card');
        const img = item.querySelector('img');
        const title = item.querySelector('h3')?.textContent || '';

        // Encontrar el indice de la imagen actual
        currentImageIndex = allLightboxImages.findIndex(p => p.src === img.src);
        if (currentImageIndex === -1) currentImageIndex = 0;

        lightboxImg.src = img.src;
        lightboxCaption.textContent = title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';  // Bloquear scroll
    };

    // Cerrar lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';  // Restaurar scroll
    }

    // Mostrar imagen por indice
    function showImage(index) {
        if (index < 0) index = allLightboxImages.length - 1;
        if (index >= allLightboxImages.length) index = 0;

        currentImageIndex = index;
        lightboxImg.style.opacity = '0';

        setTimeout(() => {
            lightboxImg.src = allLightboxImages[index].src;
            lightboxCaption.textContent = allLightboxImages[index].title;
            lightboxImg.style.opacity = '1';
        }, 200);
    }

    // Eventos de navegacion
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => showImage(currentImageIndex - 1));
    lightboxNext.addEventListener('click', () => showImage(currentImageIndex + 1));

    // Cerrar al hacer clic fuera
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Navegacion con teclado
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
    });

    // ============================================
    // FLECHA INDICADORA DE SCROLL
    // Al hacer clic en la flecha del hero,
    // baja suavemente a la seccion academica.
    // ============================================
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            smoothScrollTo('#academico');
        });
    }

    // ============================================
    // EFECTO TYPEWRITER (Maquina de escribir)
    // El slogan se escribe letra por letra
    // como una maquina de escribir antigua.
    // ============================================
    const heroSlogan = document.querySelector('.hero-slogan');
    if (heroSlogan) {
        const originalText = heroSlogan.textContent;
        heroSlogan.textContent = '';

        let i = 0;
        function typeWriter() {
            if (i < originalText.length) {
                heroSlogan.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);  // Velocidad de escritura
            }
        }

        // Iniciar despues de 1.5 segundos
        setTimeout(typeWriter, 1500);
    }

    // ============================================
    // FORMULARIO DE CONTACTO CON EMAILJS (CORREGIDO)
    // ============================================
    
    // ============================================
    // VERIFICACION DE CONFIGURACION
    // ============================================
    const EMAILJS_PUBLIC_KEY = 'gPKCq5XVh1yTDZigc';
    const EMAILJS_SERVICE_ID = 'service_z8sgpqg';
    const EMAILJS_TEMPLATE_ID = 'template_6rn8lce'; // ← VERIFICA ESTE ID EN TU DASHBOARD
    
    // Verificar que EmailJS SDK esté cargado
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS SDK no está cargado. Revisa que el script esté en el HTML.');
    } else {
        console.log('✅ EmailJS SDK cargado correctamente');
    }

    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const formSuccess = document.getElementById('formSuccess');
    const newMessageBtn = document.getElementById('newMessageBtn');

    // Validacion de campos
    const validators = {
        nombre: (value) => {
            if (!value.trim()) return 'El nombre es obligatorio';
            if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'El nombre solo puede contener letras';
            return '';
        },
        email: (value) => {
            if (!value.trim()) return 'El correo es obligatorio';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Ingresa un correo valido';
            return '';
        },
        asunto: (value) => {
            if (!value.trim()) return 'El asunto es obligatorio';
            if (value.trim().length < 3) return 'El asunto debe tener al menos 3 caracteres';
            return '';
        },
        mensaje: (value) => {
            if (!value.trim()) return 'El mensaje es obligatorio';
            if (value.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres';
            if (value.trim().length > 1000) return 'El mensaje no puede exceder 1000 caracteres';
            return '';
        }
    };

    function validateField(field) {
        const fieldName = field.name;
        const value = field.value;
        const errorElement = document.getElementById(`error-${fieldName}`);
        const validator = validators[fieldName];
        
        if (validator) {
            const error = validator(value);
            if (error) {
                field.classList.add('is-error');
                field.classList.remove('is-success');
                errorElement.textContent = error;
                errorElement.classList.add('visible');
                return false;
            } else {
                field.classList.remove('is-error');
                field.classList.add('is-success');
                errorElement.textContent = '';
                errorElement.classList.remove('visible');
                return true;
            }
        }
        return true;
    }

    // Validacion en tiempo real
    document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('is-error')) {
                validateField(field);
            }
            if (field.id === 'mensaje') {
                updateCharCounter(field);
            }
        });
    });

    function updateCharCounter(textarea) {
        const counter = document.getElementById('charCounter');
        const length = textarea.value.length;
        const max = 1000;
        counter.textContent = `${length} / ${max}`;
        counter.classList.remove('warning', 'danger');
        if (length > max * 0.9) counter.classList.add('danger');
        else if (length > max * 0.8) counter.classList.add('warning');
    }

    // ============================================
    // FUNCION PARA ENVIAR EMAIL CON EMAILJS
    // Variables EXACTAS de tu plantilla "Contact Us":
    // {{from_name}}, {{from_email}}, {{subject}}, {{message}}, {{time}}
    // ============================================
    async function sendEmail(formData) {
        try {
            // Inicializar EmailJS
            emailjs.init(EMAILJS_PUBLIC_KEY);
            
            const templateParams = {
                from_name: formData.nombre,
                from_email: formData.email,
                subject: formData.asunto,
                message: formData.mensaje,
                time: new Date().toLocaleString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
            
            console.log('📧 Enviando email...');
            console.log('Service ID:', EMAILJS_SERVICE_ID);
            console.log('Template ID:', EMAILJS_TEMPLATE_ID);
            console.log('Parametros:', templateParams);
            
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            );
            
            console.log('✅ Email enviado exitosamente:', response);
            return { success: true, response };
            
        } catch (error) {
            console.error('❌ Error completo:', error);
            console.error('Status:', error.status);
            console.error('Text:', error.text);
            
            // Mensaje de error mas descriptivo
            let errorMsg = error.text || error.message || 'Error desconocido';
            
            if (errorMsg.includes('template ID not found')) {
                errorMsg = 'El ID de la plantilla no existe. Verifica en tu dashboard de EmailJS que el Template ID sea exactamente: ' + EMAILJS_TEMPLATE_ID;
            } else if (errorMsg.includes('service ID not found')) {
                errorMsg = 'El ID del servicio no existe. Verifica en tu dashboard de EmailJS que el Service ID sea exactamente: ' + EMAILJS_SERVICE_ID;
            } else if (errorMsg.includes('public key')) {
                errorMsg = 'La Public Key es incorrecta. Verifica tu cuenta de EmailJS.';
            }
            
            return { success: false, error: errorMsg };
        }
    }

    // Manejar envio del formulario
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const fields = contactForm.querySelectorAll('input, textarea');
        let isValid = true;
        
        fields.forEach(field => {
            if (!validateField(field)) isValid = false;
        });
        
        if (!isValid) {
            showNotification('Error', 'Por favor corrige los errores en el formulario', 'error');
            return;
        }
        
        const formData = {
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            asunto: document.getElementById('asunto').value.trim(),
            mensaje: document.getElementById('mensaje').value.trim()
        };
        
        // Mostrar estado de carga
        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-flex';
        
        const result = await sendEmail(formData);
        
        // Restaurar estado del boton
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-loading');
        btnText.style.display = 'inline-flex';
        btnLoader.style.display = 'none';
        
        if (result.success) {
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            showNotification('Mensaje Enviado', 'Tu mensaje ha sido enviado exitosamente. Te responderemos pronto.', 'success');
        } else {
            showNotification('Error al Enviar', result.error, 'error');
        }
    });

    // Boton para enviar nuevo mensaje
    if (newMessageBtn) {
        newMessageBtn.addEventListener('click', () => {
            contactForm.reset();
            document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
                field.classList.remove('is-error', 'is-success');
            });
            document.querySelectorAll('.form-error').forEach(error => {
                error.textContent = '';
                error.classList.remove('visible');
            });
            document.getElementById('charCounter').textContent = '0 / 1000';
            formSuccess.style.display = 'none';
            contactForm.style.display = 'block';
        });
    }

    // ============================================
    // MENSAJE EN CONSOLA
    // ============================================
    console.log('%c🚀 NovaTec Solutions', 'font-size: 24px; font-weight: bold; color: #00d4aa;');
    console.log('%c✅ Web cargada correctamente', 'font-size: 14px; color: #1a3a5c;');
    console.log('%c📦 Version 3.3 - Debug EmailJS', 'font-size: 12px; color: #6c757d;');
    console.log('%c🔧 Configuracion EmailJS:', 'font-size: 12px; font-weight: bold; color: #00d4aa;');
    console.log('   • Public Key:', EMAILJS_PUBLIC_KEY);
    console.log('   • Service ID:', EMAILJS_SERVICE_ID);
    console.log('   • Template ID:', EMAILJS_TEMPLATE_ID);
    console.log('%c⚠️  Si hay error "template ID not found", verifica en:', 'font-size: 12px; color: #e74c3c;');
    console.log('   https://dashboard.emailjs.com/admin/templates');
});