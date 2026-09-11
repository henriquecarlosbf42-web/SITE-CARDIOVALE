export interface Review {
  name: string;
  rating: number;
  body: string;
}

export const googleRating = {
  score: 4.5,
  count: 663,
  category: "Cardiologista",
};

/**
 * Avaliações reais extraídas de prints do Google (public/images/avaliacoes/).
 */
export const reviews: Review[] = [
  {
    name: "Marianne Gouveia Guerra",
    rating: 5,
    body: "Doutor é quem tem Doutorado! E isso o Dr João Manoel tem e tem de sobra! Além de ser um expert em ecocardiograma, o cara é um querido!! Eu tive uns contratempos e ele que me salvou, me virou da cabeça aos pés!, pega o estetoscópio e examina mesmo! Assim a Anamnese é completa! Eu encho ele de perguntas, um fofo... parece um paizão, responde tudo... as resenhas são maravilhosas, fico umas duas horas conversando com ele. O currículo do cara é pesado, pergunto tudo... lógico, faço valer o canudo da USP! E olha de quem o cara foi médico... sem comentários.",
  },
  {
    name: "Regiane Varolo",
    rating: 5,
    body: "Atendimento maravilhoso desde a recepção até o consultório. Dr. Vitor excelente médico e Dr. João também.",
  },
  {
    name: "Tiago Dias",
    rating: 5,
    body: "A clínica é maravilhosa, pude fazer meus exames aqui, o Dr João Manoel e Dr Francisco são super humanos e explicam as coisas com delicadeza e clareza. Se você tá pesquisando bom profissional acabou de encontrar.",
  },
  {
    name: "Flavinha",
    rating: 5,
    body: "Excelente atendimento, desde o agendamento e todos exames. O atendimento do Dr Victor é ótimo, muito atencioso e excelente profissional. Estou acompanhando meu esposo que é paciente dele.",
  },
  {
    name: "Mauro Marcondes",
    rating: 5,
    body: "Fui pela primeira vez na clínica, realizei os exames de Holter e ecocardiograma e correu tudo super bem. A recepção é muito bem estruturada, todos atendem com muita educação e correu tudo maravilhosamente bem. Desejo melhoras ao Dr. João Manoel, que mesmo com o braço com uma tipóia estava atendendo à todos com bom humor e educação, dá pra ver que ele ama a profissão dele (cardiologista). Clínica de primeiro mundo.",
  },
  {
    name: "Renata Gonçalves",
    rating: 5,
    body: "Bom dia. Fui em dois dias consecutivos para colocação de mapa e retirada do mesmo e outros exames no dia seguinte. Da recepção até o final do atendimento, todos os profissionais extremamente atenciosos e comprometidos com a excelência no atendimento. Obrigada pela atenção de todos.",
  },
  {
    name: "Ezequiel Teixeira da Silva",
    rating: 5,
    body: "Experiência muito boa... O atendimento, local e a música ambiente colaboraram muito para realizar o exame de forma tranquila e satisfatória. Fiz o teste Ergométrico e Ecodopplercardiograma... Da recepção até ir embora só alegria! Estão de parabéns!",
  },
  {
    name: "Márcio Rogério",
    rating: 5,
    body: "Atendida pelo Doutor Victor, ponderado, amoroso e atencioso. Foi meu primeiro atendimento e ele transmite confiança. A Clínica é super atenciosa e proativa. Uma dica: acho interessante disponibilizar a opção do cliente receber dicas pelo whatsapp sobre estacionamento para quem vem de carro e meios de transporte público para quem usa essa opção. Facilita na hora da chegada. Merece nota máxima. Obrigado.",
  },
  {
    name: "Marcio Barbosa",
    rating: 5,
    body: "Fui muito bem atendido pelo Dr. Victor e sua equipe. Médico competente, cuidadoso e atencioso! Agradeço pelos cuidados prestados a mim por toda a equipe da Clínica Cardiovale.",
  },
  {
    name: "Josmar Martinho",
    rating: 5,
    body: "Fui muito bem recebido por todos os profissionais. Destaco a pontualidade no atendimento.",
  },
  {
    name: "Marcio Linhares",
    rating: 5,
    body: "Ambiente confortável, recepcionistas muito simpáticas e acolhedoras. O Dr João Manoel é um excelente profissional, muito receptivo e atento às necessidades do paciente. Grata a todos! (Refere-se ao atendimento da minha esposa, Maria Angela.)",
  },
  {
    name: "Ana Lúcia Fonseca Pereira",
    rating: 5,
    body: "Atendimento rápido, atendentes gentis. Consulta não demorou e durou o tempo suficiente para troca de informações e perguntas pertinentes que foram adequadamente valorizadas. Saí com todos os pedidos de exames e orientação de onde realizá-los. Recomendo.",
  },
  {
    name: "Nei Primon",
    rating: 5,
    body: "Minha visita a esse lugar, foi ótimo, fui bem atendido pela recepção, tudo muito rápido, e também muito bem atendido pelo médico, excelente profissional, muito atencioso, e com pleno conhecimento na área.",
  },
  {
    name: "Gerson Rodolfo",
    rating: 5,
    body: "Fui muito bem recebido pelas recepcionistas e nota dez para o profissional que realizou o exame, muito educado e experiente, eu indico.",
  },
  {
    name: "Renata Mendes",
    rating: 5,
    body: "Atendimento com qualidade e pontualidade. Ambiente climatizado, presteza no atendimento da recepção e também na realização do exame, todas as orientações foram muito claras desde o preparo até a realização do exame. Recomendo.",
  },
  {
    name: "Vanessa Aparecida de Siqueira dos S.",
    rating: 4,
    body: "O Doutor Victor é muito atencioso e também explica muito bem. Gostei muito do atendimento em geral.",
  },
  {
    name: "Patricia Bonelli",
    rating: 5,
    body: "Eu e meus filhos utilizamos os serviços da Cardiovale, a clínica é ágil, tem ótimas instalações e profissionais maravilhosos. Além das consultas eles também fazem exames o quê torna tudo mais fácil. O dr. Vitor é simpático e criterioso.",
  },
];
