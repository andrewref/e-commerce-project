document.addEventListener('DOMContentLoaded', () => {
  // === DOM Elements ===
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  const welcomeMsg = document.getElementById('welcome-msg');
  const btnLogout = document.getElementById('btn-logout');
  const btnAdmin = document.getElementById('btn-admin');
  const btnLogin = document.getElementById('btn-login');
  const btnSignup = document.getElementById('btn-signup');
  const protectedSection = document.getElementById('protected');

  const ADMIN_SECRET = 'admin123'; // You can change this to a more secure admin code

  // === Storage Helpers ===
  const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));
  const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];

  const saveCurrentUser = (user) => localStorage.setItem('currentUser', JSON.stringify(user));
  const getCurrentUser = () => JSON.parse(localStorage.getItem('currentUser'));
  const logoutUser = () => localStorage.removeItem('currentUser');

  // === UI Logic ===
  function updateUIOnLogin(user) {
    welcomeMsg.textContent = `Hi, ${user.username}`;
    welcomeMsg.classList.remove('hidden');
    btnLogout.classList.remove('hidden');
    btnLogin?.classList.add('hidden');
    btnSignup?.classList.add('hidden');
    if (user.isAdmin) btnAdmin?.classList.remove('hidden');
    protectedSection?.classList.remove('hidden');
  }

  function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
  }

  // === Signup Handler ===
  signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const adminCode = document.getElementById('signup-admin-code').value.trim();

    if (!username || !email || !password) {
      alert('Please fill in all required fields.');
      return;
    }

    const users = getUsers();
    const exists = users.some(u => u.email === email || u.username === username);
    if (exists) {
      alert('User already exists with that username or email.');
      return;
    }

    const newUser = {
      username,
      email,
      password,
      isAdmin: adminCode === ADMIN_SECRET
    };

    users.push(newUser);
    saveUsers(users);
    saveCurrentUser(newUser);
    updateUIOnLogin(newUser);
    alert('Signup successful!');
    signupForm.reset();
  });

  // === Login Handler ===
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const usernameOrEmail = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    const users = getUsers();
    const user = users.find(
      u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
    );

    if (!user) {
      alert('Invalid credentials');
      return;
    }

    saveCurrentUser(user);
    updateUIOnLogin(user);
    alert('Login successful!');
    loginForm.reset();
  });

  // === Logout Handler ===
  btnLogout?.addEventListener('click', () => {
    logoutUser();
    window.location.reload();
  });

  // === Auto-login on page load ===
  const currentUser = getCurrentUser();
  if (currentUser) {
    updateUIOnLogin(currentUser);
  }
});
