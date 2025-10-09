// Vulnerable user database - stored in client-side (FLAW #1: Client-side data storage)
const users = {
    'admin': {
        id: 1,
        username: 'admin',
        password: 'admin123', // FLAW #2: Weak default credentials
        email: 'admin@vulnauth.com',
        role: 'admin',
        balance: 50000,
        securityAnswer: 'blue' // FLAW #3: Predictable security questions
    },
    'user1': {
        id: 2,
        username: 'user1',
        password: 'password', // FLAW #4: Common weak passwords
        email: 'user1@email.com',
        role: 'user',
        balance: 1000,
        securityAnswer: 'red'
    },
    'john': {
        id: 3,
        username: 'john',
        password: '12345', // FLAW #5: Extremely weak password
        email: 'john@email.com',
        role: 'user',
        balance: 2500,
        securityAnswer: 'green'
    },
    'guest': {
        id: 4,
        username: 'guest',
        password: 'guest', // FLAW #6: Username = Password
        email: 'guest@email.com',
        role: 'user',
        balance: 100,
        securityAnswer: 'yellow'
    }
};

let currentSession = null;
let loginAttempts = 0; // FLAW #7: No proper rate limiting

// Navigation functions
function showLogin() {
    hideAllSections();
    document.getElementById('loginSection').style.display = 'block';
}

function showRegister() {
    hideAllSections();
    document.getElementById('registerSection').style.display = 'block';
}

function showReset() {
    hideAllSections();
    document.getElementById('resetSection').style.display = 'block';
}

function hideAllSections() {
    const sections = ['loginSection', 'registerSection', 'resetSection', 'dashboardSection'];
    sections.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
}

// FLAW #8: Insecure session management
function createSession(user) {
    // Session token is just the username (highly insecure)
    currentSession = {
        token: user.username, // FLAW: Predictable session tokens
        user: user,
        timestamp: Date.now()
    };
    
    // Store session in localStorage (FLAW #9: Client-side session storage)
    localStorage.setItem('authSession', JSON.stringify(currentSession));
}

// FLAW #10: No session validation
function validateSession() {
    const stored = localStorage.getItem('authSession');
    if (stored) {
        currentSession = JSON.parse(stored);
        return true;
    }
    return false;
}

// Login functionality with multiple flaws
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // FLAW #11: No input validation/sanitization
    // FLAW #12: Case-insensitive username matching
    const normalizedUsername = username.toLowerCase();
    
    let user = null;
    for (let key in users) {
        if (users[key].username.toLowerCase() === normalizedUsername) {
            user = users[key];
            break;
        }
    }
    
    loginAttempts++;
    
    // FLAW #13: Detailed error messages reveal user existence
    if (!user) {
        showMessage('error', 'User "' + username + '" does not exist in our system');
        return;
    }
    
    // FLAW #14: Plain text password comparison (no hashing)
    if (user.password !== password) {
        showMessage('error', 'Incorrect password for user "' + username + '"');
        
        // FLAW #15: No account lockout after failed attempts
        if (loginAttempts > 3) {
            showMessage('error', 'Multiple failed attempts detected, but login is still allowed!');
        }
        return;
    }
    
    // Successful login
    createSession(user);
    showDashboard(user);
    showMessage('success', 'Login successful! Welcome ' + user.username);
});

// Registration with flaws
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    // FLAW #16: No password strength validation
    // FLAW #17: No duplicate username checking
    
    const newUser = {
        id: Object.keys(users).length + 1,
        username: username,
        password: password, // FLAW #18: Password stored in plain text
        email: email,
        role: 'user',
        balance: 1000,
        securityAnswer: 'blue' // FLAW #19: Default security answer
    };
    
    // FLAW #20: Admin privilege escalation through parameter manipulation
    // If username contains 'admin', make them admin
    if (username.toLowerCase().includes('admin')) {
        newUser.role = 'admin';
        newUser.balance = 10000;
        showMessage('success', 'Admin account created! You have elevated privileges.');
    }
    
    users[username] = newUser;
    showMessage('success', 'Registration successful! You can now login.');
    showLogin();
});

// Password reset with major flaws
document.getElementById('resetForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('resetUsername').value;
    const answer = document.getElementById('securityQuestion').value;
    
    const user = users[username];
    
    if (!user) {
        showMessage('error', 'Username not found');
        return;
    }
    
    // FLAW #21: Case-insensitive security answer (easier to guess)
    if (user.securityAnswer.toLowerCase() === answer.toLowerCase()) {
        // FLAW #22: Display password in plain text
        showMessage('success', 'Password reset successful! Your password is: ' + user.password);
        
        // FLAW #23: Automatic login after reset (no re-authentication)
        createSession(user);
        showDashboard(user);
    } else {
        showMessage('error', 'Incorrect security answer');
    }
});

