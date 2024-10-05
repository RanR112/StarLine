const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const starArray = [];
const numberOfStars = 200;

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.brightness = Math.random();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        this.brightness = Math.sin(Date.now() * 0.001 * this.size) * 0.5 + 0.5;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createStars() {
    for (let i = 0; i < numberOfStars; i++) {
        starArray.push(new Star());
    }
}

function handleStars() {
    for (let i = 0; i < starArray.length; i++) {
        starArray[i].update();
        starArray[i].draw();

        const dx = mouse.x - starArray[i].x;
        const dy = mouse.y - starArray[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            for (let j = i + 1; j < starArray.length; j++) {
                const dx2 = starArray[i].x - starArray[j].x;
                const dy2 = starArray[i].y - starArray[j].y;
                const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                if (distance2 < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${(100 - distance2) / 200})`;
                    ctx.lineWidth = 0.2;
                    ctx.moveTo(starArray[i].x, starArray[i].y);
                    ctx.lineTo(starArray[j].x, starArray[j].y);
                    ctx.stroke();
                }
            }
        }
    }
}

const particleArray = [];
const mouse = {
    x: undefined,
    y: undefined,
};

canvas.addEventListener("click", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 2; i++) particleArray.push(new Particle());
});

canvas.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 2; i++) particleArray.push(new Particle());
});

class Particle {
    constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 7 + 1;
        this.speedX = Math.random() * 4 - 1.5;
        this.speedY = Math.random() * 4 - 1.5;
        this.color = "white";
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.25) this.size -= 0.1;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function handleParticles() {
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
        particleArray[i].draw();

        for (let j = i; j < particleArray.length; j++) {
            const dx = particleArray[i].x - particleArray[j].x;
            const dy = particleArray[i].y - particleArray[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.strokeStyle = particleArray[i].color;
                ctx.lineWidth = 0.2;
                ctx.moveTo(particleArray[i].x, particleArray[i].y);
                ctx.lineTo(particleArray[j].x, particleArray[j].y);
                ctx.stroke();
            }
        }

        for (let k = 0; k < starArray.length; k++) {
            const dx = particleArray[i].x - starArray[k].x;
            const dy = particleArray[i].y - starArray[k].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.strokeStyle = "rgba(255, 255, 255, " + (100 - dist) / 200 + ")";
                ctx.lineWidth = 0.2;
                ctx.moveTo(particleArray[i].x, particleArray[i].y);
                ctx.lineTo(starArray[k].x, starArray[k].y);
                ctx.stroke();
            }
        }

        if (particleArray[i].size <= 0.2) {
            particleArray.splice(i, 1);
            i--;
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleStars();
    handleParticles();
    requestAnimationFrame(animate);
}

createStars();
animate();

canvas.addEventListener("mousemove", (event) => {
    const mouseX = event.x;
    const mouseY = event.y;

    starArray.forEach(star => {
        const dx = mouseX - star.x;
        const dy = mouseY - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
            star.x += dx * 0.01;
            star.y += dy * 0.01;
        }
    });
});
