import { useEffect, useState } from 'react';
import styles from '../styles/SetTeam.module.css';

// import { fireBaseStartApp, setDevice } from './firebaseComponent';

export default function SetTeamInput() {
    const [showTeam, setShowTeam] = useState(false);
    const handleDropdown = (e, setShowTeam) => {
        e.preventDefault();
        setShowTeam(false);
        localStorage.setItem('team', e.target.value);
        // setDevice(e.target.value);
    };
    useEffect(() => {
        // fireBaseStartApp();
        const teamNumber = localStorage.getItem('team');
        if (teamNumber) {
            setShowTeam(false);
        } else {
            setShowTeam(true);
        }
        const selectForm = document.getElementById('teams');
        selectForm.value = teamNumber;
    }, []);
    return (
        <div className={styles.overlay} style={{ opacity: showTeam ? 1 : 0 }}>
            <div className={styles.container}>
                <h1>Choose your team.</h1>
                <select
                    name='teams'
                    id='teams'
                    onChange={(e) => handleDropdown(e, setShowTeam)}
                >
                    {/* <option value='1'>Team 1</option>
                    <option value='2'>Team 2</option> */}
                    <option value='1'>PRS Colleagues</option>
                    <option value='2'>Samsung HQ</option>
                </select>
            </div>
        </div>
    );
}
