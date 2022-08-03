import Head from 'next/head';
import { useEffect, useState } from 'react';
import { router } from 'next/router';
import styles from '../styles/Game.module.css';
import TileMap from '../logic/TileMap';
import Fullscreen from '../components/fullscreen';
// import {
//     BuildLeaderboard,
// } from '../components/firebaseComponent';

let hiddenTimer;
let roundedScore;

let loseTime = true;
let loseTimeout;
let timesHit = 0;

export default function Game() {
    const [timer, setTimer] = useState(null);
    const [score, setScore] = useState(0);
    const [gameWon, setGameWon] = useState(false);
    const [highScore, setHighScore] = useState(null);

    useEffect(() => {
        hiddenTimer = 90;
        roundedScore = 0;
        const themeAudio = document.getElementById('theme-audio');
        const tileSize = 32;
        const velocity = 2;
        const canvas = document.getElementById('gameCanvas');
        canvas.style.height = `${window.innerHeight * 0.85}px`;
        const ctx = canvas.getContext('2d');
        const tileMap = new TileMap(tileSize);
        const pacman = tileMap.getPacman(velocity);
        const enemies = tileMap.getEnemies(velocity);
        let gameOver = false;
        let gameWin = false;
        const gameOverSound = new Audio('/sounds/gameOver.wav');
        const gameWinSound = new Audio('/sounds/gameWin.wav');
        let gameStarted = false;
        function gameLoop() {
            if (pacman.madeFirstMove && !gameStarted) {
                setTimer(hiddenTimer);
                gameStarted = true;
                themeAudio.play();
            }
            pacman.handleJoystickPlay();
            let addedScore =
                pacman.dotsEaten * 25 +
                pacman.iconsEaten * 200 +
                pacman.monstersEaten * 250;
            let rawScore;
            if (addedScore - timesHit * 500 >= 0) {
                rawScore = addedScore - timesHit * 500;
            } else {
                rawScore = 0;
                timesHit = 0;
                pacman.dotsEaten = 0;
                pacman.iconsEaten = 0;
                pacman.monstersEaten = 0;
            }
            roundedScore = Math.ceil(rawScore / 5) * 5;
            setScore(roundedScore);
            tileMap.draw(ctx);
            pacman.draw(ctx, pause(), enemies);
            enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
            if (isHit()) {
                const overlay = document.getElementById('overlay');
                if (loseTime) {
                    loseTime = false;
                    timesHit++;
                    if (overlay) {
                        overlay.style.opacity = 0.2;
                        setTimeout(() => (overlay.style.opacity = 0), 400);
                    }
                    loseTimeout = setTimeout(() => {
                        loseTime = true;
                    }, 2000);
                }
            }
            checkGameOver();
            checkGameWin();
        }
        function checkGameWin() {
            if (!gameWin) {
                gameWin = hiddenTimer <= 0;
                if (gameWin) {
                    const finishOverlay =
                        document.getElementById('finish-overlay');
                    const winPopup = document.getElementById('win-popup');
                    if (finishOverlay) finishOverlay.style.opacity = 0.8;
                    if (winPopup) winPopup.style.opacity = 1;
                    localStorage.setItem('score', roundedScore);
                    clearInterval(gameInterval);
                    setGameWon(true);
                    setTimeout(() => router.push('/over'), 2500);
                }
            }
        }
        function checkGameOver() {
            if (!gameOver) {
                gameOver = isGameOver();
                if (gameOver) {
                    const finishOverlay =
                        document.getElementById('finish-overlay');
                    const losePopup = document.getElementById('lose-popup');
                    if (finishOverlay) finishOverlay.style.opacity = 0.8;
                    if (losePopup) losePopup.style.opacity = 1;
                    localStorage.setItem('score', null);
                    setTimeout(() => router.push('/'), 2500);
                }
            }
        }
        function isGameOver() {
            return false;
        }
        function isHit() {
            return enemies.some(
                (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
            );
        }
        function pause() {
            return !pacman.madeFirstMove || gameOver || gameWin;
        }
        tileMap.setCanvasSize(canvas);
        const gameInterval = setInterval(gameLoop, 1000 / 75);
        return () => {
            clearTimeout(loseTimeout);
            clearInterval(gameInterval);
        };
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            if (timer && !gameWon) {
                if (hiddenTimer - 1 <= 0) {
                    hiddenTimer = 0;
                    setTimer(hiddenTimer);
                } else {
                    setTimer(hiddenTimer - 1);
                    hiddenTimer -= 1;
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);
    return (
        <div className={styles.container}>
            <Head>
                <title>Samsung Arcade</title>
                <meta name='description' content='Samsung Arcade' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <img src='/bg.svg' className={styles.bg}></img>
            <main>
                <div className={styles.time}>
                    <h4>TIME REMAINING</h4>
                    <h1>{timer ? timer : '90'}</h1>
                </div>
                <canvas id='gameCanvas'></canvas>
                <div className={styles.score}>
                    <h4>SCORE</h4>
                    <h1 className='yourScore'>{score}</h1>
                    <br />
                    <br />
                    <h4>HIGH SCORE</h4>
                    {/* <BuildLeaderboard type='highScore' /> */}
                </div>
            </main>
            <div className={styles.overlay} id='overlay'></div>
            <div className={styles.finishOverlay} id='finish-overlay'></div>
            <button
                className='progressButton'
                onClick={() => router.push('/over')}
            >
                Progress
            </button>
            <div
                className={`${styles.popup} ${styles.winPopup}`}
                id='win-popup'
            >
                <h1>GAME OVER</h1>
                <p>{`Score: ${score}`}</p>
            </div>
            <div
                className={`${styles.popup} ${styles.losePopup}`}
                id='lose-popup'
            >
                <h1>YOU LOST</h1>
            </div>
            <audio loop style={{ display: 'none' }} id='theme-audio'>
                <source src='/sounds/theme.mp3' type='audio/mpeg' />
            </audio>
            <Fullscreen />
        </div>
    );
}
