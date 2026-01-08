(function (window) {
    let canvas, ctx, trailPoints = [];
    let isActive = false;

    // 配置
    const defaultConfig = {
        trailDuration: 300,    // 轨迹持续时间(ms)
        lineWidth: 3,          // 线宽
        shadowBlur: 9,         // 阴影模糊度
        rainbowEffect: true    // 是否启用彩虹色效果
    };

    let config = { ...defaultConfig };

    function createCanvas() {
        if (canvas) {
            canvas.remove();
        }

        canvas = document.createElement('canvas');
        canvas.id = 'universal-mouse-trail';

        Object.assign(canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            pointerEvents: 'none',
            zIndex: '999990',
            display: 'block'
        });

        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        resizeCanvas();
    }

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function handleMouseMove(event) {
        if (!isActive) return;

        const x = event.clientX;
        const y = event.clientY;
        trailPoints.push({ x, y, time: Date.now() });
    }

    function drawTrail() {
        if (!isActive || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const now = Date.now();

        for (let i = 0; i < trailPoints.length; i++) {
            const point = trailPoints[i];
            const age = now - point.time;

            if (age > config.trailDuration) {
                trailPoints.splice(i, 1);
                i--;
                continue;
            }

            const alpha = 1 - (age / (config.trailDuration * 5));

            let r, g, b;
            if (config.rainbowEffect) {
                const timeFactor = (now + age) / 500;
                r = Math.floor((Math.sin(timeFactor) + 1) * 127.5);
                g = Math.floor((Math.sin(timeFactor + 2 * Math.PI / 3) + 1) * 127.5);
                b = Math.floor((Math.sin(timeFactor + 4 * Math.PI / 3) + 1) * 127.5);
            } else {
                r = 255;
                g = 255;
                b = 255;
            }

            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.lineWidth = config.lineWidth;
            ctx.lineCap = 'round';
            ctx.shadowBlur = config.shadowBlur;
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;

            ctx.beginPath();
            if (i > 0) {
                const prevPoint = trailPoints[i - 1];
                ctx.moveTo(prevPoint.x, prevPoint.y);
                ctx.lineTo(point.x, point.y);
            } else {
                ctx.moveTo(point.x, point.y);
            }
            ctx.stroke();
        }

        requestAnimationFrame(drawTrail);
    }

    const MouseTrail = {
        init(customConfig = {}) {
            config = { ...config, ...customConfig };

            createCanvas();
            isActive = true;

            window.addEventListener('resize', resizeCanvas);
            document.addEventListener('mousemove', handleMouseMove);

            drawTrail();

            return this;
        },

        updateConfig(newConfig) {
            config = { ...config, ...newConfig };
            return this;
        },

        pause() {
            isActive = false;
            return this;
        },

        resume() {
            isActive = true;
            return this;
        },

        destroy() {
            isActive = false;
            trailPoints = [];

            window.removeEventListener('resize', resizeCanvas);
            document.removeEventListener('mousemove', handleMouseMove);

            if (canvas && canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
                canvas = null;
                ctx = null;
            }

            return this;
        }
    };

    window.MouseTrail = MouseTrail;
})(window);

MouseTrail.init()