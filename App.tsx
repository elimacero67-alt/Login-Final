import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Se carga la librería via Script tag en el useEffect para evitar errores de compilación
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Check, 
  Eye, 
  EyeOff, 
  LogOut, 
  ShieldCheck, 
  AlertCircle, 
  ChevronLeft, 
  Sparkles,
  LogIn,
  UserPlus,
  KeyRound,
  Contact,
  Database,
  Settings,
  X,
  Link as LinkIcon,
  Wifi,
  WifiOff
} from 'lucide-react';

// --- Fix for TS errors regarding window.supabase ---
declare global {
  interface Window {
    supabase: any;
  }
}

// --- Constantes por Defecto (Supabase) ---
const DEFAULT_SUPABASE_URL = 'https://hxwwosakghlxmknfgpni.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4d3dvc2FrZ2hseG1rbmZncG5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjQwODMsImV4cCI6MjA4NjUwMDA4M30.irZumKPpfVoY1wzm_Ux4o06KBKM6O_Pkda0LeiPgXvA';

// --- Utilitarios y Validaciones ---

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const checkPasswordStrength = (password: string) => {
  let score = 0;
  if (!password) return { score: 0, details: [] };

  const checks = [
    { regex: /.{8,}/, label: "Mínimo 8 caracteres" },
    { regex: /[A-Z]/, label: "Una mayúscula" },
    { regex: /[a-z]/, label: "Una minúscula" },
    { regex: /[0-9]/, label: "Un número" },
    { regex: /[^A-Za-z0-9]/, label: "Un símbolo especial" },
  ];

  const details = checks.map(check => ({
    label: check.label,
    met: check.regex.test(password)
  }));

  score = details.filter(d => d.met).length;

  return { score, details };
};

// --- Componentes UI Reutilizables ---

interface InputFieldProps {
  icon: any;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: any) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
  error?: string;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  isPasswordVisible?: boolean;
  disabled?: boolean;
}

