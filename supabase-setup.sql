-- ================================================
-- BAZAR ABSOLUTO USA - Estrutura do Banco de Dados
-- Cole esse código no SQL Editor do Supabase
-- ================================================

-- Tabela de perfis de usuários
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT,
  cidade TEXT,
  estado TEXT DEFAULT 'Massachusetts',
  pais_origem TEXT DEFAULT 'Brasil',
  profissao TEXT,
  bio TEXT,
  foto_url TEXT,
  capa_url TEXT,
  role TEXT DEFAULT 'user', -- 'user', 'moderador', 'admin'
  status TEXT DEFAULT 'ativo', -- 'ativo', 'suspenso', 'banido'
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de posts
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  autor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  conteudo TEXT,
  imagem_url TEXT,
  video_url TEXT,
  tipo TEXT DEFAULT 'post', -- 'post', 'emprego', 'servico', 'noticia'
  status TEXT DEFAULT 'pendente', -- 'pendente', 'aprovado', 'reprovado'
  patrocinado BOOLEAN DEFAULT FALSE,
  curtidas INTEGER DEFAULT 0,
  comentarios INTEGER DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de curtidas
CREATE TABLE curtidas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, usuario_id)
);

-- Tabela de comentários
CREATE TABLE comentarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  autor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de empregos
CREATE TABLE empregos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  autor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  empresa TEXT NOT NULL,
  cidade TEXT,
  estado TEXT,
  salario TEXT,
  tipo TEXT, -- 'Tempo integral', 'Meio período', 'Freelance'
  descricao TEXT,
  requisitos TEXT[],
  status TEXT DEFAULT 'pendente',
  destaque BOOLEAN DEFAULT FALSE,
  urgente BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de serviços
CREATE TABLE servicos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  autor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  nome_profissional TEXT NOT NULL,
  servico TEXT NOT NULL,
  categoria TEXT,
  cidade TEXT,
  estado TEXT,
  preco TEXT,
  descricao TEXT,
  whatsapp TEXT,
  foto_url TEXT,
  avaliacao DECIMAL DEFAULT 0,
  total_avaliacoes INTEGER DEFAULT 0,
  destaque BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pendente',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de denúncias
CREATE TABLE denuncias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  denunciante_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  motivo TEXT NOT NULL,
  status TEXT DEFAULT 'pendente',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de anúncios pagos
CREATE TABLE anuncios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  autor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tipo TEXT, -- 'post', 'emprego', 'servico'
  referencia_id UUID,
  plano TEXT, -- 'basico', 'destaque', 'premium'
  valor DECIMAL,
  status TEXT DEFAULT 'pendente', -- 'pendente', 'pago', 'ativo', 'expirado'
  inicio_em TIMESTAMP WITH TIME ZONE,
  expira_em TIMESTAMP WITH TIME ZONE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- FUNÇÃO: Criar perfil ao registrar usuário
-- ================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, nome, telefone, cidade, estado, pais_origem, profissao, bio)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário'),
    NEW.raw_user_meta_data->>'telefone',
    NEW.raw_user_meta_data->>'cidade',
    COALESCE(NEW.raw_user_meta_data->>'estado', 'Massachusetts'),
    COALESCE(NEW.raw_user_meta_data->>'pais_origem', 'Brasil'),
    NEW.raw_user_meta_data->>'profissao',
    NEW.raw_user_meta_data->>'bio'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ================================================
-- SEGURANÇA (Row Level Security)
-- ================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE curtidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE empregos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Perfis públicos" ON profiles FOR SELECT USING (true);
CREATE POLICY "Usuário edita próprio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Posts aprovados são públicos" ON posts FOR SELECT USING (status = 'aprovado');
CREATE POLICY "Usuário cria post" ON posts FOR INSERT WITH CHECK (auth.uid() = autor_id);
CREATE POLICY "Usuário edita próprio post" ON posts FOR UPDATE USING (auth.uid() = autor_id);

CREATE POLICY "Curtidas públicas" ON curtidas FOR SELECT USING (true);
CREATE POLICY "Usuário curte" ON curtidas FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Usuário descurte" ON curtidas FOR DELETE USING (auth.uid() = usuario_id);

CREATE POLICY "Comentários públicos" ON comentarios FOR SELECT USING (true);
CREATE POLICY "Usuário comenta" ON comentarios FOR INSERT WITH CHECK (auth.uid() = autor_id);

CREATE POLICY "Empregos aprovados públicos" ON empregos FOR SELECT USING (status = 'aprovado');
CREATE POLICY "Usuário cria emprego" ON empregos FOR INSERT WITH CHECK (auth.uid() = autor_id);

CREATE POLICY "Serviços aprovados públicos" ON servicos FOR SELECT USING (status = 'aprovado');
CREATE POLICY "Usuário cria serviço" ON servicos FOR INSERT WITH CHECK (auth.uid() = autor_id);

-- Tabela de denúncias (adicionar se não existir)
CREATE TABLE IF NOT EXISTS denuncias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  denunciante_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  motivo TEXT NOT NULL,
  descricao TEXT,
  status TEXT DEFAULT 'pendente',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE denuncias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuário cria denúncia" ON denuncias FOR INSERT WITH CHECK (auth.uid() = denunciante_id);
CREATE POLICY "Admin vê denúncias" ON denuncias FOR SELECT USING (true);
CREATE POLICY "Admin atualiza denúncias" ON denuncias FOR UPDATE USING (true);
