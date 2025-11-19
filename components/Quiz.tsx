import React, { useState, useMemo } from 'react';
import { QuizAnswers, UserData } from '../types';
import { ArrowRight, ArrowLeft, Check, Sparkles, Clock, Brain, Moon, Coffee, Thermometer, Volume2, Utensils, Sun, Activity, Beer, BedDouble, Droplets, Pill, Users, Monitor, Zap, GraduationCap, User, Scale, AlertCircle, HeartPulse } from 'lucide-react';

// Tipos para categorização das perguntas
type QuestionCategory = 'PERFIL' | 'HÁBITOS' | 'AMBIENTE' | 'MENTE' | 'FISIOLOGIA' | 'ROTINA' | 'SINTOMAS CLÍNICOS';

interface ExtendedQuestion {
  id: string;
  category: QuestionCategory;
  text: string;
  subtext?: string;
  icon: React.ElementType;
  options: { label: string; value: string | number; scoreWeight?: number }[];
}

const QUESTIONS: ExtendedQuestion[] = [
  // --- BLOCO 0: PERFIL (Novas Perguntas) ---
  {
    id: 'age',
    category: 'PERFIL',
    text: 'Qual é a sua faixa etária?',
    subtext: 'A necessidade biológica de sono muda com a idade.',
    icon: User,
    options: [
      { label: '14 a 17 anos (Adolescente)', value: 'teen' },
      { label: '18 a 25 anos (Jovem Adulto)', value: 'young_adult' },
      { label: '26 a 50 anos (Adulto)', value: 'adult' },
      { label: 'Mais de 50 anos', value: 'senior' }
    ]
  },
  {
    id: 'occupation',
    category: 'PERFIL',
    text: 'Qual sua ocupação principal atual?',
    subtext: 'Para entendermos sua carga cognitiva diária.',
    icon: GraduationCap,
    options: [
      { label: 'Apenas Trabalho', value: 'work' },
      { label: 'Apenas Estudo', value: 'study' },
      { label: 'Trabalho e Estudo (Jornada Dupla)', value: 'work_study' },
      { label: 'Aposentado / Em Casa', value: 'home' }
    ]
  },

  // --- BLOCO 1: FUNDAMENTOS ---
  {
    id: 'duration',
    category: 'HÁBITOS',
    text: 'Qual é a sua média real de horas de sono?',
    subtext: 'Conte apenas o tempo dormindo, não o tempo na cama.',
    icon: Clock,
    options: [
      { label: 'Menos de 5h (Crítico)', value: '<5h' },
      { label: '5h a 6h (Insuficiente)', value: '5-6h' },
      { label: '6h a 7h (Regular)', value: '6-7h' },
      { label: '7h a 8h (Ideal)', value: '7-8h' },
      { label: 'Mais de 9h (Excesso)', value: '>9h' }
    ]
  },
  {
    id: 'consistency',
    category: 'HÁBITOS',
    text: 'Você costuma dormir e acordar no mesmo horário?',
    subtext: 'Incluindo fins de semana.',
    icon: Clock,
    options: [
      { label: 'Sim, sou um relógio suíço', value: 'always' },
      { label: 'Vario até 1 hora nos fins de semana', value: 'mostly' },
      { label: 'Vario muito (Social Jetlag)', value: 'variable' },
      { label: 'Não tenho rotina alguma', value: 'chaotic' }
    ]
  },
  {
    id: 'latency',
    category: 'FISIOLOGIA',
    text: 'Quanto tempo você leva para apagar?',
    subtext: 'Após deitar e fechar os olhos.',
    icon: Moon,
    options: [
      { label: 'Imediatamente (< 5 min)', value: 'instant' },
      { label: 'Normal (10-20 min)', value: 'normal' },
      { label: 'Demorado (30-60 min)', value: 'delayed' },
      { label: 'Horas rolando na cama', value: 'insomnia' }
    ]
  },

  // --- BLOCO 2: AMBIENTE ---
  {
    id: 'mattress',
    category: 'AMBIENTE',
    text: 'Como está seu colchão e travesseiro?',
    icon: BedDouble,
    options: [
      { label: 'Perfeitos, amo minha cama', value: 'perfect' },
      { label: 'Razoáveis, mas velhos', value: 'old' },
      { label: 'Desconfortáveis, acordo com dor', value: 'pain' },
      { label: 'Não sinto diferença', value: 'neutral' }
    ]
  },
  {
    id: 'temperature',
    category: 'AMBIENTE',
    text: 'Como é a temperatura do seu quarto?',
    icon: Thermometer,
    options: [
      { label: 'Fresco/Frio (Ideal)', value: 'cool' },
      { label: 'Neutro', value: 'neutral' },
      { label: 'Geralmente quente', value: 'warm' },
      { label: 'Acordo suando à noite', value: 'hot' }
    ]
  },
  {
    id: 'light_noise',
    category: 'AMBIENTE',
    text: 'Sobre luz e barulho no seu quarto:',
    icon: Volume2,
    options: [
      { label: 'Breu total e silêncio absoluto', value: 'perfect' },
      { label: 'Pouca luz/ruído (rua, leds)', value: 'minor' },
      { label: 'Luz de poste ou barulho frequente', value: 'disturbed' },
      { label: 'Durmo com TV ligada ou luz acesa', value: 'bad' }
    ]
  },

  // --- BLOCO 3: COMPORTAMENTO DIURNO ---
  {
    id: 'sunlight',
    category: 'ROTINA',
    text: 'Você pega luz solar pela manhã?',
    subtext: 'Isso calibra seu relógio biológico.',
    icon: Sun,
    options: [
      { label: 'Sim, logo que acordo', value: 'morning' },
      { label: 'Às vezes / Fim de semana', value: 'sometimes' },
      { label: 'Não, trabalho em local fechado', value: 'indoor' },
      { label: 'Evito o sol', value: 'none' }
    ]
  },
  {
    id: 'exercise',
    category: 'ROTINA',
    text: 'Você pratica exercícios físicos?',
    icon: Activity,
    options: [
      { label: 'Manhã/Tarde (Intenso)', value: 'good_timing' },
      { label: 'À noite (perto de dormir)', value: 'late_timing' },
      { label: 'Sedentário', value: 'none' },
      { label: 'Leve/Caminhada ocasional', value: 'light' }
    ]
  },
  {
    id: 'naps',
    category: 'ROTINA',
    text: 'Você tem o hábito de cochilar?',
    icon: Clock,
    options: [
      { label: 'Não cochilo', value: 'none' },
      { label: 'Power nap (20 min)', value: 'power' },
      { label: 'Cochilo longo (>1h)', value: 'long' },
      { label: 'Durmo à tarde sem querer', value: 'accidental' }
    ]
  },

  // --- BLOCO 4: CONSUMO E SUBSTÂNCIAS ---
  {
    id: 'caffeine',
    category: 'HÁBITOS',
    text: 'Qual seu último contato com cafeína?',
    subtext: 'Café, chá preto, refri, energético, pré-treino.',
    icon: Coffee,
    options: [
      { label: 'Antes das 12:00', value: 'morning' },
      { label: 'Até às 16:00', value: 'afternoon' },
      { label: 'Fim de tarde/Noite', value: 'evening' },
      { label: 'Não consumo cafeína', value: 'never' }
    ]
  },
  {
    id: 'alcohol',
    category: 'HÁBITOS',
    text: 'Você consome álcool perto de dormir?',
    subtext: 'O álcool fragmenta o sono REM.',
    icon: Beer,
    options: [
      { label: 'Nunca / Raramente', value: 'none' },
      { label: '1 taça/copo ocasional', value: 'light' },
      { label: 'Frequentemente à noite', value: 'regular' },
      { label: 'Uso para relaxar/apagar', value: 'heavy' }
    ]
  },
  {
    id: 'food',
    category: 'FISIOLOGIA',
    text: 'Como é sua última refeição?',
    icon: Utensils,
    options: [
      { label: 'Leve, 3h antes de deitar', value: 'good' },
      { label: 'Normal, 1-2h antes', value: 'normal' },
      { label: 'Pesada/Gordurosa', value: 'heavy' },
      { label: 'Como doces/açúcar à noite', value: 'sugar' }
    ]
  },
  {
    id: 'hydration',
    category: 'FISIOLOGIA',
    text: 'Você bebe muita água antes de deitar?',
    icon: Droplets,
    options: [
      { label: 'Paro 2h antes', value: 'good' },
      { label: 'Bebo se tiver sede', value: 'normal' },
      { label: 'Bebo muito', value: 'heavy' },
      { label: 'Acordo com sede na madrugada', value: 'thirst' }
    ]
  },

  // --- BLOCO 5: TECNOLOGIA E MENTE ---
  {
    id: 'screens',
    category: 'HÁBITOS',
    text: 'Uso de telas antes de dormir:',
    subtext: 'Celular, TV, Tablet, Computador.',
    icon: Monitor,
    options: [
      { label: 'Desligo tudo 1h antes', value: 'none' },
      { label: 'Uso com filtro de luz azul', value: 'filtered' },
      { label: 'Uso até sentir sono', value: 'until_sleep' },
      { label: 'Durmo com o celular na mão', value: 'heavy' }
    ]
  },
  {
    id: 'stress_level',
    category: 'MENTE',
    text: 'Como você avalia seu nível de estresse?',
    subtext: 'O cortisol compete diretamente com a melatonina.',
    icon: HeartPulse,
    options: [
      { label: 'Baixo / Controlado', value: 'low' },
      { label: 'Moderado (Trabalho/Rotina)', value: 'medium' },
      { label: 'Alto (Sinto-me sobrecarregado)', value: 'high' },
      { label: 'Exaustão total (Burnout)', value: 'burnout' }
    ]
  },
  {
    id: 'mind',
    category: 'MENTE',
    text: 'O que acontece quando você deita a cabeça no travesseiro?',
    icon: Brain,
    options: [
      { label: 'Apago tranquilamente', value: 'calm' },
      { label: 'Penso no dia seguinte, mas durmo', value: 'mild_thinking' },
      { label: 'Pensamentos acelerados/Ansiedade', value: 'racing' },
      { label: 'Fico remoendo problemas', value: 'stress' }
    ]
  },
  {
    id: 'social',
    category: 'MENTE',
    text: 'Interações sociais à noite:',
    icon: Users,
    options: [
      { label: 'Ambiente calmo e relaxante', value: 'calm' },
      { label: 'Conversas normais', value: 'normal' },
      { label: 'Discussões ou trabalho estressante', value: 'stress' },
      { label: 'Solidão / Isolamento', value: 'lonely' }
    ]
  },

  // --- BLOCO 6: SINTOMAS CLÍNICOS ---
  {
    id: 'headache',
    category: 'SINTOMAS CLÍNICOS',
    text: 'Você sofre com dores de cabeça ou enxaqueca?',
    subtext: 'O sono afeta diretamente o sistema glinfático (limpeza cerebral).',
    icon: AlertCircle,
    options: [
      { label: 'Raramente ou Nunca', value: 'none' },
      { label: 'Sim, tenho enxaquecas frequentes', value: 'migraine' },
      { label: 'Muitas dores tensionais à tarde', value: 'tension' },
      { label: 'Acordo com dor de cabeça', value: 'morning' }
    ]
  },
  {
    id: 'waking',
    category: 'FISIOLOGIA',
    text: 'Como você acorda na maioria dos dias?',
    icon: Zap,
    options: [
      { label: 'Sozinho, antes do despertador', value: 'natural' },
      { label: 'Com o despertador, mas bem', value: 'ok' },
      { label: 'No modo "Soneca" várias vezes', value: 'groggy' },
      { label: 'Parece que fui atropelado', value: 'zombie' }
    ]
  },
  {
    id: 'weight_impact',
    category: 'FISIOLOGIA',
    text: 'Você sente que seu peso corporal interfere na respiração ao dormir?',
    subtext: 'Fator crítico para apneia obstrutiva.',
    icon: Scale,
    options: [
      { label: 'Não, meu peso é estável', value: 'none' },
      { label: 'Sinto um leve desconforto', value: 'mild' },
      { label: 'Sim, sinto a respiração pesada/curta', value: 'impact' },
      { label: 'Sim, tenho diagnóstico de obesidade', value: 'heavy' }
    ]
  },
  {
    id: 'fragmentation',
    category: 'FISIOLOGIA',
    text: 'Você acorda durante a noite?',
    icon: Moon,
    options: [
      { label: 'Não, durmo direto', value: 'none' },
      { label: '1 vez (banheiro/água)', value: 'once' },
      { label: 'Várias vezes e volto a dormir', value: 'multiple' },
      { label: 'Acordo e demoro a dormir de novo', value: 'insomnia_mid' }
    ]
  },
  {
    id: 'snoring',
    category: 'FISIOLOGIA',
    text: 'Você ronca ou já disseram que você para de respirar?',
    subtext: 'Sintoma clássico de Apneia.',
    icon: Volume2,
    options: [
      { label: 'Não / Silencioso', value: 'none' },
      { label: 'Ronco leve ocasional', value: 'light' },
      { label: 'Ronco alto e frequente', value: 'heavy' },
      { label: 'Acordo engasgado/sufocado', value: 'apnea' }
    ]
  },
  {
    id: 'meds',
    category: 'HÁBITOS',
    text: 'Uso de medicamentos para dormir:',
    icon: Pill,
    options: [
      { label: 'Nenhum', value: 'none' },
      { label: 'Suplementos naturais (Melatonina, etc)', value: 'natural' },
      { label: 'Remédios prescritos ocasionalmente', value: 'prescription_occ' },
      { label: 'Dependente de remédios para dormir', value: 'prescription_daily' }
    ]
  }
];

