-- Corrigir políticas para admin poder aprovar posts
DROP POLICY IF EXISTS "Admin aprova posts" ON posts;
DROP POLICY IF EXISTS "Usuário edita próprio post" ON posts;

-- Admin pode atualizar qualquer post
CREATE POLICY "Admin pode atualizar posts" ON posts 
FOR UPDATE USING (true);

-- Usuário pode criar post
DROP POLICY IF EXISTS "Usuário cria post" ON posts;
CREATE POLICY "Usuário cria post" ON posts 
FOR INSERT WITH CHECK (auth.uid() = autor_id);

-- Todos podem ver posts aprovados
DROP POLICY IF EXISTS "Posts públicos" ON posts;
CREATE POLICY "Posts públicos" ON posts 
FOR SELECT USING (true);

-- Corrigir empregos
DROP POLICY IF EXISTS "Empregos públicos" ON empregos;
CREATE POLICY "Empregos públicos" ON empregos FOR SELECT USING (true);
DROP POLICY IF EXISTS "Usuário cria emprego" ON empregos;
CREATE POLICY "Usuário cria emprego" ON empregos FOR INSERT WITH CHECK (auth.uid() = autor_id);
CREATE POLICY "Admin atualiza emprego" ON empregos FOR UPDATE USING (true);

-- Corrigir serviços  
DROP POLICY IF EXISTS "Serviços públicos" ON servicos;
CREATE POLICY "Serviços públicos" ON servicos FOR SELECT USING (true);
DROP POLICY IF EXISTS "Usuário cria serviço" ON servicos;
CREATE POLICY "Usuário cria serviço" ON servicos FOR INSERT WITH CHECK (auth.uid() = autor_id);
CREATE POLICY "Admin atualiza serviço" ON servicos FOR UPDATE USING (true);

-- Corrigir perfis
DROP POLICY IF EXISTS "Usuário edita próprio perfil" ON profiles;
CREATE POLICY "Usuário edita próprio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin edita perfis" ON profiles FOR UPDATE USING (true);
