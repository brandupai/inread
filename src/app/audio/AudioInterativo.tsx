'use client';

import { useEffect, useRef, useState } from 'react';
import SidebarNav from '@/components/SidebarNav';

type ItemApanhado = { id: string; titulo: string; remetente: string; texto: string };
type Podcast = { id: string; nome: string; autor: string; imagem: string | null; feedUrl: string };
type Episodio = { titulo: string; descricao: string; audioUrl: string; duracao: string | null; dataPublicacao: string | null };

type Estado = 'parado' | 'a-ler' | 'pausa';

const CATEGORIAS_PODCAST = [
  { label: 'Tecnologia', termo: 'tecnologia' },
  { label: 'Negócios', termo: 'negócios' },
  { label: 'Notícias', termo: 'notícias' },
  { label: 'Produtividade', termo: 'produtividade' },
  { label: 'Cultura', termo: 'cultura' },
];

export default function AudioInterativo({ porLer, apanhado }: { porLer: number; apanhado: ItemApanhado[] }) {
  const [secao, setSecao] = useState<'apanhado' | 'podcasts'>('apanhado');

  // --- apanhado pessoal (TTS) ---
  const [estado, setEstado] = useState<Estado>('parado');
  const [velocidade, setVelocidade] = useState(1);
  const [disponivelTts, setDisponivelTts] = useState(true);
  const velRef = useRef(1);

  useEffect(() => {
    setDisponivelTts(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => {
      try { window.speechSynthesis?.cancel(); } catch {}
    };
  }, []);

  function vozPt(): SpeechSynthesisVoice | null {
    const vs = window.speechSynthesis.getVoices();
    return (
      vs.find((v) => v.lang?.toLowerCase().startsWith('pt-pt')) ??
      vs.find((v) => v.lang?.toLowerCase().startsWith('pt')) ??
      null
    );
  }

  function textoApanhado(): string {
    return apanhado.map((i) => `${i.titulo}. Por ${i.remetente}. ${i.texto}`).join('. ');
  }

  function ler() {
    const sintese = window.speechSynthesis;
    sintese.cancel();
    const bruto = textoApanhado();
    if (!bruto) return;
    const partes = bruto.match(/[^.!?]+[.!?]*/g)?.filter((p) => p.trim().length > 1) ?? [bruto];
    const voz = vozPt();
    partes.forEach((parte, i) => {
      const u = new SpeechSynthesisUtterance(parte.trim());
      u.lang = 'pt-PT';
      u.rate = velRef.current;
      if (voz) u.voice = voz;
      if (i === partes.length - 1) u.onend = () => setEstado('parado');
      sintese.speak(u);
    });
    setEstado('a-ler');
  }

  function alternar() {
    const s = window.speechSynthesis;
    if (estado === 'parado') return ler();
    if (estado === 'a-ler') { s.pause(); return setEstado('pausa'); }
    s.resume();
    setEstado('a-ler');
  }

  function parar() {
    window.speechSynthesis.cancel();
    setEstado('parado');
  }

  function mudarVelocidade(v: number) {
    setVelocidade(v);
    velRef.current = v;
    if (estado !== 'parado') ler();
  }

  // --- diretório de podcasts (iTunes Search API + RSS público) ---
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>(CATEGORIAS_PODCAST[0].termo);
  const [consultaLivre, setConsultaLivre] = useState('');
  const [campoBusca, setCampoBusca] = useState('');
  const [resultados, setResultados] = useState<Podcast[]>([]);
  const [aCarregarResultados, setACarregarResultados] = useState(false);
  const [erroResultados, setErroResultados] = useState<string | null>(null);

  const [podcastSelecionado, setPodcastSelecionado] = useState<Podcast | null>(null);
  const [episodios, setEpisodios] = useState<Episodio[]>([]);
  const [aCarregarEpisodios, setACarregarEpisodios] = useState(false);
  const [erroEpisodios, setErroEpisodios] = useState<string | null>(null);

  const termoAtual = consultaLivre || categoriaAtiva;

  useEffect(() => {
    if (secao !== 'podcasts') return;
    let cancelado = false;
    setACarregarResultados(true);
    setErroResultados(null);
    fetch(`/api/podcasts/search?termo=${encodeURIComponent(termoAtual)}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelado) return;
        setResultados(d.podcasts ?? []);
        if (d.erro) setErroResultados(d.erro);
      })
      .catch(() => { if (!cancelado) setErroResultados('Não foi possível pesquisar podcasts agora.'); })
      .finally(() => { if (!cancelado) setACarregarResultados(false); });
    return () => { cancelado = true; };
  }, [secao, termoAtual]);

  useEffect(() => {
    if (!podcastSelecionado) return;
    let cancelado = false;
    setACarregarEpisodios(true);
    setErroEpisodios(null);
    fetch(`/api/podcasts/episodios?feed=${encodeURIComponent(podcastSelecionado.feedUrl)}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelado) return;
        setEpisodios(d.episodios ?? []);
        if (d.erro) setErroEpisodios(d.erro);
      })
      .catch(() => { if (!cancelado) setErroEpisodios('Não foi possível carregar os episódios.'); })
      .finally(() => { if (!cancelado) setACarregarEpisodios(false); });
    return () => { cancelado = true; };
  }, [podcastSelecionado]);

  function pesquisar() {
    const v = campoBusca.trim();
    if (!v) return;
    setConsultaLivre(v);
    setPodcastSelecionado(null);
  }

  function escolherCategoria(termo: string) {
    setCategoriaAtiva(termo);
    setConsultaLivre('');
    setCampoBusca('');
    setPodcastSelecionado(null);
  }

  return (
    <div className="app3">
      <SidebarNav ativo="audio" porLer={porLer} />

      {/* Coluna B */}
      <section className="col-lista">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 2px 4px' }}>
          <h1 className="t-app-forte" style={{ margin: 0, fontSize: 16, lineHeight: 1 }}>Áudio</h1>
        </div>

        <button
          type="button"
          onClick={() => setSecao('apanhado')}
          className={secao === 'apanhado' ? 'm-carta on' : 'm-carta'}
          style={{ alignItems: 'center', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <span style={{ width: 36, height: 36, borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, background: 'rgba(27,224,60,0.12)', flex: '0 0 auto' }}>🎧</span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: '1 1 auto' }}>
            <span className="t-app-forte" style={{ fontSize: 13.5, fontWeight: 700 }}>Apanhado de hoje</span>
            <span className="t-app-tenue" style={{ fontSize: 11 }}>{apanhado.length} por ler</span>
          </span>
        </button>

        <div style={{ padding: '14px 2px 4px', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }} className="t-app-tenue">
          Podcasts
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSecao('podcasts'); pesquisar(); }}
          style={{ display: 'flex', gap: 6, padding: '0 2px 6px' }}
        >
          <input
            type="search"
            value={campoBusca}
            onChange={(e) => setCampoBusca(e.target.value)}
            placeholder="Pesquisar podcasts…"
            style={{
              flex: '1 1 auto', minWidth: 0, borderRadius: 10, border: '1px solid var(--app-borda)', background: 'transparent',
              color: 'var(--app-txt)', fontFamily: 'inherit', fontSize: 12.5, padding: '8px 10px',
            }}
          />
        </form>

        {CATEGORIAS_PODCAST.map((c) => (
          <button
            key={c.termo}
            type="button"
            onClick={() => { setSecao('podcasts'); escolherCategoria(c.termo); }}
            className={secao === 'podcasts' && !consultaLivre && categoriaAtiva === c.termo ? 'f-chip on' : 'f-chip'}
            style={{ border: secao === 'podcasts' && !consultaLivre && categoriaAtiva === c.termo ? undefined : '1px solid var(--app-borda-forte)', cursor: 'pointer', fontFamily: 'inherit', marginRight: 6, marginBottom: 6 }}
          >
            {c.label}
          </button>
        ))}

        <p className="t-app-tenue" style={{ fontSize: 12, lineHeight: 1.6, padding: '10px 2px 2px' }}>
          Diretório alimentado pelo catálogo público de podcasts — grátis, sem conta nem chave.
        </p>
      </section>

      {/* Coluna C */}
      <main className="col-leitor" style={{ alignItems: secao === 'apanhado' ? 'center' : 'stretch', justifyContent: 'flex-start', overflowY: 'auto' }}>
        {secao === 'apanhado' ? (
          <div style={{ margin: 'auto', textAlign: 'center', padding: 32, maxWidth: 480 }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>🎧</div>
            <p style={{ fontWeight: 700, fontSize: 18, color: 'var(--leitor-txt)', marginBottom: 6 }}>Apanhado de hoje</p>

            {apanhado.length === 0 ? (
              <p style={{ fontSize: 14, color: 'var(--leitor-txt-fraco)', lineHeight: 1.6 }}>
                Sem newsletters por ler — a tua caixa está em dia. Volta quando chegar algo novo.
              </p>
            ) : (
              <>
                <p style={{ fontSize: 13.5, color: 'var(--leitor-txt-fraco)', lineHeight: 1.6, marginBottom: 18 }}>
                  As últimas {apanhado.length} newsletters por ler, lidas em voz alta — com a voz portuguesa do teu
                  dispositivo.
                </p>

                {!disponivelTts ? (
                  <p style={{ fontSize: 13, color: 'var(--leitor-txt-fraco)' }}>O teu browser não suporta leitura em voz alta.</p>
                ) : (
                  <>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 14 }}>
                      <button
                        type="button"
                        onClick={alternar}
                        style={{ border: 'none', borderRadius: 999, background: '#1be03c', color: '#052e16', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, padding: '12px 26px', cursor: 'pointer' }}
                      >
                        {estado === 'a-ler' ? '⏸ Pausar' : estado === 'pausa' ? '▶ Continuar' : '▶ Ouvir apanhado'}
                      </button>
                      {estado !== 'parado' && (
                        <button type="button" onClick={parar} className="lt-btn" title="Parar" aria-label="Parar">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2" /></svg>
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 22 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--leitor-txt-fraco)' }}>Velocidade</span>
                      {[0.85, 1, 1.25, 1.5].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => mudarVelocidade(v)}
                          style={{
                            border: `1px solid ${velocidade === v ? '#1be03c' : 'var(--leitor-borda)'}`,
                            background: velocidade === v ? 'rgba(27,224,60,0.14)' : 'transparent', color: 'var(--leitor-txt)',
                            borderRadius: 8, fontFamily: 'inherit', fontSize: 11.5, fontWeight: 700, padding: '5px 10px', cursor: 'pointer',
                          }}
                        >
                          {v}×
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {apanhado.map((i) => (
                    <div key={i.id} style={{ borderRadius: 12, padding: '10px 14px', background: 'var(--app-painel)', border: '1px solid var(--app-borda)' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--leitor-txt)' }}>{i.titulo}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--leitor-txt-fraco)' }}>{i.remetente}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: 880, margin: '0 auto', padding: '28px 24px 40px' }}>
            {podcastSelecionado ? (
              <>
                <button
                  type="button"
                  onClick={() => setPodcastSelecionado(null)}
                  style={{ border: 'none', background: 'transparent', color: 'var(--leitor-txt-fraco)', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer', marginBottom: 16, padding: 0 }}
                >
                  ‹ Voltar aos resultados
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                  {podcastSelecionado.imagem && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={podcastSelecionado.imagem} alt="" width={64} height={64} style={{ borderRadius: 12, flex: '0 0 auto' }} />
                  )}
                  <div>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--leitor-txt)' }}>{podcastSelecionado.nome}</h2>
                    <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--leitor-txt-fraco)' }}>{podcastSelecionado.autor}</p>
                  </div>
                </div>

                {aCarregarEpisodios && <p style={{ color: 'var(--leitor-txt-fraco)', fontSize: 14 }}>A carregar episódios…</p>}
                {erroEpisodios && <p style={{ color: 'var(--leitor-txt-fraco)', fontSize: 14 }}>{erroEpisodios}</p>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {episodios.map((ep, i) => (
                    <div key={i} style={{ borderRadius: 14, padding: 14, background: 'var(--app-painel)', border: '1px solid var(--app-borda)' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--leitor-txt)', marginBottom: 4 }}>{ep.titulo}</div>
                      {ep.descricao && <div style={{ fontSize: 12.5, color: 'var(--leitor-txt-fraco)', lineHeight: 1.5, marginBottom: 10 }}>{ep.descricao}</div>}
                      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                      <audio controls preload="none" src={ep.audioUrl} style={{ width: '100%', height: 34 }} />
                    </div>
                  ))}
                </div>

                {!aCarregarEpisodios && episodios.length === 0 && !erroEpisodios && (
                  <p style={{ color: 'var(--leitor-txt-fraco)', fontSize: 14 }}>Este podcast não tem episódios disponíveis.</p>
                )}
              </>
            ) : (
              <>
                <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: 'var(--leitor-txt)' }}>
                  {consultaLivre ? `Resultados para "${consultaLivre}"` : CATEGORIAS_PODCAST.find((c) => c.termo === categoriaAtiva)?.label}
                </h2>

                {aCarregarResultados && <p style={{ color: 'var(--leitor-txt-fraco)', fontSize: 14 }}>A pesquisar…</p>}
                {erroResultados && <p style={{ color: 'var(--leitor-txt-fraco)', fontSize: 14 }}>{erroResultados}</p>}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                  {resultados.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPodcastSelecionado(p)}
                      style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
                    >
                      {p.imagem ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.imagem} alt="" style={{ width: '100%', aspectRatio: '1', borderRadius: 14, objectFit: 'cover' }} />
                      ) : (
                        <span style={{ width: '100%', aspectRatio: '1', borderRadius: 14, background: 'linear-gradient(135deg, #1BE03C, #09572C)', display: 'block' }} />
                      )}
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--leitor-txt)', lineHeight: 1.3 }}>{p.nome}</span>
                      <span style={{ fontSize: 11.5, color: 'var(--leitor-txt-fraco)' }}>{p.autor}</span>
                    </button>
                  ))}
                </div>

                {!aCarregarResultados && resultados.length === 0 && !erroResultados && (
                  <p style={{ color: 'var(--leitor-txt-fraco)', fontSize: 14 }}>Sem resultados para esta pesquisa.</p>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
