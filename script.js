const bird = document.getElementById('bird');
        const gameContainer = document.getElementById('game-container');
        const scoreElement = document.getElementById('score');
        const startScreen = document.getElementById('start-screen');

        let birdY = 300;
        let birdVelocity = 0;
        let gravity = 0.5;
        let isGameRunning = false;
        let score = 0;
        let pipes = [];
        let gameLoop;

        function startGame() {
            resetGame();
            isGameRunning = true;
            startScreen.style.display = 'none';
            gameLoop = setInterval(updateGame, 20);
            spawnPipe();
        }

        function resetGame() {
            birdY = 300;
            birdVelocity = 0;
            score = 0;
            scoreElement.textContent = score;
            pipes.forEach(pipe => pipe.remove());
            pipes = [];
            bird.style.transform = `translateY(${birdY}px)`;
        }

        function updateGame() {
            if (!isGameRunning) return;

            // Update bird position
            birdVelocity += gravity;
            birdY += birdVelocity;
            bird.style.transform = `translateY(${birdY}px) rotate(${birdVelocity * 3}deg)`;

            // Check collisions
            const birdRect = bird.getBoundingClientRect();
            const containerRect = gameContainer.getBoundingClientRect();

            if (birdY < 0 || birdY > containerRect.height - 30) {
                gameOver();
                return;
            }

            // Update pipes
            pipes.forEach((pipe, index) => {
                const pipeX = parseFloat(pipe.style.left);
                pipe.style.left = (pipeX - 2) + 'px';

                // Check pipe collision
                const pipeRect = pipe.getBoundingClientRect();
                if (
                    birdRect.right > pipeRect.left &&
                    birdRect.left < pipeRect.right &&
                    birdRect.bottom > pipeRect.top &&
                    birdRect.top < pipeRect.bottom
                ) {
                    gameOver();
                    return;
                }

                // Score points
                if (pipeX + 60 < birdRect.left && !pipe.scored) {
                    pipe.scored = true;
                    score++;
                    scoreElement.textContent = score;
                }

                // Remove off-screen pipes
                if (pipeX < -60) {
                    pipe.remove();
                    pipes.splice(index, 1);
                }
            });
        }

        function spawnPipe() {
            if (!isGameRunning) return;

            const gapHeight = 150;
            const gapY = Math.random() * (gameContainer.clientHeight - gapHeight - 100) + 50;

            const topPipe = document.createElement('div');
            topPipe.className = 'pipe';
            topPipe.style.height = gapY + 'px';
            topPipe.style.top = '0';
            topPipe.style.left = gameContainer.clientWidth + 'px';

            const bottomPipe = document.createElement('div');
            bottomPipe.className = 'pipe';
            bottomPipe.style.height = (gameContainer.clientHeight - gapY - gapHeight) + 'px';
            bottomPipe.style.bottom = '0';
            bottomPipe.style.left = gameContainer.clientWidth + 'px';

            gameContainer.appendChild(topPipe);
            gameContainer.appendChild(bottomPipe);
            pipes.push(topPipe, bottomPipe);

            setTimeout(spawnPipe, 3000);
        }

        function jump() {
            if (!isGameRunning) return;
            birdVelocity = -10;
        }

        function gameOver() {
            isGameRunning = false;
            clearInterval(gameLoop);
            startScreen.style.display = 'block';
            startScreen.querySelector('h1').textContent = 'Game Over!';
            startScreen.querySelector('p').textContent = `Score: ${score}`;
        }

        // Event listeners
        document.addEventListener('click', jump);
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') jump();
        });

        // Handle touch events for mobile
        document.addEventListener('touchstart', (e) => {
            e.preventDefault();
            jump();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (isGameRunning) {
                resetGame();
                gameOver();
            }
        });