const InputField = ({ 
  icon: Icon, 
  type, 
  placeholder, 
  value, 
  onChange, 
  onFocus, 
  onBlur, 
  error, 
  showPasswordToggle, 
  onTogglePassword, 
  isPasswordVisible,
  disabled = false
}: InputFieldProps) => (
  <div className="mb-4 group">
    <div className="relative flex items-center">
      {/* Icono a la izquierda perfectamente centrado */}
      <div className="absolute left-3 flex items-center justify-center pointer-events-none z-10 text-indigo-500/70 group-focus-within:text-indigo-600 transition-colors duration-300">
        <Icon size={20} />
      </div>
      <input
        type={isPasswordVisible ? "text" : type}
        disabled={disabled}
        className={`w-full pl-11 pr-10 py-3.5 bg-slate-50/50 border ${
          error 
            ? 'border-red-400 focus:ring-red-200 bg-red-50/10' 
            : 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-400'
        } rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 backdrop-blur-sm relative z-0 disabled:opacity-50 disabled:cursor-not-allowed`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 flex items-center justify-center z-10 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
    <AnimatePresence>
      {error && (
        <motion.p 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          exit={{ opacity: 0, height: 0 }}
          className="text-xs text-red-500 mt-1.5 ml-1 flex items-center gap-1 font-medium overflow-hidden"
        >
          <AlertCircle size={12} /> {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const { score, details } = checkPasswordStrength(password);
  
  const getColor = () => {
    if (score <= 2) return "bg-red-500";
    if (score === 3 || score === 4) return "bg-amber-400";
    return "bg-emerald-500";
  };

  const getWidth = () => {
    if (password.length === 0) return "w-0";
    return `${(score / 5) * 100}%`;
  };

  return (
    <div className="my-5 bg-white/60 backdrop-blur-md p-4 rounded-xl border border-white/40 shadow-sm">
      <div className="flex justify-between text-xs text-slate-500 mb-2">
        <span className="font-semibold">Fuerza de contraseña</span>
        <span className={`font-bold transition-colors duration-300 ${
          score === 5 ? 'text-emerald-600' : score > 2 ? 'text-amber-500' : 'text-slate-400'
        }`}>
          {score === 5 ? 'Excelente' : score > 2 ? 'Media' : 'Débil'}
        </span>
      </div>
      
      <div className="h-2 w-full bg-slate-200/70 rounded-full overflow-hidden mb-3">
        <motion.div 
          className={`h-full ${getColor()} shadow-sm`} 
          animate={{ width: getWidth(), backgroundColor: score <= 2 ? '#ef4444' : (score < 5 ? '#fbbf24' : '#10b981') }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
        {details.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <motion.div 
              initial={false}
              animate={{ 
                backgroundColor: item.met ? '#10b981' : 'transparent',
                borderColor: item.met ? '#10b981' : '#cbd5e1'
              }}
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-300`}
            >
              {item.met && <Check size={10} className="text-white" strokeWidth={4} />}
            </motion.div>
            <span className={`text-[11px] font-medium transition-colors duration-300 ${item.met ? 'text-slate-700' : 'text-slate-400'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ButtonProps {
  children: React.ReactNode;
  onClick: (e?: any) => void;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

const Button = ({ children, onClick, isLoading = false, variant = 'primary', className = '' }: ButtonProps) => {
  const baseStyle = "w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-[0.98]";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 border border-transparent",
    secondary: "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 shadow-sm",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={isLoading}
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className} ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
    >
      {isLoading ? (
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
          className="w-5 h-5 border-[2.5px] border-current border-t-transparent rounded-full"
        />
      ) : children}
    </button>
  );
};

const HeaderIcon = ({ icon: Icon }: { icon: any }) => (
  <div className="flex justify-center mb-6">
    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
      <Icon size={32} strokeWidth={1.5} />
    </div>
  </div>
);

// --- Componente de Barra Lateral (Configuración Supabase) ---

const ConfigSidebar = ({ onConnect, isConnected, connectionError }: { onConnect: any, isConnected: boolean, connectionError: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({ 
    url: DEFAULT_SUPABASE_URL, 
    key: DEFAULT_SUPABASE_KEY 
  });
  const [checking, setChecking] = useState(false);

  const handleConnect = async () => {
    setChecking(true);
    await onConnect(config.url, config.key);
    setChecking(false);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 left-4 z-50 p-3 rounded-full shadow-lg transition-colors ${
          isConnected ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-white'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={20} /> : (isConnected ? <Wifi size={20} /> : <Settings size={20} />)}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-80 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700 z-40 p-6 pt-20 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-6 text-white">
              <Database className="text-emerald-400" />
              <h3 className="font-bold text-lg">Configuración DB</h3>
            </div>

            <p className="text-slate-400 text-xs mb-6 leading-relaxed">
              Integra tu proyecto de <span className="text-emerald-400 font-bold">Supabase</span> para habilitar autenticación real.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Project URL</label>
                <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 focus-within:border-emerald-500 transition-colors">
                  <LinkIcon size={14} className="ml-3 text-slate-500" />
                  <input 
                    type="text" 
                    value={config.url}
                    onChange={(e) => setConfig({...config, url: e.target.value})}
                    placeholder="https://xyz.supabase.co"
                    className="w-full bg-transparent p-3 text-sm text-slate-200 focus:outline-none placeholder-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Anon API Key</label>
                <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 focus-within:border-emerald-500 transition-colors">
                  <KeyRound size={14} className="ml-3 text-slate-500" />
                  <input 
                    type="password" 
                    value={config.key}
                    onChange={(e) => setConfig({...config, key: e.target.value})}
                    placeholder="eyJh..."
                    className="w-full bg-transparent p-3 text-sm text-slate-200 focus:outline-none placeholder-slate-600"
                  />
                </div>
              </div>

              {connectionError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  {connectionError}
                </div>
              )}

              {isConnected && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <Wifi size={14} />
                  Conexión Exitosa
                </div>
              )}

              <button 
                onClick={handleConnect}
                disabled={checking}
                className={`w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  isConnected 
                    ? 'bg-slate-700 text-slate-300 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50'
                }`}
              >
                {checking ? 'Verificando...' : (isConnected ? 'Conectado' : 'Conectar Supabase')}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-600">
                Estado: {isConnected ? <span className="text-emerald-400 font-bold">Online</span> : <span className="text-amber-500 font-bold">Modo Demo</span>}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Vistas del Sistema ---

const LoginView = ({ setView, onLogin, supabaseClient, isSupabaseMode }: any) => {
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

    if (isSupabaseMode && supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) throw error;
        
        onLogin({ 
          name: data.user.user_metadata.full_name || email.split('@')[0], 
          email: data.user.email 
        });

      } catch (err: any) {
        setError('Credenciales incorrectas o usuario no encontrado.');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      } finally {
        setIsLoading(false);
      }
    } else {
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
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }} 
      animate={{ opacity: 1, x: shake ? [-10, 10, -10, 10, 0] : 0 }} 
      exit={{ opacity: 0, x: 50 }}
      transition={{ x: { duration: 0.4 } }}
      className="w-full"
    >
      <HeaderIcon icon={LogIn} />

      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">¡Bienvenido!</h2>
        <p className="text-slate-500 mt-2 font-medium">Inicia sesión para continuar</p>
        {isSupabaseMode && <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Modo Real</span>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-1">
        <InputField 
          icon={Mail} 
          type="email" 
          placeholder="Correo Electrónico" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <div className="space-y-1">
          <InputField 
            icon={Lock} 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            isPasswordVisible={showPass}
            showPasswordToggle
            onTogglePassword={() => setShowPass(!showPass)}
          />
          <div className="flex justify-end pr-1">
            <button 
              type="button"
              onClick={() => setView('recovery')} 
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-sm text-red-600 my-4"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}

        <div className="pt-4">
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Entrar a la Cuenta <ArrowRight size={18} />
          </Button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-slate-500 text-sm">
          ¿Aún no tienes cuenta?{' '}
          <button onClick={() => setView('register')} className="text-indigo-600 font-bold hover:underline">
            Crear cuenta gratis
          </button>
        </p>
      </div>
    </motion.div>
  );
};

const RegisterView = ({ setView, onLogin, supabaseClient, isSupabaseMode }: any) => {
  const [formData, setFormData] = useState({ name: '', surname: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showStrength, setShowStrength] = useState(false);
  const [shake, setShake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.surname) {
      setError('Por favor completa tu nombre y apellidos.');
      setShake(true); setTimeout(() => setShake(false), 500);
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Correo inválido.');
      setShake(true); setTimeout(() => setShake(false), 500);
      return;
    }
    
    const strength = checkPasswordStrength(formData.password);
    if (strength.score < 5) {
      setError('La contraseña es muy débil.');
      setShake(true); setTimeout(() => setShake(false), 500);
      setShowStrength(true); 
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setShake(true); setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);

    if (isSupabaseMode && supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: `${formData.name} ${formData.surname}`,
            },
          },
        });

        if (error) throw error;

        // Registrar en tabla de perfiles para permitir validación de existencia de correo en recuperación
        await supabaseClient.from('profiles').upsert({ email: formData.email });

        if (data.session) {
           onLogin({ name: `${formData.name} ${formData.surname}`, email: formData.email });
        } else {
           setIsSuccess(true);
        }

      } catch (err: any) {
        setError(err.message || 'Error al registrarse');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      } finally {
        setIsLoading(false);
      }
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true); 
      }, 1800);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="text-center py-8"
      >
        <motion.div 
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"
        >
          <Mail size={36} />
        </motion.div>
        <h3 className="text-2xl font-bold text-slate-800 mb-3">¡Registro Exitoso!</h3>
        <p className="text-slate-500 mb-8 text-sm px-4 leading-relaxed">
          Revisa tu correo electrónico <strong>({formData.email})</strong> para confirmar tu cuenta y completar el registro.
        </p>
        <Button variant="primary" onClick={() => setView('login')}>
          Ir a Iniciar Sesión
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }} 
      animate={{ opacity: 1, x: shake ? [-10, 10, -10, 10, 0] : 0 }} 
      exit={{ opacity: 0, x: -50 }}
      transition={{ x: { duration: 0.4 } }}
      className="w-full"
    >
      <HeaderIcon icon={UserPlus} />

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Crear Cuenta</h2>
        <p className="text-slate-500 text-xs font-medium">Empieza tu experiencia hoy</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <InputField 
            icon={User} 
            type="text" 
            placeholder="Nombres" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
          <InputField 
            icon={Contact} 
            type="text" 
            placeholder="Apellidos" 
            value={formData.surname} 
            onChange={(e) => setFormData({...formData, surname: e.target.value})} 
          />
        </div>

        <InputField 
          icon={Mail} 
          type="email" 
          placeholder="Correo Electrónico" 
          value={formData.email} 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />

        <div className="relative">
           <InputField 
            icon={Lock} 
            type="password" 
            placeholder="Contraseña Maestra" 
            value={formData.password} 
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            onFocus={() => setShowStrength(true)} 
            isPasswordVisible={showPass}
            showPasswordToggle
            onTogglePassword={() => setShowPass(!showPass)}
          />
        </div>
       
        <AnimatePresence>
          {showStrength && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="overflow-hidden origin-top"
            >
              <PasswordStrengthMeter password={formData.password} />
            </motion.div>
          )}
        </AnimatePresence>

        <InputField 
          icon={KeyRound} 
          type="password" 
          placeholder="Confirmar Contraseña" 
          value={formData.confirmPassword} 
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          isPasswordVisible={showPass}
        />

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-red-500 font-medium py-2"
          >
            {error}
          </motion.div>
        )}

        <div className="pt-2">
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Registrarse Ahora
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
        <p className="text-slate-500 text-sm">
          ¿Ya tienes cuenta?{' '}
          <button onClick={() => setView('login')} className="text-indigo-600 font-bold hover:underline">
            Inicia Sesión
          </button>
        </p>
      </div>
    </motion.div>
  );
};