interface QuizProps {
  onSubmit: (user: UserData, answers: QuizAnswers) => void;
  onBack: () => void;
}

const QuizFooter = () => (
  <div className="w-full mt-12 pb-6 px-4 text-center opacity-60 hover:opacity-100 transition-opacity relative z-10">
    <p className="text-slate-600 text-[10px] leading-relaxed max-w-2xl mx-auto">
      <strong>Aviso Legal de Saúde:</strong> O conteúdo fornecido pelo SonoScore-Pro é estritamente para fins informativos e educativos e não constitui aconselhamento médico, diagnóstico ou tratamento. As estratégias de higiene do sono sugeridas são baseadas em práticas de bem-estar geral. Este aplicativo não substitui a consulta com médicos ou especialistas do sono. Se você suspeita que tem um distúrbio do sono ou qualquer outra condição médica, procure sempre a orientação de um profissional de saúde qualificado.
    </p>
    <p className="text-slate-700 text-[10px] mt-1">
      © 2025 SonoScore-Pro. Todos os direitos reservados.
    </p>
  </div>
);

// Logo Component
const Logo = () => (
  <div className="flex items-center gap-2 select-none">
    <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-br from-accent-500 to-purple-600 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.6)] border border-white/10">
      <Moon className="text-white w-4 h-4 absolute top-1.5 left-1.5" fill="currentColor" />
      <Activity className="text-white w-3 h-3 absolute bottom-1.5 right-1.5" />
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-display font-bold text-lg tracking-tight text-white drop-shadow-md">SonoScore</span>
      <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-accent-400 text-right -mt-0.5 text-shadow-glow">PRO</span>
    </div>
  </div>
);

