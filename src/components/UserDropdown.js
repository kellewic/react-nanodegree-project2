import styles from '../styles/UserDropdown.module.css';
import { useSelector } from 'react-redux';
import { selectAvailableUsersForImpersonation } from '../store/selectors';

function UserDropdown({ title, clickHandler }) {
    const availableUsers = useSelector(selectAvailableUsersForImpersonation);

    return (
        <div className={styles.userDropdown} role="menu">
            <div className={styles.dropdownHeader}>{title}</div>
            {availableUsers.map(user => (
                <button
                    key={user.id}
                    onClick={() => clickHandler(user.id)}
                    className={styles.userOption}
                    role="menuitem"
                >
                    <img
                        src={user.avatarURL}
                        alt=""
                        className={styles.miniAvatar}
                    />
                    <span>{user.name}</span>
                </button>
            ))}
        </div>
    );
}

export default UserDropdown;