const RecoveryView = ({ setView, supabaseClient, isSupabaseMode }: any) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Ingresa un correo válido.');
      return;
    }
    
    setStatus('loading');

    if (isSupabaseMode && supabaseClient) {
      try {
        // --- LÓGICA DE VERIFICACIÓN DE EXISTENCIA ---
        // Consultamos la tabla 'profiles' para ver si el correo existe
        // NOTA: Debes tener una tabla 'profiles' con una columna 'email' pública
        const { data: userExists, error: fetchError } = await supabaseClient
          .from('profiles')
          .select('email')
          .eq('email', email)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!userExists) {
          setError('No existe una cuenta asociada a este correo electrónico.');
          setShake(true);
          setTimeout(() => setShake(false), 500);
          setStatus('idle');
          return;
        }

        const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.href, 
        });

        if (resetError) throw resetError;
        
        setStatus('success');
      } catch (err: any) {
        setError(err.message || 'Error al procesar la solicitud.');
        setStatus('idle');
      }
    } else {
      // Simulación para demo
      setTimeout(() => {
        if (email === "existe@demo.com") {
          setStatus('success');
        } else {
          setError('Este correo no está registrado en nuestro sistema.');
          setShake(true);
          setTimeout(() => setShake(false), 500);
          setStatus('idle');
        }
      }, 2000);
    }
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="text-center py-8"
      >
        <motion.div 
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"
        >
          <Mail size={36} />
        </motion.div>
        <h3 className="text-2xl font-bold text-slate-800 mb-3">¡Correo Enviado!</h3>
        <p className="text-slate-500 mb-8 text-sm px-4 leading-relaxed">
          Hemos enviado instrucciones seguras de recuperación a <br/>
          <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded">{email}</span>
        </p>
        <Button variant="secondary" onClick={() => setView('login')}>
          Volver al Inicio
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ 
        opacity: 1, 
        y: 0,
        x: shake ? [-10, 10, -10, 10, 0] : 0
      }} 
      exit={{ opacity: 0, y: -30 }}
      className="relative"
    >
      <button onClick={() => setView('login')} className="absolute -top-12 left-0 flex items-center text-slate-400 hover:text-indigo-600 transition-colors group">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
      </button>
      
      <HeaderIcon icon={KeyRound} />
      
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Recuperación</h2>
        <p className="text-slate-500 mt-2 text-sm">Ingresa tu email para restablecer</p>
      </div>

      <InputField 
        icon={Mail} 
        type="email" 
        placeholder="ejemplo@correo.com" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        error={error}
      />

      <div className="pt-4">
        <Button onClick={handleSubmit} isLoading={status === 'loading'}>
          Enviar Enlace
        </Button>
      </div>
    </motion.div>
  );
};