// Componente do Céu Estrelado
const StarField = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full opacity-30 animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`
          }}
        />
      ))}
    </div>
  );
};

// Mascote Personalizado (Static & Small as requested)
const SleepyMascot = ({ className = "w-24 h-24", animated = true }: { className?: string, animated?: boolean }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} ${animated ? 'animate-float' : ''} drop-shadow-2xl`}>
    <defs>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <rect x="55" y="45" width="35" height="30" rx="5" fill="white" transform="rotate(-10 70 60)" stroke="#e2e8f0" strokeWidth="1" />
    <path d="M30 70 Q 20 80 15 95 L 35 90 Q 40 80 30 70" fill="#818cf8" opacity="0.8" />
    <path d="M35 60 C 35 45 65 45 65 60 V 100 H 35 V 60 Z" fill="#4f46e5" />
    <path d="M35 70 H 65" stroke="#6366f1" strokeWidth="2" opacity="0.5"/>
    <path d="M35 80 H 65" stroke="#6366f1" strokeWidth="2" opacity="0.5"/>
    <path d="M35 90 H 65" stroke="#6366f1" strokeWidth="2" opacity="0.5"/>
    <circle cx="50" cy="45" r="14" fill="#f8fafc" />
    <path d="M44 45 Q 46 47 48 45" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M52 45 Q 54 47 56 45" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="50" cy="50" r="1.5" fill="#fb7185" opacity="0.6" />
    <path d="M36 38 C 36 38 50 20 64 38" fill="#4338ca" />
    <path d="M64 38 L 75 55 L 60 42" fill="#4338ca" /> 
    <circle cx="75" cy="55" r="3" fill="#fbbf24" />
    <path d="M60 65 Q 70 65 75 55" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" />
    <path d="M40 65 Q 30 70 30 70" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const Quiz: React.FC<QuizProps> = ({ onSubmit, onBack }) => {
  const [step, setStep] = useState(-1); // -1 for User Info, 0+ for questions
  const [user, setUser] = useState<UserData>({ name: '', email: '' });
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [error, setError] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.name || !user.email) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setError('');
    setStep(0);
  };

  const handleBack = () => {
    if (step === -1) {
      onBack(); // Back to Landing
    } else {
      setStep(s => s - 1);
      setIsTransitioning(false); // Reset transition to ensure content is visible
    }
  };

  const handleAnswer = (value: string | number) => {
    if (isTransitioning) return;
    
    const currentQ = QUESTIONS[step];
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
    
    setIsTransitioning(true);

    setTimeout(() => {
      if (step < QUESTIONS.length - 1) {
        setStep(s => s + 1);
        setIsTransitioning(false);
      } else {
        onSubmit(user, { ...answers, [currentQ.id]: value });
      }
    }, 300);
  };

  const progress = step >= 0 ? ((step + 1) / QUESTIONS.length) * 100 : 0;

  // Tela de Captura de Lead
  if (step === -1) {
    return (
      <div className="min-h-screen bg-night-950 flex flex-col relative overflow-hidden font-sans">
        <StarField />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent-600/10 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="bg-night-900/60 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-3xl max-w-md w-full shadow-2xl animate-fade-in-up relative">
             
             <div className="absolute top-6 left-6">
                <Logo />
             </div>
             
             <button 
                onClick={handleBack}
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-full"
                title="Voltar ao Início"
             >
                 <ArrowLeft size={20} />
             </button>

            <div className="flex justify-center mb-6 mt-8">
              <div className="w-12 h-12 bg-accent-500/20 rounded-2xl flex items-center justify-center text-accent-300 border border-accent-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-3 text-center drop-shadow-md">
              Antes de começarmos...
            </h2>
            <p className="text-slate-300 mb-8 text-center font-light leading-relaxed text-sm md:text-base">
              Precisamos saber quem você é para gerar seu relatório personalizado.
            </p>
            <form onSubmit={handleUserSubmit} className="space-y-5 relative">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Seu Nome</label>
                <input 
                  type="text"
                  value={user.name}
                  onChange={e => setUser({...user, name: e.target.value})}
                  className="w-full bg-night-950/80 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 shadow-inner"
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Seu Melhor Email</label>
                <input 
                  type="email"
                  value={user.email}
                  onChange={e => setUser({...user, email: e.target.value})}
                  className="w-full bg-night-950/80 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 shadow-inner"
                  placeholder="joao@email.com"
                />
              </div>
              {error && <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</p>}
              
              <div className="flex items-center gap-4 mt-8">
                <div className="flex-shrink-0 transform -rotate-6">
                   <SleepyMascot className="w-16 h-16" animated={false} />
                </div>
                <button type="submit" className="flex-1 bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-400 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 relative z-10 border border-white/10">
                  Começar Avaliação <ArrowRight size={18} />
                </button>
              </div>
            </form>
            <p className="text-center text-[10px] text-slate-500 mt-6 uppercase tracking-widest font-semibold opacity-70">
              Seus dados estão seguros
            </p>
          </div>
        </div>
        <QuizFooter />
      </div>
    );
  }

  const question = QUESTIONS[step];
  const Icon = question.icon;

  return (
    <div className="min-h-screen bg-night-900 flex flex-col justify-between overflow-hidden relative">
      <StarField />
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-night-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-accent-600 to-purple-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(99,102,241,0.8)]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Header with Logo */}
      <div className="absolute top-6 left-6 z-40">
          <Logo />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 mt-8 relative z-10">
        <div className={`max-w-2xl w-full transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
          
          {/* Header Card with Back Button and Counter */}
          <div className="flex items-center justify-between mb-8 px-2">
             <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium hover:bg-white/5 px-3 py-1.5 rounded-lg"
             >
                 <ArrowLeft size={18} /> Voltar
             </button>
             <div className="flex items-center gap-3">
                <span className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">
                  PERGUNTA {step + 1} / {QUESTIONS.length}
                </span>
             </div>
          </div>
          
          <div className="mb-10 relative">
             <div className="flex items-start gap-6">
                <div className="hidden md:flex w-20 h-20 bg-accent-500/10 rounded-2xl items-center justify-center border border-accent-500/20 flex-shrink-0">
                    <Icon size={40} className="text-accent-400" />
                </div>
                <div>
                    <div className="inline-block px-3 py-1 mb-3 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-[10px] font-bold uppercase tracking-widest">
                        {question.category}
                    </div>
                    <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-3 leading-[1.1] tracking-tight drop-shadow-lg">
                        {question.text}
                    </h2>
                    {question.subtext && (
                        <p className="text-slate-400 text-base md:text-lg font-light leading-relaxed">
                            {question.subtext}
                        </p>
                    )}
                </div>
             </div>
          </div>

          <div className="grid gap-3">
            {question.options.map((option, idx) => {
              const isSelected = answers[question.id] === option.value;
              
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full text-left p-4 md:p-5 rounded-2xl border transition-all group flex items-center justify-between shadow-sm backdrop-blur-sm relative overflow-hidden
                    ${isSelected 
                        ? 'bg-accent-600/20 border-accent-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                        : 'bg-white/[0.03] border-white/5 hover:border-accent-500/50 hover:bg-white/[0.06] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                    }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-600/0 to-accent-600/0 group-hover:to-accent-600/5 transition-all duration-500"></div>
                  
                  <div className="flex items-center gap-4 relative z-10">
                     <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-colors flex-shrink-0
                        ${isSelected 
                            ? 'bg-accent-500 border-accent-400 text-white' 
                            : 'bg-night-900/50 border-white/10 text-slate-500 group-hover:border-accent-500 group-hover:text-accent-400'
                        }`}>
                        {String.fromCharCode(65 + idx)}
                     </div>
                     <span className={`text-base md:text-lg font-medium transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                       {option.label}
                     </span>
                  </div>
                  
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all relative z-10 flex-shrink-0
                      ${isSelected ? 'border-accent-500 scale-100' : 'border-slate-700 group-hover:border-accent-500 scale-90 group-hover:scale-100'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full bg-accent-500 transition-opacity shadow-[0_0_10px_rgba(99,102,241,0.8)] ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <QuizFooter />
    </div>
  );
};