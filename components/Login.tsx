import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, Loader2 } from 'lucide-react';

interface LoginProps {
  onBack: () => void;
  onLogin: (email: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onBack, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simula delay de autenticação
    setTimeout(() => {
        onLogin(email);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-night-950 flex items-center justify-center p-4 relative overflow-hidden">
       {/* Background elements */}
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-500 to-transparent"></div>
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-600/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]"></div>
       </div>
       
       <div className="w-full max-w-md bg-night-900 border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10 backdrop-blur-sm animate-fade-in">
          <button onClick={onBack} className="text-slate-500 hover:text-white mb-6 flex items-center gap-2 text-sm transition-colors">
             <ArrowLeft size={16} /> Voltar ao Início
          </button>
          
          <div className="text-center mb-8">
             <div className="w-12 h-12 bg-accent-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-accent-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                <Lock className="text-accent-400 w-6 h-6" />
             </div>
             <h2 className="text-2xl font-display font-bold text-white">Área do Membro</h2>
             <p className="text-slate-400 text-sm mt-2">Acesse seus relatórios e estratégias salvas.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Email de Acesso</label>
                <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                   <input 
                     type="email" 
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full bg-night-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                     placeholder="seu@email.com"
                   />
                </div>
             </div>
             
             <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-slate-300 text-sm font-medium">Senha</label>
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-night-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                />
             </div>

             <div className="flex items-center justify-between text-xs mt-2">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                   <input type="checkbox" className="rounded border-slate-700 bg-night-950 text-accent-500 focus:ring-offset-night-900 accent-accent-500" />
                   Lembrar de mim
                </label>
                <a href="#" className="text-accent-400 hover:text-accent-300 transition-colors">Esqueceu a senha?</a>
             </div>

             <button 
               type="submit" 
               disabled={isLoading}
               className="w-full bg-accent-600 hover:bg-accent-500 text-white font-bold py-3 rounded-lg transition-all mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
             >
               {isLoading ? (
                 <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Acessando...
                 </>
               ) : 'Entrar no Portal'}
             </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
             <p className="text-slate-500 text-sm">
                Ainda não tem sua análise? <br/>
                <button onClick={onBack} className="text-white hover:text-accent-400 font-medium mt-2 transition-colors border-b border-white/10 hover:border-accent-400 pb-0.5">
                    Fazer Diagnóstico Gratuito
                </button>
             </p>
          </div>
       </div>
       
       <div className="absolute bottom-4 text-center w-full opacity-30 pointer-events-none">
          <p className="text-[10px] text-slate-500">Ambiente Seguro • Criptografia de Ponta a Ponta</p>
       </div>
    </div>
  );
};