const ResetPasswordView = ({ setView, supabaseClient }: any) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showStrength, setShowStrength] = useState(false);
  const [shake, setShake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');

    const strength = checkPasswordStrength(password);
    if (strength.score < 5) {
      setError('La contraseña es muy débil.');
      setShake(true); setTimeout(() => setShake(false), 500);
      setShowStrength(true); 
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setShake(true); setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);

    if (supabaseClient) {
      try {
        const { error } = await supabaseClient.auth.updateUser({ password: password });
        if (error) throw error;
        setIsSuccess(true);
      } catch (err: any) {
        setError(err.message || 'Error al actualizar contraseña');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      } finally {
        setIsLoading(false);
      }
    } else {
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
        }, 1500);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="text-center py-8"
      >
        <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Check size={36} strokeWidth={3} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-3">¡Contraseña Actualizada!</h3>
        <p className="text-slate-500 mb-8 text-sm px-4 leading-relaxed">
          Has cambiado tu contraseña exitosamente. Ahora puedes iniciar sesión con tu nueva credencial.
        </p>
        <Button variant="primary" onClick={() => setView('login')}>
          Ir a Iniciar Sesión
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }} 
      animate={{ opacity: 1, x: shake ? [-10, 10, -10, 10, 0] : 0 }} 
      exit={{ opacity: 0, x: -50 }}
      transition={{ x: { duration: 0.4 } }}
      className="w-full"
    >
      <HeaderIcon icon={Lock} />

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Nueva Contraseña</h2>
        <p className="text-slate-500 text-xs font-medium">Asegura tu cuenta con una clave robusta</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
           <InputField 
            icon={Lock} 
            type="password" 
            placeholder="Nueva Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setShowStrength(true)} 
            isPasswordVisible={showPass}
            showPasswordToggle
            onTogglePassword={() => setShowPass(!showPass)}
          />
        </div>
       
        <AnimatePresence>
          {showStrength && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="overflow-hidden origin-top"
            >
              <PasswordStrengthMeter password={password} />
            </motion.div>
          )}
        </AnimatePresence>

        <InputField 
          icon={KeyRound} 
          type="password" 
          placeholder="Confirmar Nueva Contraseña" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)}
          isPasswordVisible={showPass}
        />

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-red-500 font-medium py-2"
          >
            {error}
          </motion.div>
        )}

        <div className="pt-2">
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Actualizar Contraseña
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const Dashboard = ({ user, onLogout, isSupabaseMode }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.1 }}
    className="bg-white/90 backdrop-blur-xl w-full max-w-md p-8 rounded-3xl shadow-2xl border border-white/50 text-center relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-10" />
    
    <div className="relative z-10">
      <div className="w-24 h-24 bg-white p-1.5 rounded-full mx-auto mb-4 shadow-xl mt-4">
        <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white">
          <User size={48} />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-slate-800 mb-1 flex items-center justify-center gap-2">
        Hola, {user.name.split(' ')[0]} <Sparkles size={20} className="text-yellow-500" />
      </h1>
      <p className="text-slate-500 mb-8 text-sm bg-slate-100 inline-block px-3 py-1 rounded-full">{user.email}</p>
      
      <div className="bg-slate-50 p-5 rounded-2xl mb-8 text-left border border-slate-100 shadow-inner">
        <h3 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider flex justify-between">
            Estado de cuenta
            {isSupabaseMode ? <span className="text-xs text-emerald-500 font-bold border border-emerald-200 px-1 rounded bg-emerald-50">SUPABASE</span> : <span className="text-xs text-amber-500 font-bold border border-amber-200 px-1 rounded bg-amber-50">DEMO</span>}
        </h3>
        <div className="flex items-center gap-3 text-emerald-600 font-medium bg-emerald-50 p-3 rounded-xl border border-emerald-100 mt-2">
          <ShieldCheck size={20} />
          <span>Sesión Activa</span>
        </div>
      </div>

      <Button variant="danger" onClick={onLogout}>
        <LogOut size={18} /> Cerrar Sesión Segura
      </Button>
    </div>
  </motion.div>
);

