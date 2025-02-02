export type Language = 'en' | 'es';

export const translations = {
  en: {
    // Auth
    createAccount: 'Create Account',
    welcomeBack: 'Welcome Back',
    username: 'Username',
    password: 'Password',
    register: 'Register',
    login: 'Login',
    useFaceId: 'Use Face ID',
    usePassword: 'Use Password Instead',
    invalidCredentials: 'Invalid credentials',
    cannotAccessCamera: 'Cannot access camera',

    // Main App
    passwordManager: 'Password Manager',
    newPassword: 'New Password',
    logout: 'Logout',
    addNewPassword: 'Add New Password',
    editPassword: 'Edit Password',
    needStrongPassword: 'Need a Strong Password?',
    hidePasswordGenerator: 'Hide Password Generator',
    
    // Password Form
    title: 'Title',
    website: 'Website (optional)',
    savePassword: 'Save Password',
    updatePassword: 'Update Password',

    // Password Generator
    generateStrongPassword: 'Generate Strong Password',
    passwordLength: 'Password Length',
    uppercaseLetters: 'Uppercase Letters (A-Z)',
    lowercaseLetters: 'Lowercase Letters (a-z)',
    numbers: 'Numbers (0-9)',
    specialCharacters: 'Special Characters (!@#$...)',
    generatePassword: 'Generate Password',
    copyToClipboard: 'Copy to clipboard',
  },
  es: {
    // Auth
    createAccount: 'Crear Cuenta',
    welcomeBack: 'Bienvenido de Nuevo',
    username: 'Usuario',
    password: 'Contraseña',
    register: 'Registrarse',
    login: 'Iniciar Sesión',
    useFaceId: 'Usar Reconocimiento Facial',
    usePassword: 'Usar Contraseña',
    invalidCredentials: 'Credenciales inválidas',
    cannotAccessCamera: 'No se puede acceder a la cámara',

    // Main App
    passwordManager: 'Gestor de Contraseñas',
    newPassword: 'Nueva Contraseña',
    logout: 'Cerrar Sesión',
    addNewPassword: 'Agregar Nueva Contraseña',
    editPassword: 'Editar Contraseña',
    needStrongPassword: '¿Necesitas una Contraseña Segura?',
    hidePasswordGenerator: 'Ocultar Generador de Contraseñas',
    
    // Password Form
    title: 'Título',
    website: 'Sitio Web (opcional)',
    savePassword: 'Guardar Contraseña',
    updatePassword: 'Actualizar Contraseña',

    // Password Generator
    generateStrongPassword: 'Generar Contraseña Segura',
    passwordLength: 'Longitud de la Contraseña',
    uppercaseLetters: 'Letras Mayúsculas (A-Z)',
    lowercaseLetters: 'Letras Minúsculas (a-z)',
    numbers: 'Números (0-9)',
    specialCharacters: 'Caracteres Especiales (!@#$...)',
    generatePassword: 'Generar Contraseña',
    copyToClipboard: 'Copiar al portapapeles',
  }
};