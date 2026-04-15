-- Criar tabela de denúncias se não existir
CREATE TABLE IF NOT EXISTS denuncias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  denunciante_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  motivo TEXT NOT NULL,
  status TEXT DEFAULT 'pendente',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE denuncias ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Usuário pode denunciar" ON denuncias FOR INSERT WITH CHECK (auth.uid() = denunciante_id);
CREATE POLICY IF NOT EXISTS "Admin vê denúncias" ON denuncias FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Admin atualiza denúncias" ON denuncias FOR UPDATE USING (true);
