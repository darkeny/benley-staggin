import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Newsletter } from "../Newslleter";

const Statistics: React.FC = () => {
  const [Loans, setLoans] = useState(0);
  const [Clients, setClients] = useState(0);
  const [Newsletter, setNewsletter] = useState(0);
  const [Invest, setInvest] = useState(0);

  const { ref, inView } = useInView({
    triggerOnce: true, // Garantir que a contagem aconteça apenas uma vez
    threshold: 0.1, // Iniciar a contagem quando 10% da seção estiver visível
  });

  useEffect(() => {
    if (inView) {
      const interval = setInterval(() => {
        // Valores alvo
        const targetClients = 250;
        const targetLoans = 85;
        const targetNewsletter = 854;
        const targetInvest = 50;

        // Incremento gradual dos valores
        const increment = 5; // Valor de incremento

        setLoans((prev) => (prev < targetLoans ? prev + increment : targetLoans));
        setClients((prev) => (prev < targetClients ? prev + increment : targetClients));
        setNewsletter((prev) => (prev < targetNewsletter ? prev + increment : targetNewsletter));
        setInvest((prev) => (prev < targetInvest ? prev + increment : targetInvest));

        // Condição para limpar o intervalo quando atingir os valores alvo
        if (
          Loans >= targetLoans &&
          Clients >= targetClients &&
          Newsletter >= targetNewsletter &&
          Invest >= targetInvest
        ) {
          clearInterval(interval);
        }
      }, 25); // Intervalo de tempo em milissegundos

      return () => clearInterval(interval); // Limpar intervalo ao desmontar o componente
    }
  }, [inView]);

  return (
    <div ref={ref} className="relative bottom-[1rem] sm:bottom-[1rem] left-1/2 transform -translate-x-1/2 py-10 w-full max-w-7xl pt-9 px-10">
      <div className="text-center" data-aos="zoom-in">
        <h2 className="text-base text-center font-semibold leading-4 text-indigo-600">Nossos números</h2>
        <h3 className="font-bold tracking-tight text-xl md:text-xl py-1 lg:text-4xl text-gray-900">Estatisticas dos serviços</h3>
        <p className="text-gray-600 mt-2">Fique por dentro dos números importantes da Grupo Benley.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-10 text-center">
        <div className="flex flex-col items-center py-6 rounded-lg shadow-lg" data-aos="zoom-in">
          <span className="text-2xl md:text-3xl font-extrabold text-gray-600 block"><span className="">+</span>{Clients}</span>
          <span className="text-gray-700 mt-2 block">Clientes</span>
        </div>
        <div className="flex flex-col items-center py-6 rounded-lg shadow-lg" data-aos="zoom-in">
          <span className="text-2xl md:text-3xl font-extrabold text-gray-600 block"><span className="">+</span>{Loans}</span>
          <span className="text-gray-700 mt-2 block">Empréstimos</span>
        </div>
        <div className="flex flex-col items-center py-6 rounded-lg shadow-lg" data-aos="zoom-in">
          <span className="text-2xl md:text-3xl font-extrabold text-gray-600 block"><span className="">+</span>{Invest}</span>
          <span className="text-gray-700 mt-2 block">Investidores</span>
        </div>
        <div className="flex flex-col items-center py-6 rounded-lg shadow-lg" data-aos="zoom-in">
          <span className="text-2xl md:text-3xl font-extrabold text-gray-600 block"><span className="">+</span>{Newsletter}</span>
          <span className="text-gray-700 mt-2 block">Newsletter</span>
        </div>
      </div>
    </div>
  );
};

export { Statistics };
