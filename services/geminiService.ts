import { QuizAnswers, UserData, AnalysisResult, ActionableStep, ActionPlanPhase, SupplementRecommendation } from "../types";

// Improved Sleep Analysis Service with Clinical Efficiency Calculation (Standard ISO)

export const analyzeSleep = async (user: UserData, answers: QuizAnswers): Promise<AnalysisResult> => {
  // Simula processamento complexo
  await new Promise((resolve) => setTimeout(resolve, 2000));

  let score = 100;
  const tips: string[] = [];
  const strategies: string[] = [];
  const issues: string[] = [];
  const warningFlags: string[] = [];
  const checklist: ActionableStep[] = [];

  // --- 0. EXTRAÇÃO DE VARIÁVEIS ---
  const age = answers['age'] || 'adult';
  const occupation = answers['occupation'] || 'work';
  const stressLevel = answers['stress_level'] || 'low';
  
  // Mapeamento de Inputs
  const durationInput = answers['duration'] as string;
  const latencyInput = answers['latency'] as string;
  const fragmentationInput = answers['fragmentation'] as string;

  // --- 1. CÁLCULO DE EFICIÊNCIA DO SONO (CLÍNICO) ---
  // Pergunta: "Qual é a sua média real de horas de sono? (Conte apenas tempo dormindo)"
  // Portanto: Input = TST (Total Sleep Time)
  
  const totalSleepTimeMap: Record<string, number> = {
    '<5h': 270,  // 4.5h
    '5-6h': 330, // 5.5h
    '6-7h': 390, // 6.5h
    '7-8h': 450, // 7.5h
    '>9h': 540   // 9h
  };

  const latencyMap: Record<string, number> = {
    'instant': 5,    // 5 min para dormir
    'normal': 20,    // 20 min
    'delayed': 45,   // 45 min
    'insomnia': 90   // 1h30 rolando
  };

  const wakeAfterSleepOnsetMap: Record<string, number> = {
    'none': 0,
    'once': 10,      // Levanta rapidinho
    'multiple': 30,  // Várias vezes
    'insomnia_mid': 60 // Fica acordado 1h no meio da noite
  };

  const tstMins = totalSleepTimeMap[durationInput] || 450; // Total Sleep Time
  const solMins = latencyMap[latencyInput] || 20;          // Sleep Onset Latency
  const wasoMins = wakeAfterSleepOnsetMap[fragmentationInput] || 0; // Wake After Sleep Onset

  // Fórmula Padrão Ouro: Eficiência = TST / (TST + SOL + WASO)
  const timeInBedMins = tstMins + solMins + wasoMins;
  const lostMins = solMins + wasoMins; // Tempo perdido acordado na cama
  
  const efficiency = Math.round((tstMins / timeInBedMins) * 100);

  const formatTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  // --- 2. CÁLCULO DO SCORE (PENALIDADES) ---

  // A. Penalidade de Eficiência
  if (efficiency < 85) score -= 10; // Abaixo do ideal clínico
  if (efficiency < 75) score -= 10; // Baixa eficiência
  if (efficiency < 60) score -= 15; // Insônia severa

  // B. Penalidade de Duração (Ajustada por Idade - Sleep Need)
  if (age === 'teen' || age === 'young_adult') {
      // Jovens precisam de mais sono (8h-10h)
      if (durationInput === '<5h') { score -= 30; issues.push("Déficit Crítico de Desenvolvimento (<5h)"); }
      else if (durationInput === '5-6h') { score -= 20; issues.push("Privação de Sono Severa para Idade"); }
      else if (durationInput === '6-7h') { score -= 10; issues.push("Sono Insuficiente (Ideal: +8h)"); }
  } else if (age === 'senior') {
      // Idosos toleram um pouco menos, mas fragmentação é o problema
      if (durationInput === '<5h') { score -= 20; issues.push("Sono Curto Crítico"); }
      if (wasoMins > 40) { score -= 10; issues.push("Alta Fragmentação Noturna"); }
  } else {
      // Adultos (7h-9h)
      if (durationInput === '<5h') { score -= 25; issues.push("Privação Crônica (< 5h)"); }
      else if (durationInput === '5-6h') { score -= 15; issues.push("Débito de Sono Acumulado"); }
  }

  // C. Penalidade de Consistência (Jetlag Social)
  const consistency = answers['consistency'];
  if (consistency === 'variable' || consistency === 'chaotic') {
    score -= 12;
    issues.push("Desregulação do Ritmo Circadiano");
    checklist.push({ time: 'Manhã', action: 'Acordar no mesmo horário todos os dias (inclusive domingo) para ancorar o relógio biológico.', iconType: 'sun' });
  }

  // D. Higiene do Sono (Ambiente & Hábitos)
  const screens = answers['screens'];
  if (screens === 'until_sleep' || screens === 'heavy') {
    score -= 10;
    issues.push("Supressão de Melatonina (Luz Azul)");
    checklist.push({ time: 'Noite', action: 'Regra 10-3-2-1: Cortar telas 1 hora antes de dormir, sem exceção.', iconType: 'moon' });
  }

  const caffeine = answers['caffeine'];
  if (caffeine === 'evening') {
    score -= 15;
    issues.push("Bloqueio de Adenosina (Cafeína Noturna)");
    checklist.push({ time: 'Tarde', action: 'Stop de Cafeína: Nenhuma gota de café após as 14:00.', iconType: 'coffee' });
  } else if (caffeine === 'afternoon' && latencyInput !== 'instant') {
    score -= 5; // Penalidade leve se toma à tarde e demora a dormir
    tips.push("Tente antecipar seu último café para as 13h. Metabolizadores lentos sofrem efeito por até 10h.");
  }

  const alcohol = answers['alcohol'];
  if (alcohol === 'regular' || alcohol === 'heavy') {
    score -= 15;
    issues.push("Sedação (Não é Sono Natural)");
    checklist.push({ time: 'Noite', action: 'Álcool zero 3h antes de dormir. O álcool destrói o sono REM.', iconType: 'moon' });
  }

  // E. Mente e Estresse
  const stress = answers['stress_level'];
  const mind = answers['mind'];
  
  if (stress === 'burnout' || stress === 'high') {
      score -= 15;
      issues.push("Hipervigilância do Eixo HPA (Cortisol Alto)");
      strategies.push("Protocolo de Descompressão: Banho quente + Leitura (papel) para baixar a temperatura e a frequência cardíaca.");
  }
  
  if (mind === 'racing' || mind === 'stress') {
      if (stress !== 'burnout') score -= 10; // Evita punir duas vezes se já puniu por burnout
      issues.push("Ansiedade Noturna");
      checklist.push({ time: 'Noite', action: 'Brain Dump: Escreva num papel tudo que precisa fazer amanhã para tirar da cabeça.', iconType: 'moon' });
  }

  // F. Sintomas Clínicos (Apneia, etc)
  const snoring = answers['snoring'];
  const weightImpact = answers['weight_impact'];
  const headache = answers['headache'];

  let hasMigraine = false;
  if (headache === 'migraine' || headache === 'morning') {
      hasMigraine = true;
      score -= 10;
      issues.push(headache === 'morning' ? "Cefaleia Hipnica (Sinal de Apneia)" : "Enxaqueca Crônica");
  }

  let mounjaroAlert = "";
  if (snoring === 'apnea' || snoring === 'heavy') {
    score -= 20; // Penalidade alta para risco de saúde
    issues.push("Risco Elevado de Apneia Obstrutiva");
    warningFlags.push("Seus relatos de ronco/engasgo indicam forte probabilidade de Apneia. Procure um médico do sono.");

    if (weightImpact === 'impact' || weightImpact === 'heavy') {
         mounjaroAlert = `
> 🚨 **NOTA CLÍNICA IMPORTANTE (2025):** 
> A Anvisa e órgãos internacionais (FDA) aprovaram recentemente o uso de agonistas GLP-1/GIP (como **Mounjaro/Tirzepatida**) especificamente para redução de apneia do sono em pacientes com sobrepeso. Estudos clínicos mostram redução de até 60% nos eventos de apneia apenas com o tratamento metabólico. Converse com seu endocrinologista sobre essa nova diretriz.
        `;
    }
  }

  // --- 3. AJUSTE FINO E CLAMP ---
  // Score Mínimo garantido de 18 para não ser desmotivador demais
  // Score Máximo 98 (ninguém é perfeito)
  score = Math.max(18, Math.min(98, score));

  // --- 4. GERAÇÃO DE CONTEÚDO ---

  // Resumo
  let summary = "";
  if (score >= 85) summary = "Excelente. Sua arquitetura de sono é sólida e reparadora.";
  else if (score >= 70) summary = "Bom, mas existem 'vazamentos' de energia na sua rotina.";
  else if (score >= 50) summary = "Alerta Ligado. Seu sono não está cumprindo a função biológica completa.";
  else summary = "Estado Crítico. Sua saúde física e mental está em risco devido à falta de reparação.";

  // Lógica de Cronotipo (Mais Robusta)
  let cronotipo = "Intermediário (Urso)";
  let cronotipoDesc = "Seu ciclo segue o sol. Maior produtividade entre 10h e 14h.";
  const wake = answers['waking'];
  const sunlight = answers['sunlight'];

  if (wake === 'natural' && latencyInput !== 'delayed') {
    cronotipo = "Matutino (Leão)";
    cronotipoDesc = "Você acorda com energia e 'desliga' cedo. Pico de foco pela manhã.";
  } else if (wake === 'groggy' && (latencyInput === 'delayed' || latencyInput === 'insomnia')) {
    // Check se é um Lobo real ou um Urso com maus hábitos
    if (screens === 'until_sleep' || caffeine === 'evening') {
        cronotipo = "Vespertino Mascarado (Falso Lobo)";
        cronotipoDesc = "Você parece noturno, mas provavelemente é devido à luz azul e cafeína atrasando sua melatonina. Biologicamente, você pode ser um Urso.";
    } else {
        cronotipo = "Vespertino (Lobo)";
        cronotipoDesc = "Seu pico de alerta é à noite. Dificuldade real em acordar cedo. Ideal é ajustar a rotina para começar o dia mais tarde.";
    }
  }

  const circadianProfile = `**Seu Cronotipo Estimado:** ${cronotipo}\n\n${cronotipoDesc}`;

  // Bioquímica Dinâmica
  let bioChemistry = "";
  
  if (caffeine === 'evening' || caffeine === 'afternoon') {
    bioChemistry += `- **Acúmulo de Adenosina:** A cafeína bloqueia os receptores de cansaço. Quando ela passa, você sofre um "crash", mas à noite ela impede o sono profundo.\n`;
  }
  if (screens === 'until_sleep') {
    bioChemistry += `- **Atraso de Fase da Melatonina:** A luz do celular simula a luz do sol (espectro azul), enganando seu núcleo supraquiasmático e dizendo ao cérebro que ainda é meio-dia.\n`;
  }
  if (score < 60) {
     bioChemistry += `- **Falha na Limpeza Glinfática:** Com sono curto/fragmentado, seu cérebro não consegue remover as proteínas beta-amilóides (toxinas) acumuladas durante o dia.\n`;
  }
  if (hasMigraine) {
      bioChemistry += `- **Hipersensibilidade Cortical:** A privação de sono reduz o limiar de dor do cérebro, transformando estímulos normais em gatilhos de enxaqueca.\n`;
  }
  if (bioChemistry === "") {
      bioChemistry += "- **Homeostase Equilibrada:** Seus marcadores químicos indicam um bom funcionamento, o foco deve ser apenas manter a consistência.";
  }

  const fullAnalysis = `
### Diagnóstico Clínico: ${user.name}

**Score:** ${score}/100 | **Eficiência:** ${efficiency}% (Ideal: >85%)

Você passa aproximadamente **${formatTime(timeInBedMins)} na cama**, mas seu sono real é de apenas **${formatTime(tstMins)}**. 
Isso significa que você perde **${formatTime(lostMins)}** por noite em estado de vigília (latência ou acordado).

**Principais Sabotadores Identificados:**
${issues.map(i => `- ${i}`).join('\n')}

${warningFlags.length > 0 ? `\n> ⚠️ **ATENÇÃO:** ${warningFlags[0]}` : ''}

${mounjaroAlert}

### Bioquímica do Seu Sono
${bioChemistry}

---
`;

  // --- 5. PROTOCOLOS DE RECUPERAÇÃO ---
  const recoveryPlan: ActionPlanPhase[] = [
    {
      title: "Fase 1: O Reset Biológico",
      duration: "Dias 1-7",
      focus: "Ancoragem Circadiana (Ajuste do Relógio)",
      steps: [
        `**Horário de Acordar Inegociável:** Defina um horário fixo e cumpra-o mesmo se dormir mal. Isso cria a "pressão de sono" para a noite seguinte.`,
        sunlight === 'indoor' || sunlight === 'none' 
            ? "**Protocolo de Luz:** Você precisa sair ao ar livre por 10min antes das 09:00 da manhã. A luz através da janela não é forte o suficiente." 
            : "**Manutenção Solar:** Continue sua exposição solar matinal, ela é seu principal antidepressivo natural.",
        "**Zero Calorias Líquidas à Noite:** Pare de beber álcool ou sucos 3h antes de deitar.",
        "**Banho de Contraste (Opcional):** Terminar o banho com 30s de água fria pela manhã para aumentar dopamina."
      ]
    },
    {
      title: "Fase 2: Higiene Avançada",
      duration: "Dias 8-14",
      focus: "Otimização do Ambiente e Mente",
      steps: [
        "**Caverna Paleolítica:** Seu quarto deve ser tão escuro que você não consiga ver sua mão. Use blackout ou máscara.",
        mind === 'racing' 
            ? "**Técnica 4-7-8:** Inspire 4s, segure 7s, expire 8s. Repita 4 vezes na cama para forçar o sistema parassimpático (relaxamento)." 
            : "**Leitura Física:** Troque o celular por um livro físico 30min antes de dormir.",
        "**Jantar Cedo:** Tente jantar pelo menos 2h antes de deitar para a digestão não elevar sua temperatura corporal."
      ]
    },
    {
      title: "Fase 3: Consolidação",
      duration: "Dias 15-30",
      focus: "Alta Performance e Consistência",
      steps: [
        "**Regra dos 20 Minutos:** Se não dormir em 20min, saia da cama. O cérebro não pode associar a cama com 'estar acordado e frustrado'.",
        "**NSDR (Non-Sleep Deep Rest):** Se estiver cansado à tarde, faça um Yoga Nidra de 20min em vez de tomar café.",
        "**Monitoramento:** Comece a anotar como se sente ao acordar para validar as mudanças."
      ]
    }
  ];

  if (hasMigraine) {
      recoveryPlan[0].steps.push("**Hidratação de Choque:** 500ml de água com uma pitada de sal integral logo ao acordar para suporte adrenal e cerebral.");
  }

  // --- 6. SUPLEMENTAÇÃO (EDUCACIONAL) ---
  const supplements: SupplementRecommendation[] = [];

  supplements.push({
    name: "Magnésio Bisglicinato",
    dosage: "250-350mg",
    reason: hasMigraine ? "Crucial para enxaqueca e relaxamento do sistema nervoso." : "O mineral do relaxamento. A maioria das pessoas tem deficiência.",
    timing: "1h antes de dormir"
  });

  if (mind === 'racing' || stress === 'high' || stress === 'burnout') {
    supplements.push({
      name: "L-Teanina",
      dosage: "200mg",
      reason: "Aumenta ondas Alpha no cérebro, promovendo relaxamento sem sedação. Ajuda a 'desligar' os pensamentos.",
      timing: "30-60 min antes de dormir"
    });
    supplements.push({
        name: "Ashwagandha (KSM-66)",
        dosage: "300mg",
        reason: "Gerenciamento de cortisol. Só use se sentir que o estresse é o principal vilão.",
        timing: "Pela manhã ou tarde"
      });
  }

  if ((age === 'senior' || answers['duration'] === '<5h') && !hasMigraine) {
      supplements.push({
          name: "Glicina",
          dosage: "3g",
          reason: "Ajuda a baixar a temperatura corporal central, facilitando a entrada no sono profundo.",
          timing: "1h antes de dormir"
      });
  }
  
  if (hasMigraine) {
       supplements.push({
          name: "Coenzima Q10",
          dosage: "100mg",
          reason: "Suporte mitocondrial comprovado para redução de crises de enxaqueca.",
          timing: "Manhã/Almoço"
      });
      supplements.push({
          name: "Vitamina B2 (Riboflavina)",
          dosage: "400mg",
          reason: "Padrão ouro na prevenção de enxaqueca associada a fadiga.",
          timing: "Manhã"
      });
  }

  // Apigenina (Camomila potente)
  if (latencyInput === 'delayed' || latencyInput === 'insomnia') {
      supplements.push({
          name: "Apigenina",
          dosage: "50mg",
          reason: "O composto ativo da camomila. Atua levemente nos receptores GABA para iniciar o sono.",
          timing: "1h antes de dormir"
      });
  }

  return {
    userName: user.name,
    score,
    sleepEfficiency: efficiency,
    timeInBed: formatTime(timeInBedMins),
    actualSleepTime: formatTime(tstMins),
    lostTime: formatTime(lostMins),
    summary,
    basicTips: tips,
    checklist: checklist.sort((a, b) => a.time === 'Manhã' ? -1 : 1),
    fullAnalysis,
    advancedStrategies: strategies,
    recoveryPlan,
    supplementStack: supplements,
    circadianProfile
  };
};
