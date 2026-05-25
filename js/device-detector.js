// ============================================
// DETECTOR INTELIGENTE DE DISPOSITIVOS
// Identifica el tipo de dispositivo, tamaño de pantalla,
// orientación y capacidades para aplicar clases CSS específicas.
// ============================================

(function() {
    'use strict';

    // Objeto con información del dispositivo
    const DeviceInfo = {
        type: 'desktop',        // mobile | tablet | desktop | tv
        os: 'unknown',          // ios | android | windows | macos | linux
        browser: 'unknown',     // chrome | safari | firefox | edge | samsung
        orientation: 'landscape', // portrait | landscape
        touch: false,           // true | false
        pixelRatio: 1,          // DPR (Retina, etc.)
        screenWidth: 0,
        screenHeight: 0,
        viewportWidth: 0,
        viewportHeight: 0
    };

    // Detectar sistema operativo
    function detectOS() {
        const userAgent = navigator.userAgent.toLowerCase();
        const platform = navigator.platform.toLowerCase();

        if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
        if (/android/.test(userAgent)) return 'android';
        if (/win32|win64|windows/.test(platform)) return 'windows';
        if (/macintosh|mac os x/.test(platform)) return 'macos';
        if (/linux/.test(platform)) return 'linux';
        return 'unknown';
    }

    // Detectar navegador
    function detectBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (/edg/.test(userAgent)) return 'edge';
        if (/opr|opera/.test(userAgent)) return 'opera';
        if (/samsungbrowser/.test(userAgent)) return 'samsung';
        if (/chrome/.test(userAgent) && /chromium/.test(userAgent)) return 'chrome';
        if (/safari/.test(userAgent) && !/chrome/.test(userAgent)) return 'safari';
        if (/firefox/.test(userAgent)) return 'firefox';
        return 'unknown';
    }

    // Detectar tipo de dispositivo basado en pantalla y capacidades
    function detectDeviceType() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const pixelRatio = window.devicePixelRatio || 1;
        const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

        // TV o pantallas muy grandes
        if (width >= 1920 && pixelRatio <= 2) {
            return 'tv';
        }
        
        // Tablet: entre 768px y 1024px, o dispositivo táctil con pantalla mediana
        if ((width >= 768 && width < 1024) || 
            (touch && width >= 600 && width < 1366) ||
            (coarsePointer && width >= 768 && width < 1366)) {
            return 'tablet';
        }
        
        // Móvil: menos de 768px
        if (width < 768 || (touch && width < 600)) {
            return 'mobile';
        }
        
        return 'desktop';
    }

    // Detectar orientación
    function detectOrientation() {
        if (window.innerHeight > window.innerWidth) {
            return 'portrait';
        }
        return 'landscape';
    }

    // Actualizar información
    function updateDeviceInfo() {
        DeviceInfo.os = detectOS();
        DeviceInfo.browser = detectBrowser();
        DeviceInfo.type = detectDeviceType();
        DeviceInfo.orientation = detectOrientation();
        DeviceInfo.touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        DeviceInfo.pixelRatio = window.devicePixelRatio || 1;
        DeviceInfo.screenWidth = window.screen.width;
        DeviceInfo.screenHeight = window.screen.height;
        DeviceInfo.viewportWidth = window.innerWidth;
        DeviceInfo.viewportHeight = window.innerHeight;

        return DeviceInfo;
    }

    // Aplicar clases al body
    function applyDeviceClasses() {
        const body = document.body;
        const html = document.documentElement;
        
        // Limpiar clases anteriores
        body.classList.remove('device-mobile', 'device-tablet', 'device-desktop', 'device-tv');
        body.classList.remove('os-ios', 'os-android', 'os-windows', 'os-macos', 'os-linux');
        body.classList.remove('browser-chrome', 'browser-safari', 'browser-firefox', 'browser-edge', 'browser-samsung');
        body.classList.remove('orientation-portrait', 'orientation-landscape');
        body.classList.remove('touch-device', 'no-touch');
        body.classList.remove('retina', 'non-retina');
        
        // Aplicar nuevas clases
        body.classList.add(`device-${DeviceInfo.type}`);
        body.classList.add(`os-${DeviceInfo.os}`);
        body.classList.add(`browser-${DeviceInfo.browser}`);
        body.classList.add(`orientation-${DeviceInfo.orientation}`);
        
        if (DeviceInfo.touch) {
            body.classList.add('touch-device');
        } else {
            body.classList.add('no-touch');
        }
        
        if (DeviceInfo.pixelRatio >= 2) {
            body.classList.add('retina');
        } else {
            body.classList.add('non-retina');
        }

        // Guardar en data attributes para CSS
        html.setAttribute('data-device', DeviceInfo.type);
        html.setAttribute('data-os', DeviceInfo.os);
        html.setAttribute('data-orientation', DeviceInfo.orientation);
    }

    // Mostrar información en consola (solo en desarrollo)
    function logDeviceInfo() {
        console.log('%c📱 Device Detector', 'font-size: 16px; font-weight: bold; color: #00d4aa;');
        console.table(DeviceInfo);
    }

    // Inicializar
    function init() {
        updateDeviceInfo();
        applyDeviceClasses();
        
        // Solo mostrar en consola si no es producción (opcional)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            logDeviceInfo();
        }

        // Escuchar cambios de tamaño
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const oldType = DeviceInfo.type;
                const oldOrientation = DeviceInfo.orientation;
                
                updateDeviceInfo();
                applyDeviceClasses();
                
                // Disparar evento personalizado si cambió el tipo de dispositivo
                if (oldType !== DeviceInfo.type || oldOrientation !== DeviceInfo.orientation) {
                    window.dispatchEvent(new CustomEvent('deviceChanged', {
                        detail: { ...DeviceInfo }
                    }));
                }
            }, 250); // Debounce de 250ms
        });

        // Escuchar cambios de orientación en móviles
        if (screen.orientation) {
            screen.orientation.addEventListener('change', () => {
                setTimeout(() => {
                    updateDeviceInfo();
                    applyDeviceClasses();
                }, 100);
            });
        }
    }

    // Exponer API global
    window.DeviceDetector = {
        getInfo: () => ({ ...DeviceInfo }),
        refresh: () => {
            updateDeviceInfo();
            applyDeviceClasses();
            return { ...DeviceInfo };
        },
        isMobile: () => DeviceInfo.type === 'mobile',
        isTablet: () => DeviceInfo.type === 'tablet',
        isDesktop: () => DeviceInfo.type === 'desktop',
        isTV: () => DeviceInfo.type === 'tv',
        isTouch: () => DeviceInfo.touch,
        isPortrait: () => DeviceInfo.orientation === 'portrait'
    };

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();