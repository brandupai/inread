/**
 * Diretório curado de newsletters para o Descobrir.
 *
 * Semente inicial manual — grátis, sem APIs pagas. A prazo, o plano é
 * substituir/complementar isto por um diretório que cresce sozinho a partir
 * dos dados agregados e anónimos de remetentes que os próprios utilizadores
 * já trazem para o inread (senderName/senderEmail/contextTag em Newsletter),
 * sem custo nenhum e cada vez mais afinado ao que se lê de facto.
 */

export type Categoria =
  | 'Tendências'
  | 'Tecnologia'
  | 'Negócios'
  | 'Produtividade'
  | 'Marketing'
  | 'Finanças';

export const CATEGORIAS: Categoria[] = [
  'Tendências',
  'Tecnologia',
  'Negócios',
  'Produtividade',
  'Marketing',
  'Finanças',
];

export type EntradaDiretorio = {
  id: string;
  nome: string;
  autor?: string;
  descricao: string;
  categoria: Exclude<Categoria, 'Tendências'>;
  site: string;
  cor: string; // gradiente para o avatar quando não há logo
  destaque?: boolean; // aparece também em "Tendências"
};

export const DIRETORIO: EntradaDiretorio[] = [
  {
    id: 'tldr',
    nome: 'TLDR',
    descricao: 'Resumo diário do essencial em tecnologia, startups e programação.',
    categoria: 'Tecnologia',
    site: 'https://tldr.tech',
    cor: 'linear-gradient(135deg, #0A4424, #1BE03C)',
    destaque: true,
  },
  {
    id: 'not-boring',
    nome: 'Not Boring',
    autor: 'Packy McCormick',
    descricao: 'Análises profundas sobre negócios, tecnologia e estratégia — nunca aborrecido.',
    categoria: 'Tecnologia',
    site: 'https://www.notboring.co',
    cor: 'linear-gradient(135deg, #15B832, #072E18)',
    destaque: true,
  },
  {
    id: 'stratechery',
    nome: 'Stratechery',
    autor: 'Ben Thompson',
    descricao: 'Referência em análise estratégica de tecnologia e media.',
    categoria: 'Tecnologia',
    site: 'https://stratechery.com',
    cor: 'linear-gradient(135deg, #2ACB49, #0A4424)',
  },
  {
    id: 'benedicts-newsletter',
    nome: "Benedict's Newsletter",
    autor: 'Benedict Evans',
    descricao: 'Reflexões semanais sobre tecnologia, media e os padrões por trás das notícias.',
    categoria: 'Tecnologia',
    site: 'https://www.ben-evans.com/newsletter',
    cor: 'linear-gradient(135deg, #0B6B34, #1BE03C)',
  },
  {
    id: 'platformer',
    nome: 'Platformer',
    autor: 'Casey Newton',
    descricao: 'Plataformas, redes sociais e o impacto da IA na sociedade.',
    categoria: 'Tecnologia',
    site: 'https://www.platformer.news',
    cor: 'linear-gradient(135deg, #0A4424, #15B832)',
  },
  {
    id: 'morning-brew',
    nome: 'Morning Brew',
    descricao: 'O resumo diário de negócios mais lido — rápido e com humor.',
    categoria: 'Negócios',
    site: 'https://www.morningbrew.com',
    cor: 'linear-gradient(135deg, #1BE03C, #09572C)',
    destaque: true,
  },
  {
    id: 'the-hustle',
    nome: 'The Hustle',
    descricao: 'Negócios e tecnologia contados de forma direta e descontraída.',
    categoria: 'Negócios',
    site: 'https://thehustle.co',
    cor: 'linear-gradient(135deg, #072E18, #2ACB49)',
  },
  {
    id: 'lennys-newsletter',
    nome: "Lenny's Newsletter",
    autor: 'Lenny Rachitsky',
    descricao: 'Produto, growth e carreira — por quem já liderou produto na Airbnb.',
    categoria: 'Negócios',
    site: 'https://www.lennysnewsletter.com',
    cor: 'linear-gradient(135deg, #0B6B34, #1BE03C)',
    destaque: true,
  },
  {
    id: 'first-round-review',
    nome: 'First Round Review',
    descricao: 'Histórias e lições práticas de fundadores e operadores de startups.',
    categoria: 'Negócios',
    site: 'https://review.firstround.com',
    cor: 'linear-gradient(135deg, #15B832, #0A4424)',
  },
  {
    id: 'james-clear-321',
    nome: '3-2-1 Thursday',
    autor: 'James Clear',
    descricao: 'Três ideias, duas citações, uma pergunta — hábitos e crescimento pessoal.',
    categoria: 'Produtividade',
    site: 'https://jamesclear.com/3-2-1',
    cor: 'linear-gradient(135deg, #1BE03C, #072E18)',
    destaque: true,
  },
  {
    id: 'farnam-street',
    nome: 'Brain Food',
    autor: 'Farnam Street',
    descricao: 'Pensamento crítico e tomada de decisão, semanalmente.',
    categoria: 'Produtividade',
    site: 'https://fs.blog/brain-food',
    cor: 'linear-gradient(135deg, #0A4424, #2ACB49)',
  },
  {
    id: 'marketing-brew',
    nome: 'Marketing Brew',
    descricao: 'O essencial de marketing, publicidade e media — da equipa da Morning Brew.',
    categoria: 'Marketing',
    site: 'https://www.marketingbrew.com',
    cor: 'linear-gradient(135deg, #09572C, #1BE03C)',
  },
  {
    id: 'money-stuff',
    nome: 'Money Stuff',
    autor: 'Matt Levine · Bloomberg',
    descricao: 'Mercados financeiros explicados com clareza e um humor muito próprio.',
    categoria: 'Finanças',
    site: 'https://www.bloomberg.com/account/newsletters/money-stuff',
    cor: 'linear-gradient(135deg, #072E18, #15B832)',
    destaque: true,
  },
];

export function porCategoria(categoria: Categoria): EntradaDiretorio[] {
  if (categoria === 'Tendências') return DIRETORIO.filter((n) => n.destaque);
  return DIRETORIO.filter((n) => n.categoria === categoria);
}