// Dashboard functionality
function showDashboard(user) {
    hideAllSections();
    document.getElementById('dashboardSection').style.display = 'block';
    document.getElementById('currentUser').textContent = user.username;
    document.getElementById('userId').textContent = user.id;
    document.getElementById('balance').textContent = user.balance.toFixed(2);
    
    // FLAW #24: Role-based access control bypass
    if (user.role === 'admin' || user.username.includes('admin') || user.id == 1) {
        document.getElementById('adminPanel').style.display = 'block';
    }
}

// FLAW #25: Insecure Direct Object Reference (IDOR)
function viewProfile() {
    const profileSection = document.getElementById('profileSection');
    const profileData = document.getElementById('profileData');
    
    // FLAW #26: No authorization check - can view any user's profile
    const userId = prompt('Enter User ID to view (1-4):');
    
    if (userId) {
        let targetUser = null;
        for (let key in users) {
            if (users[key].id == userId) {
                targetUser = users[key];
                break;
            }
        }
        
        if (targetUser) {
            // FLAW #27: Exposing sensitive information
            profileData.innerHTML = `
                <p><strong>Username:</strong> ${targetUser.username}</p>
                <p><strong>Password:</strong> ${targetUser.password}</p>
                <p><strong>Email:</strong> ${targetUser.email}</p>
                <p><strong>Role:</strong> ${targetUser.role}</p>
                <p><strong>Balance:</strong> $${targetUser.balance}</p>
                <p><strong>Security Answer:</strong> ${targetUser.securityAnswer}</p>
            `;
            profileSection.style.display = 'block';
        } else {
            showMessage('error', 'User not found');
        }
    }
}

// Profile update with flaws
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newEmail = document.getElementById('newEmail').value;
    
    // FLAW #28: No session validation for profile updates
    // FLAW #29: Can modify any user's profile without proper authorization
    const userId = prompt('Enter User ID to update:');
    
    if (userId && users) {
        for (let key in users) {
            if (users[key].id == userId) {
                users[key].email = newEmail;
                showMessage('success', 'Profile updated for user ID: ' + userId);
                break;
            }
        }
    }
});

// Admin functions with severe flaws
function viewAllUsers() {
    const usersList = document.getElementById('usersList');
    
    // FLAW #30: No proper admin authentication check
    if (!currentSession) {
        showMessage('error', 'Not logged in');
        return;
    }
    
    // FLAW #31: Admin check can be bypassed easily
    if (currentSession.user.role !== 'admin' && !confirm('You are not admin. Proceed anyway?')) {
        return;
    }
    
    let html = '<h4>All Users Database:</h4>';
    for (let key in users) {
        const user = users[key];
        html += `
            <div style="border: 1px solid #ddd; padding: 10px; margin: 5px 0;">
                <strong>ID:</strong> ${user.id} |
                <strong>Username:</strong> ${user.username} |
                <strong>Password:</strong> ${user.password} |
                <strong>Email:</strong> ${user.email} |
                <strong>Role:</strong> ${user.role} |
                <strong>Balance:</strong> $${user.balance}
            </div>
        `;
    }
    
    usersList.innerHTML = html;
}

// Password change with flaws
function changePassword() {
    // FLAW #32: No current password verification
    const newPassword = prompt('Enter new password:');
    
    if (newPassword) {
        // FLAW #33: No password strength requirements
        if (currentSession && currentSession.user) {
            currentSession.user.password = newPassword;
            
            // Update in the users database
            users[currentSession.user.username].password = newPassword;
            
            showMessage('success', 'Password changed successfully!');
        }
    }
}

// Logout function
function logout() {
    // FLAW #34: Session not properly invalidated
    currentSession = null;
    localStorage.removeItem('authSession');
    showLogin();
    showMessage('success', 'Logged out successfully');
}

// Utility function for messages
function showMessage(type, message) {
    // Remove existing messages
    const existingMsg = document.querySelector('.error, .success');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    const msgDiv = document.createElement('div');
    msgDiv.className = type;
    msgDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(msgDiv, container.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (msgDiv.parentNode) {
            msgDiv.remove();
        }
    }, 5000);
}

// FLAW #35: Automatic session restoration without validation
window.addEventListener('load', function() {
    if (validateSession()) {
        showDashboard(currentSession.user);
        showMessage('success', 'Session restored for: ' + currentSession.user.username);
    } else {
        showLogin();
    }
});

// FLAW #36: Debug information exposed in console
console.log('VulnAuth Debug Info:');
console.log('Available users:', users);
console.log('Current session:', currentSession);

// FLAW #37: Global variables accessible from browser console
window.users = users;
window.currentSession = currentSession;
window.createAdminUser = function(username) {
    users[username] = {
        id: 999,
        username: username,
        password: 'admin',
        email: username + '@admin.com',
        role: 'admin',
        balance: 100000,
        securityAnswer: 'admin'
    };
    console.log('Admin user created:', username);
};