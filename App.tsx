import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Contact
} from 'lucide-react';
import { supabase } from './src/lib/supabaseClient';

// --- Utilitarios y Validaciones ---
const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^((\\[^<>()\\[\\\\\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\\\\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/
    );
};

const checkPasswordStrength = (password: string) => {
  let score = 0;
  if (!password) return { score: 0, details: [] };
  
  const checks = [
    { regex: /.{8,}/, label: 'Mínimo 8 caracteres' },
    { regex: /[A-Z]/, label: 'Una mayúscula' },
    { regex: /[a-z]/, label: 'Una minúscula' },
    { regex: /[0-9]/, label: 'Un número' },
    { regex: /[^A-Za-z0-9]/, label: 'Un símbolo especial' }
  ];
  
  const details = checks.map((check) => ({
    label: check.label,
    met: check.regex.test(password)
  }));
  
  score = details.filter((d) => d.met).length;
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
  <div className="space-y-1.5 relative group">
    <div className="relative">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 z-10 ${error ? 'text-rose-400' : 'text-stone-400 group-focus-within:text-amber-500'}`}>
        <Icon size={18} />
      </div>
      <input
        type={isPasswordVisible ? 'text' : type}
        disabled={disabled}
        className={`w-full pl-11 pr-10 py-3.5 bg-stone-900/50 border ${
          error 
            ? 'border-rose-900/50 focus:ring-rose-500/10 bg-rose-950/20' 
            : 'border-stone-800 focus:ring-amber-500/10 focus:border-amber-500/50'
        } rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-4 transition-all duration-300 backdrop-blur-md relative z-0 disabled:opacity-50 disabled:cursor-not-allowed`}
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
          className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-amber-500 transition-colors z-10"
        >
          {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
    {error && (
      <motion.p 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-rose-400 font-medium pl-1 flex items-center gap-1"
      >
        <AlertCircle size={12} /> {error}
      </motion.p>
    )}
  </div>
);

const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const { score, details } = checkPasswordStrength(password);
  
  const getColor = () => {
    if (score <= 2) return 'bg-rose-500';
    if (score === 3 || score === 4) return 'bg-amber-500';
    return 'bg-emerald-500';
  };
  
  const getWidth = () => {
    if (password.length === 0) return 'w-0';
    return `${(score / 5) * 100}%`;
  };

  return (
    <div className="mt-4 space-y-3 bg-stone-900/40 p-4 rounded-xl border border-stone-800/50 backdrop-blur-sm">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-stone-400 tracking-wider uppercase">Seguridad</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          score === 5 ? 'bg-emerald-500/10 text-emerald-400' : 
          score > 2 ? 'bg-amber-500/10 text-amber-400' : 
          'bg-rose-500/10 text-rose-400'
        }`}>
          {score === 5 ? 'Inmune' : score > 2 ? 'Robusta' : 'Vulnerable'}
        </span>
      </div>
      <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${getColor()} shadow-[0_0_10px_rgba(0,0,0,0.3)]`}
          initial={{ width: 0 }}
          animate={{ width: getWidth() }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <div className="grid grid-cols-1 gap-2">
        {details.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-[11px]">
            <div className={`transition-colors duration-300 ${item.met ? 'text-amber-500' : 'text-stone-600'}`}>
              {item.met ? <Check size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border border-stone-700" />}
            </div>
            <span className={item.met ? 'text-stone-300' : 'text-stone-500'}>{item.label}</span>
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
  const baseStyle = 'w-full py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-[0_4px_20px_rgba(245,158,11,0.2)] hover:shadow-[0_8px_25px_rgba(245,158,11,0.3)]',
    secondary: 'bg-stone-800/50 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-amber-500/50',
    danger: 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`${baseStyle} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-wait`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {children}
        </>
      )}
    </button>
  );
};

const HeaderIcon = ({ icon: Icon }: { icon: any }) => (
  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgba(245,158,11,0.3)] mb-6 mx-auto transform -rotate-3 hover:rotate-0 transition-transform duration-500">
    <Icon className="text-stone-950" size={32} />
  </div>
);

// --- Vistas del Sistema ---
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
      setError('Credenciales inválidas');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      onLogin({
        name: data.user.user_metadata.full_name || email.split('@')[0],
        email: data.user.email
      });
    } catch {
      setError('Acceso denegado. Revisa tus datos.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1, x: shake ? [0, -10, 10, -10, 10, 0] : 0 }}
      className="w-full max-w-md p-8 bg-stone-900/60 backdrop-blur-2xl rounded-3xl border border-stone-800 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      
      <div className="text-center mb-8">
        <HeaderIcon icon={ShieldCheck} />
        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">SAVIKA</h1>
        <p className="text-stone-400 font-medium">Portal de Acceso Seguro</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField icon={Mail} type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
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
        
        <div className="flex justify-end">
          <button type="button" onClick={() => setView('recovery')} className="text-xs text-amber-500/80 hover:text-amber-400 font-bold tracking-wide uppercase transition-colors">
            Recuperar acceso
          </button>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
            <AlertCircle size={18} /> {error}
          </motion.div>
        )}

        <Button onClick={handleSubmit} isLoading={isLoading}>
          Iniciar Sesión <ArrowRight size={18} />
        </Button>
      </form>

      <div className="mt-8 text-center border-t border-stone-800 pt-6">
        <p className="text-stone-500 text-sm font-medium">
          ¿Nuevo en Savika?{' '}
          <button onClick={() => setView('register')} className="text-amber-500 font-bold hover:text-amber-400 transition-colors">
            Crea tu cuenta
          </button>
        </p>
      </div>
    </motion.div>
  );
};

const RegisterView = ({ setView, onLogin }: any) => {
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
      setError('Completa tu identidad');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Formato de correo inválido');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    
    const strength = checkPasswordStrength(formData.password);
    if (strength.score < 5) {
      setError('Contraseña insuficiente');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setShowStrength(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las claves no coinciden');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: `${formData.name} ${formData.surname}` }
        }
      });
      if (error) throw error;
      
      await supabase.from('profiles').upsert({ email: formData.email });

      if (data.session) {
        onLogin({ name: `${formData.name} ${formData.surname}`, email: formData.email });
      } else {
        setIsSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Error en el registro');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md p-8 bg-stone-900/60 backdrop-blur-2xl rounded-3xl border border-stone-800 text-center">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Verificación Enviada</h2>
        <p className="text-stone-400 mb-8 leading-relaxed">
          Hemos enviado un enlace a <span className="text-stone-200 font-bold">{formData.email}</span>. Confirma tu cuenta para activar el acceso.
        </p>
        <Button variant="secondary" onClick={() => setView('login')}>Volver al Portal</Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0, x: shake ? [0, -10, 10, -10, 10, 0] : 0 }}
      className="w-full max-w-lg p-8 bg-stone-900/60 backdrop-blur-2xl rounded-3xl border border-stone-800 shadow-2xl"
    >
      <div className="text-center mb-8">
        <HeaderIcon icon={UserPlus} />
        <h2 className="text-3xl font-black text-white tracking-tighter mb-2">UNIRSE A SAVIKA</h2>
        <p className="text-stone-400 font-medium">Define tu identidad digital</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <InputField icon={User} type="text" placeholder="Nombre" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <InputField icon={Contact} type="text" placeholder="Apellidos" value={formData.surname} onChange={(e) => setFormData({ ...formData, surname: e.target.value })} />
        </div>
        
        <InputField icon={Mail} type="email" placeholder="Email institucional o personal" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        
        <InputField 
          icon={KeyRound} 
          type="password" 
          placeholder="Contraseña maestra" 
          value={formData.password} 
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          onFocus={() => setShowStrength(true)}
          isPasswordVisible={showPass}
          showPasswordToggle
          onTogglePassword={() => setShowPass(!showPass)}
        />

        {showStrength && <PasswordStrengthMeter password={formData.password} />}

        <InputField icon={Lock} type="password" placeholder="Confirmar contraseña" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} isPasswordVisible={showPass} />

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <Button onClick={handleSubmit} isLoading={isLoading}>Crear Identidad <Sparkles size={18} /></Button>
      </form>

      <div className="mt-8 text-center border-t border-stone-800 pt-6">
        <button onClick={() => setView('login')} className="flex items-center justify-center gap-2 mx-auto text-stone-500 hover:text-amber-500 transition-colors font-bold text-sm">
          <ChevronLeft size={16} /> YA TENGO ACCESO
        </button>
      </div>
    </motion.div>
  );
};

const RecoveryView = ({ setView }: any) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Email inválido');
      return;
    }

    setStatus('loading');
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.href
      });
      if (resetError) throw resetError;
      setStatus('success');
    } catch (err: any) {
      setError('Error al procesar solicitud');
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md p-8 bg-stone-900/60 backdrop-blur-2xl rounded-3xl border border-stone-800 text-center">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Instrucciones enviadas</h2>
        <p className="text-stone-400 mb-8">Revisa tu bandeja para restablecer tu contraseña.</p>
        <Button onClick={() => setView('login')}>Entendido</Button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-8 bg-stone-900/60 backdrop-blur-2xl rounded-3xl border border-stone-800 relative">
      <button onClick={() => setView('login')} className="absolute -top-12 left-0 flex items-center text-stone-500 hover:text-amber-500 transition-colors font-bold text-sm tracking-widest">
        <ChevronLeft size={18} /> VOLVER
      </button>

      <div className="text-center mb-8">
        <HeaderIcon icon={KeyRound} />
        <h2 className="text-3xl font-black text-white tracking-tighter mb-2">RECUPERAR</h2>
        <p className="text-stone-400 font-medium">Restablecer acceso maestro</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField icon={Mail} type="email" placeholder="Tu email registrado" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
        <Button onClick={handleSubmit} isLoading={status === 'loading'}>Enviar Enlace de Rescate</Button>
      </form>
    </motion.div>
  );
};

const ResetPasswordView = ({ setView }: any) => {
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
      setError('Contraseña muy débil');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setShowStrength(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('No coinciden');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md p-8 bg-stone-900/60 backdrop-blur-2xl rounded-3xl border border-stone-800 text-center">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Éxito total</h2>
        <p className="text-stone-400 mb-8">Tu nueva contraseña ya está activa.</p>
        <Button onClick={() => setView('login')}>Iniciar Sesión</Button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md p-8 bg-stone-900/60 backdrop-blur-2xl rounded-3xl border border-stone-800">
      <div className="text-center mb-8">
        <HeaderIcon icon={ShieldCheck} />
        <h2 className="text-3xl font-black text-white tracking-tighter mb-2">NUEVA CLAVE</h2>
        <p className="text-stone-400 font-medium">Define tu nuevo acceso maestro</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField 
          icon={Lock} 
          type="password" 
          placeholder="Nueva contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setShowStrength(true)}
          isPasswordVisible={showPass}
          showPasswordToggle
          onTogglePassword={() => setShowPass(!showPass)}
        />
        {showStrength && <PasswordStrengthMeter password={password} />}
        <InputField icon={Lock} type="password" placeholder="Confirmar nueva contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} isPasswordVisible={showPass} />
        <Button onClick={handleSubmit} isLoading={isLoading}>Actualizar Acceso</Button>
      </form>
    </motion.div>
  );
};

const Dashboard = ({ user, onLogout }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }} 
    animate={{ opacity: 1, scale: 1 }} 
    className="w-full max-w-2xl p-10 bg-stone-900/60 backdrop-blur-2xl rounded-3xl border border-stone-800 shadow-2xl relative"
  >
    <div className="flex items-center justify-between mb-12">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-stone-950 font-black text-3xl shadow-lg">
          {user.name[0]}
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">{user.name}</h1>
          <p className="text-stone-500 font-medium">{user.email}</p>
        </div>
      </div>
      <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Activo</span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-6 mb-12">
      <div className="p-6 bg-stone-800/40 rounded-2xl border border-stone-700/50">
        <h3 className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-2">Rol del Sistema</h3>
        <p className="text-white font-bold">Administrador General</p>
      </div>
      <div className="p-6 bg-stone-800/40 rounded-2xl border border-stone-700/50">
        <h3 className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-2">Último Acceso</h3>
        <p className="text-white font-bold">Hoy, 16:45</p>
      </div>
    </div>

    <Button variant="danger" onClick={onLogout} className="max-w-[240px] mx-auto">
      <LogOut size={18} /> Finalizar Sesión
    </Button>
  </motion.div>
);

export default function App() {
  const [view, setView] = useState('login');
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setView('reset-password');
      }
    });
    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView('login');
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6 font-sans selection:bg-amber-500/30 selection:text-amber-200 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-amber-600/10 blur-[120px] rounded-full animate-blob" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] bg-amber-900/10 blur-[120px] rounded-full animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-[20%] w-full h-px bg-gradient-to-r from-transparent via-stone-800 to-transparent" />
      </div>

      <div className="relative z-10 w-full flex justify-center">
        <AnimatePresence mode="wait">
          {user ? (
            <Dashboard key="dashboard" user={user} onLogout={handleLogout} />
          ) : (
            <>
              {view === 'login' && <LoginView key="login" setView={setView} onLogin={setUser} />}
              {view === 'register' && <RegisterView key="register" setView={setView} onLogin={setUser} />}
              {view === 'recovery' && <RecoveryView key="recovery" setView={setView} />}
              {view === 'reset-password' && <ResetPasswordView key="reset-password" setView={setView} />}
            </>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 10s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}
