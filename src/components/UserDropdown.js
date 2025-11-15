import styles from '../styles/UserDropdown.module.css';
import { useSelector } from 'react-redux';
import { selectAvailableUsersForImpersonation } from '../store/selectors';

function UserDropdown({ title, clickHandler, styleOverrides = {} }) {
    const availableUsers = useSelector(selectAvailableUsersForImpersonation);

    return (
        <div 
            className={styles.userDropdown} 
            role="menu"
            style={styleOverrides.container}
        >
            <div 
                className={styles.dropdownHeader}
                style={styleOverrides.header}
            >
                {title}
            </div>
            {availableUsers.map(user => (
                <button
                    key={user.id}
                    onClick={() => clickHandler(user.id)}
                    className={styles.userOption}
                    role="menuitem"
                    style={styleOverrides.option}
                >
                    <img
                        src={user.avatarURL}
                        alt=""
                        className={styles.miniAvatar}
                        style={styleOverrides.avatar}
                    />
                    <span>{user.name}</span>
                </button>
            ))}
        </div>
    );
}

export default UserDropdown;