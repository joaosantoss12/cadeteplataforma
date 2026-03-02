import { useEffect, useState } from 'react';
import { CheckCircle, Flame, Sparkles, Crown, X } from 'lucide-react';

interface Notification {
  id: number;
  name: string;
  action: string;
  type: 'free' | 'submundo' | 'monthly' | 'quarterly' | 'yearly';
}

const names = [
  // Masculinos (45)
  'João Silva', 'Pedro Costa', 'Carlos Ferreira', 'Miguel Pereira', 'Ricardo Sousa',
  'Tiago Lopes', 'Bruno Ribeiro', 'André Carvalho', 'Diogo Marques', 'Hugo Teixeira',
  'Rafael Monteiro', 'Gonçalo Rocha', 'Nuno Ramos', 'Daniel Correia', 'Luís Mendes',
  'Tomás Barbosa', 'Rodrigo Fonseca', 'Gabriel Cunha', 'Vasco Matos', 'Martim Neves',
  'Afonso Coelho', 'Simão Antunes', 'David Figueiredo', 'Guilherme Tavares', 'Samuel Moreira',
  'Henrique Dias', 'Filipe Batista', 'Leandro Machado', 'Eduardo Araújo', 'Marco Duarte',
  'Sérgio Morais', 'Paulo Guimarães', 'Vítor Almeida', 'Alexandre Pires', 'Fábio Cardoso',
  'Joel Baptista', 'Duarte Varela', 'Renato Andrade', 'Ivo Martins', 'Mário Cunha',
  'António Lopes', 'Jorge Almeida', 'Raúl Fonseca', 'Nelson Pinto', 'Cristiano Vieira',

  // Femininos (5)
  'Maria Santos', 'Ana Rodrigues', 'Sofia Oliveira', 'Beatriz Alves', 'Carolina Vieira'
];

const actions = {
  free: 'entrou no grupo grátis',
  submundo: 'juntou-se ao Cadete Submundo',
  monthly: 'subscreveu mensalmente o grupo Desafios',
  quarterly: 'subscreveu trimestralmente o grupo Desafios',
  yearly: 'subscreveu anualmente o grupo Desafios'
};

const icons = {
  free: CheckCircle,
  submundo: Flame,
  monthly: Sparkles,
  quarterly: Sparkles,
  yearly: Crown
};

const colors = {
  free: 'from-blue-600 to-indigo-600',
  submundo: 'from-indigo-600 to-purple-600',
  monthly: 'from-blue-500 to-indigo-500',
  quarterly: 'from-indigo-500 to-purple-500',
  yearly: 'from-purple-600 to-pink-600'
};

export default function SocialProofNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    const createNotification = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const types: Array<'free' | 'submundo' | 'monthly' | 'quarterly' | 'yearly'> = 
        ['free', 'submundo', 'monthly', 'quarterly', 'yearly'];
      const randomType = types[Math.floor(Math.random() * types.length)];

      const notification: Notification = {
        id: nextId,
        name: randomName,
        action: actions[randomType],
        type: randomType
      };

      setNotifications(prev => [...prev, notification]);
      setNextId(prev => prev + 1);

      // Remove notificação após 5 segundos
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    };

    // Primeira notificação após 15 segundos
    const initialDelay = 15000;
    const initialTimeout = setTimeout(createNotification, initialDelay);

    // Notificações subsequentes a cada 45-60 segundos
    const interval = setInterval(() => {
      createNotification();
    }, 45000 + Math.random() * 15000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [nextId]);

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none">
      {notifications.map((notification) => {
        const Icon = icons[notification.type];
        const colorClass = colors[notification.type];

        return (
          <div
            key={notification.id}
            className="pointer-events-auto animate-in slide-in-from-right duration-500 fade-in"
          >
            <div className={`bg-gradient-to-r ${colorClass} rounded-xl p-1 shadow-[0_0_30px_rgba(37,99,235,0.4)] max-w-sm`}>
              <div className="bg-[#03091a] rounded-lg px-4 py-3 flex items-center gap-3 relative">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{notification.name}</p>
                  <p className="text-blue-200/80 text-xs">{notification.action}</p>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="shrink-0 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