// --- Componente Raíz ---

export default function App() {
  const [view, setView] = useState('login'); 
  const [user, setUser] = useState<any>(null); 
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  const [isSupabaseMode, setIsSupabaseMode] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (document.getElementById('supabase-script')) {
        setIsScriptLoaded(true);
        return;
    }

    const script = document.createElement('script');
    script.id = 'supabase-script';
    script.src = "https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js";
    script.async = true;
    
    script.onload = () => {
      console.log('Supabase script loaded');
      setIsScriptLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Error loading Supabase script');
    };

    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (isScriptLoaded && !supabaseClient) {
      handleSupabaseConnect(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY);
    }
  }, [isScriptLoaded]);

  const handleSupabaseConnect = async (url: string, key: string) => {
    setConnectionError('');
    
    if (!window.supabase) {
      setConnectionError('La librería de Supabase aún no se ha cargado.');
      return;
    }

    if (!url || !key) {
      setConnectionError('URL y Key son requeridos');
      return;
    }

    try {
      const client = window.supabase.createClient(url, key);
      const { error: authError } = await client.auth.getSession();
      
      if (authError && authError.message && authError.message.includes('FetchError')) {
          throw new Error('No se pudo conectar al URL proporcionado');
      }

      client.auth.onAuthStateChange((event: string, session: any) => {
        if (event === 'PASSWORD_RECOVERY') {
           setView('reset-password');
        }
      });

      setSupabaseClient(client);
      setIsSupabaseMode(true);
      return true;

    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('Invalid URL')) {
         setConnectionError('URL inválida');
      } else {
         try {
            const client = window.supabase.createClient(url, key);
            client.auth.onAuthStateChange((event: string, session: any) => {
                if (event === 'PASSWORD_RECOVERY') {
                   setView('reset-password');
                }
            });
            setSupabaseClient(client);
            setIsSupabaseMode(true);
         } catch (e) {
            setConnectionError('Error al crear cliente Supabase');
         }
      }
    }
  };

  const handleLogout = async () => {
    if (isSupabaseMode && supabaseClient) {
        await supabaseClient.auth.signOut();
    }
    setUser(null);
    setView('login');
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f4f6] relative flex items-center justify-center p-4 font-sans selection:bg-indigo-100 selection:text-indigo-700 overflow-hidden">
      
      <ConfigSidebar 
        onConnect={handleSupabaseConnect} 
        isConnected={isSupabaseMode} 
        connectionError={connectionError}
      />

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-purple-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-pink-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <AnimatePresence mode='wait'>
        {user ? (
          <Dashboard 
            key="dashboard" 
            user={user} 
            onLogout={handleLogout} 
            isSupabaseMode={isSupabaseMode}
          />
        ) : (
          <motion.div 
            key="auth-card"
            layout
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white/80 backdrop-blur-2xl w-full max-w-[440px] p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-indigo-500/10 border border-white/60 relative z-10"
          >
            <AnimatePresence mode='wait'>
              {view === 'login' && (
                <LoginView 
                  key="login" 
                  setView={setView} 
                  onLogin={setUser} 
                  supabaseClient={supabaseClient}
                  isSupabaseMode={isSupabaseMode}
                />
              )}
              {view === 'register' && (
                <RegisterView 
                    key="register" 
                    setView={setView} 
                    onLogin={setUser} 
                    supabaseClient={supabaseClient}
                    isSupabaseMode={isSupabaseMode}
                />
              )}
              {view === 'recovery' && (
                <RecoveryView 
                    key="recovery" 
                    setView={setView} 
                    supabaseClient={supabaseClient}
                    isSupabaseMode={isSupabaseMode}
                />
              )}
              {view === 'reset-password' && (
                <ResetPasswordView 
                    key="reset-password" 
                    setView={setView} 
                    supabaseClient={supabaseClient}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}