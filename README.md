# VulnAuth - Authentication Flaws Demonstration

A deliberately vulnerable web application designed to demonstrate common authentication security flaws.

## ⚠️ WARNING
This application contains intentional security vulnerabilities and should **NEVER** be deployed in a production environment. It is designed solely for educational and security testing purposes.

## Authentication Vulnerabilities Demonstrated

### 1. **Weak Credentials & Password Management**
- Default admin credentials (`admin:admin123`)
- Common weak passwords (`password`, `12345`)
- Username equals password scenarios
- No password strength validation
- Plain text password storage
- Password displayed in reset functionality

### 2. **Session Management Flaws**
- Predictable session tokens (username-based)
- Client-side session storage
- No session validation
- No proper session invalidation
- Automatic session restoration without validation

### 3. **Authentication Bypass**
- Case-insensitive username matching
- No proper rate limiting on login attempts
- No account lockout mechanisms
- Admin privilege escalation through username manipulation
- Weak security questions with predictable answers

### 4. **Information Disclosure**
- Detailed error messages revealing user existence
- Sensitive data exposed in client-side code
- Debug information in browser console
- User database accessible from console
- Plain text password display

### 5. **Authorization Flaws**
- Insecure Direct Object Reference (IDOR)
- Missing authorization checks
- Role-based access control bypass
- Profile modification without proper verification
- Admin panel access through multiple vectors

### 6. **Client-Side Security Issues**
- User database stored client-side
- Authentication logic in JavaScript
- Global variables exposing sensitive data
- No server-side validation
- Complete trust in client-side data

## How to Use

1. **Open the application**: Open `index.html` in a web browser
2. **Try different attack vectors**:
   - Use default credentials: `admin`/`admin123`
   - Test weak passwords: `user1`/`password`, `john`/`12345`
   - Try username enumeration
   - Exploit password reset with security questions
   - Access developer console to see exposed data
   - Test privilege escalation by creating usernames with "admin"

## Test Credentials

| Username | Password | Role | Notes |
|----------|----------|------|-------|
| admin | admin123 | admin | Default admin account |
| user1 | password | user | Weak password |
| john | 12345 | user | Extremely weak password |
| guest | guest | user | Username = password |

## Security Questions (All users)
- **Question**: "What is your favorite color?"
- **Answers**: blue, red, green, yellow (predictable)

## Attack Scenarios

### Scenario 1: Credential Stuffing
Try common username/password combinations to gain unauthorized access.

### Scenario 2: Password Reset Abuse
Use the password reset feature with easily guessable security questions.

### Scenario 3: Privilege Escalation
Create a new account with "admin" in the username to gain elevated privileges.

### Scenario 4: Information Disclosure
Access the browser console to view the complete user database and session information.

### Scenario 5: IDOR Attack
Use the "View Profile" feature with different user IDs to access other users' data.

### Scenario 6: Session Hijacking
Manipulate localStorage to modify session data or impersonate other users.

## Educational Purpose

This application demonstrates why the following security practices are essential:

1. **Strong Authentication**:
   - Enforce strong password policies
   - Use secure password hashing (bcrypt, Argon2)
   - Implement multi-factor authentication

2. **Secure Session Management**:
   - Use cryptographically secure session tokens
   - Store sessions server-side
   - Implement proper session timeout and invalidation

3. **Proper Authorization**:
   - Validate user permissions on every request
   - Use proper access control mechanisms
   - Implement the principle of least privilege

4. **Input Validation**:
   - Validate and sanitize all user inputs
   - Implement rate limiting and account lockouts
   - Use generic error messages

5. **Secure Architecture**:
   - Keep sensitive logic server-side
   - Never trust client-side data
   - Minimize information disclosure

## Files Structure

```
├── index.html          # Main HTML interface
├── styles.css          # CSS styling
├── app.js             # JavaScript with vulnerabilities
└── README.md          # This documentation
```

## Learning Outcomes

After exploring this application, you should understand:

1. How authentication flaws can lead to complete system compromise
2. The importance of secure coding practices
3. Why client-side security controls are insufficient
4. How to identify and exploit common authentication vulnerabilities
5. Best practices for implementing secure authentication systems

## Disclaimer

This application is created for educational purposes only. The vulnerabilities demonstrated here are common real-world issues that developers should be aware of and avoid. Always follow secure coding practices and conduct proper security testing in your applications.

---

**Remember**: Security is not optional - it's essential! 🔒