import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/LeaderboardAll.module.css';
import { BuildAllLeaderboard } from '../components/firebaseComponent';

export default function Leaderboard() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Samsung Arcade</title>
                <meta name='description' content='Samsung Arcade' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <BuildAllLeaderboard type='leaderboard' />
        </div>
    );
}
