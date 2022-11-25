window.addEventListener('load', function ()
{
    const canvas = document.getElementById("main-canvas");
    const canvasContext = canvas.getContext('2d');
    const mainImage = document.getElementById("main-img");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "absolute";

    class Pixel
    {
        constructor(effect, x, y, rgb)
        {
            this.effect = effect;
            this.x = Math.random() * this.effect.width;
            this.y = Math.random() * this.effect.height;
            this.size = this.effect.gap;
            this.originX = Math.floor(x);
            this.originY = Math.floor(y);
            this.rgb = rgb;
            this.px = Math.random() * 2 - 1;
            this.py = Math.random() * 2 - 1;
            this.ease = 0.07;
            this.dx = 0;
            this.dy = 0;
            this.distance = 0;
            this.force = 0;
            this.angle = 0;
            this.friction = 0.95;
        }
        draw(context)
        {
            context.fillStyle = this.rgb;
            context.fillRect(this.x, this.y, this.size, this.size);
        }
        update()
        {
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            this.distance = this.dx * this.dx + this.dy * this.dy;
            this.force = this.effect.mouse.radius / this.distance;

            if (this.distance < this.effect.mouse.radius)
            {
                this.angle = Math.atan2(this.dy, this.dx);
                this.px += this.force * Math.cos(this.angle);
                this.py += this.force * Math.sin(this.angle);
            }

            this.x += (this.px *= this.friction) + (this.originX - this.x) * this.ease;
            this.y += (this.py *= this.friction) + (this.originY - this.y) * this.ease;
        }
        warp()
        {
            this.x = Math.random() * this.effect.width;
            this.y = Math.random() * this.effect.height;
            this.ease = 0.05;
        }
    }

    class Effects
    {
        constructor(eWidth, eHeight)
        {
            this.width = eWidth;
            this.height = eHeight;
            this.particlesEffects = [];
            this.image = document.getElementById("main-img");
            this.centerX = this.width * 0.5;
            this.centerY = this.height * 0.5;
            this.x = this.centerX - this.image.width * 0.5;
            this.y = this.centerY - this.image.height * 0.5;
            this.gap = 2;
            this.mouse = {
                radius : 3000,
                x : undefined,
                y : undefined
            }
            window.addEventListener('mousemove', event => {
                this.mouse.x = event.x;
                this.mouse.y = event.y;
            });
        }
        init(context)
        {
            context.drawImage(this.image, this.x, this.y);
            const pixels = context.getImageData(0, 0, this.width, this.height).data;
            for (let y = 0; y < this.height; y += this.gap)
            {
                for (let x = 0; x < this.width; x += this.gap)
                {
                    const index = (y * this.width + x) * 4;
                    const r = pixels[index];
                    const g = pixels[index + 1];
                    const b = pixels[index + 2];
                    const op = pixels[index + 3];
                    const rgb = 'rgb(' + r + ',' + g + ',' + b + ')';

                    if (op > 0)
                    {
                        this.particlesEffects.push(new Pixel(this, x, y, rgb));
                    }
                }
            }
        }
        draw(context)
        {
            this.particlesEffects.forEach(particle => particle.draw(context));
        }
        update()
        {
            this.particlesEffects.forEach(particle => particle.update())
        }
        warp()
        {
            this.particlesEffects.forEach(particle => particle.warp())
        }
    }

    const effect = new Effects(canvas.width, canvas.height);
    effect.init(canvasContext);
    const createButton = document.getElementById('button-create');
    function animation()
    {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        effect.draw(canvasContext);
        effect.update();
        requestAnimationFrame(animation);
    }
    //animation();
    const warpButton = document.getElementById('button-warp');
    createButton.addEventListener('click', function() {
        animation();
    });
    warpButton.addEventListener('click', function() {
        effect.warp();
    });
});