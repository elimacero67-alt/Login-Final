import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, User, Key, Sparkles, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';

// --- Utility Functions ---
const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

// --- Shared Components ---

const HeaderIcon = ({ icon: Icon }: any) => (
  <div className="flex justify-center mb-6">
    <div className="p-4 bg-gradient-to-tr from-cyan-100 to-blue-50 rounded-2xl shadow-lg transform transition-transform hover:scale-105">
      <Icon className="w-10 h-10 text-cyan-600" />
    </div>
  </div>
);

const InputField = ({ icon: Icon, isPasswordVisible, showPasswordToggle, onTogglePassword, ...props }: any) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors duration-300" />
    </div>
    <input
      className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50/50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-white transition-all duration-300 shadow-sm hover:border-cyan-300"
      type={isPasswordVisible ? 'text' : props.type}
      {...props}
    />
    {showPasswordToggle && (
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-cyan-600 cursor-pointer transition-colors"
      >
        {isPasswordVisible ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    )}
  </div>
);

const Button = ({ children, isLoading, onClick, variant = 'primary', ...props }: any) => {
  const baseStyles = "w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 focus:ring-cyan-500 shadow-cyan-500/30 hover:shadow-cyan-500/50",
    secondary: "text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-400 shadow-sm",
    ghost: "text-cyan-600 hover:bg-cyan-50 focus:ring-cyan-200 shadow-none hover:shadow-sm"
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`${baseStyles} ${variants[variant as keyof typeof variants]}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Procesando...
        </span>
      ) : children}
    </button>
  );
};

// --- Views ---

const LoginView = ({ setView, onLogin }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(email) || !password) {
      setError('Por favor revisa tus credenciales.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);

    // Simulación de login
    setTimeout(() => {
      if (email === "demo@demo.com" && password === "Admin123!") {
        onLogin({ name: "Usuario Demo", email });
      } else {
        setError('Credenciales inválidas. (Tip: demo@demo.com / Admin123!)');
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: shake ? [-10, 10, -10, 10, 0] : 0 }} 
      exit={{ opacity: 0, x: 20 }}
      transition={{ x: { duration: 0.4 } }}
      className="w-full"
    >
      <HeaderIcon icon={LogIn} />

      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-fuchsia-600 tracking-tight">SAVIKA</h2>
        <p className="text-slate-500 mt-2 font-medium">Bienvenido de nuevo</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField 
          icon={Mail} 
          type="email" 
          placeholder="Correo Electrónico" 
          value={email} 
          onChange={(e: any) => setEmail(e.target.value)} 
        />
        <div className="space-y-1">
          <InputField 
            icon={Lock} 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e: any) => setPassword(e.target.value)}
            isPasswordVisible={showPass}
            showPasswordToggle
            onTogglePassword={() => setShowPass(!showPass)}
          />
          <div className="flex justify-end">
            <button 
              type="button"
              onClick={() => setView('recovery')} 
              className="text-xs text-fuchsia-600 hover:text-fuchsia-700 font-semibold hover:underline transition-colors mt-1"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-sm text-red-600"
          >
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </motion.div>
        )}

        <Button onClick={handleSubmit} isLoading={isLoading}>
          Iniciar Sesión <ArrowRight size={18} />
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-slate-500 text-sm">
          ¿No tienes cuenta?{' '}
          <button onClick={() => setView('register')} className="text-cyan-600 font-bold hover:underline">
            Regístrate ahora
          </button>
        </p>
      </div>
    </motion.div>
  );
};

const RegisterView = ({ setView }: any) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setView('login');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full"
    >
      <HeaderIcon icon={User} />
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Crear Cuenta</h2>
        <p className="text-slate-500 mt-2">Únete a SAVIKA hoy</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <InputField 
          icon={User} 
          type="text" 
          placeholder="Nombre Completo" 
          value={formData.name}
          onChange={(e: any) => setFormData({...formData, name: e.target.value})}
        />
        <InputField 
          icon={Mail} 
          type="email" 
          placeholder="Correo Electrónico"
          value={formData.email}
          onChange={(e: any) => setFormData({...formData, email: e.target.value})}
        />
        <InputField 
          icon={Lock} 
          type="password" 
          placeholder="Crear Contraseña"
          value={formData.password}
          onChange={(e: any) => setFormData({...formData, password: e.target.value})}
        />

        <Button onClick={handleRegister} isLoading={isLoading}>
          Registrarse <ArrowRight size={18} />
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <button 
          onClick={() => setView('login')} 
          className="flex items-center justify-center gap-2 w-full text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={16} /> Volver al inicio de sesión
        </button>
      </div>
    </motion.div>
  );
};

const RecoveryView = ({ setView }: any) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleRecovery = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full"
    >
      <HeaderIcon icon={Key} />
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Recuperar Acceso</h2>
        <p className="text-slate-500 mt-2">Te enviaremos las instrucciones</p>
      </div>

      {!isSent ? (
        <form onSubmit={handleRecovery} className="space-y-4">
          <InputField 
            icon={Mail} 
            type="email" 
            placeholder="Tu Correo Electrónico"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />

          <Button onClick={handleRecovery} isLoading={isLoading}>
            Enviar Instrucciones <ArrowRight size={18} />
          </Button>
        </form>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 bg-green-50 rounded-2xl border border-green-100"
        >
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-green-800 mb-2">¡Correo Enviado!</h3>
          <p className="text-green-600 text-sm">Revisa tu bandeja de entrada para restablecer tu contraseña.</p>
        </motion.div>
      )}

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <button 
          onClick={() => setView('login')} 
          className="flex items-center justify-center gap-2 w-full text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={16} /> Volver al inicio de sesión
        </button>
      </div>
    </motion.div>
  );
};

// --- Main App Component ---

const App = () => {
  const [view, setView] = useState('login'); // login, register, recovery
  const [user, setUser] = useState<any>(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-lg w-full"
        >
          <div className="w-20 h-20 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-cyan-200">
            <Sparkles className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2">¡Bienvenido!</h1>
          <p className="text-xl text-cyan-600 font-medium mb-8">{user.name}</p>
          <p className="text-slate-500 mb-8">Has iniciado sesión exitosamente en el sistema SAVIKA.</p>
          
          <Button onClick={() => setUser(null)} variant="secondary">
            Cerrar Sesión
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="w-full max-w-[440px] bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 relative overflow-hidden border border-white/50">
        
        {/* Background Decorative Elements inside Card */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-fuchsia-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <AnimatePresence mode="wait">
          {view === 'login' && (
            <LoginView 
              key="login"
              setView={setView} 
              onLogin={handleLogin} 
            />
          )}
          {view === 'register' && (
            <RegisterView
              key="register"
              setView={setView}
            />
          )}
          {view === 'recovery' && (
            <RecoveryView
              key="recovery"
              setView={setView}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;