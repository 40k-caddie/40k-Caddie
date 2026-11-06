/* 40k Caddie: account storage outside Claude, on Supabase.
   It offers the same small interface the app already uses inside Claude (user, db, assets),
   so the app code does not care which one it is talking to. */
(function () {
  'use strict';
  const URL = 'https://tgwhmyktpibcpivakwwn.supabase.co';
  const KEY = 'sb_publishable_OQUa3i86YIeb_IG3B8EbjQ_x5oh7VX5'; // the publishable key: meant to sit in the app
  if (!window.supabase || !window.supabase.createClient) return;
  const sb = window.supabase.createClient(URL, KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });

  async function uid() { try { const { data } = await sb.auth.getSession(); return (data && data.session && data.session.user.id) || null; } catch (e) { return null; } }
  const err = (e) => { const x = new Error((e && e.message) || 'storage error'); x.code = (e && e.code) || 'error'; return x; };

  // a document is one row: (owner, path) -> data. "news/..." lives in a table everyone can read.
  function doc(path) {
    const pub = /^news\//.test(path);
    const ref = {
      id: path.split('/').pop(),
      async get() {
        const q = pub ? sb.from('public_docs').select('data').eq('path', path) : sb.from('docs').select('data').eq('path', path).eq('owner', await uid());
        const { data, error } = await q.maybeSingle();
        if (error) throw err(error);
        return { exists: !!data, id: ref.id, data: () => (data ? data.data : undefined) };
      },
      async set(obj) {
        const owner = await uid(); if (!owner) throw err({ code: 'not_signed_in' });
        const { error } = await sb.from('docs').upsert({ owner, path, data: obj, updated_at: new Date().toISOString() }, { onConflict: 'owner,path' });
        if (error) throw err(error);
      },
      async delete() {
        const owner = await uid(); if (!owner) return;
        const { error } = await sb.from('docs').delete().eq('owner', owner).eq('path', path);
        if (error) throw err(error);
      },
      onSnapshot(cb, onErr) {
        uid().then((owner) => {
          if (!owner) return;
          sb.channel('doc:' + path).on('postgres_changes', { event: '*', schema: 'public', table: 'docs', filter: 'path=eq.' + path }, (p) => {
            const row = p.new && p.new.path ? p.new : null;
            if (row && row.owner !== owner) return;
            cb({ exists: !!row, id: ref.id, data: () => (row ? row.data : undefined), metadata: { hasPendingWrites: false } });
          }).subscribe((st, e) => { if (st === 'CHANNEL_ERROR' && onErr) onErr(e); });
        });
        return () => {};
      },
      collection(name) { return collection(path + '/' + name); },
    };
    return ref;
  }
  function collection(prefix) {
    return {
      doc: (id) => doc(prefix + '/' + id),
      async get() {
        const { data, error } = await sb.from('docs').select('path,data').eq('owner', await uid()).like('path', prefix + '/%');
        if (error) throw err(error);
        const docs = (data || []).filter((r) => r.path.slice(prefix.length + 1).indexOf('/') < 0)
          .map((r) => ({ id: r.path.slice(prefix.length + 1), exists: true, data: () => r.data }));
        return { docs, forEach: (f) => docs.forEach(f), size: docs.length };
      },
    };
  }

  // images people add go in a public bucket, in a folder named after their account
  const assets = {
    async upload(blob) {
      const owner = await uid(); if (!owner) throw err({ code: 'not_signed_in' });
      const ext = ((blob.type || 'image/png').split('/')[1] || 'png').replace(/[^a-z0-9]/g, '');
      const name = owner + '/' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8) + '.' + ext;
      const { error } = await sb.storage.from('images').upload(name, blob, { contentType: blob.type || 'image/png', upsert: false });
      if (error) throw err(error);
      return { id: 'sb:' + name };
    },
    async delete(id) { if (id && id.startsWith('sb:')) await sb.storage.from('images').remove([id.slice(3)]); },
  };

  window.CADDIE_SB = {
    client: sb,
    url: URL,
    publicUrl: (path) => URL + '/storage/v1/object/public/images/' + path,
    async use(name) {
      if (name === 'user') return { id: uid, email: async () => { const { data } = await sb.auth.getSession(); return (data && data.session && data.session.user.email) || ''; } };
      if (name === 'db') return { doc };
      if (name === 'assets') return assets;
      return null;
    },
    // sign in with a 6 digit code sent by email (works inside a home-screen app, where links open elsewhere)
    async sendCode(email) { const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: location.origin + location.pathname } }); if (error) throw err(error); },
    async verifyCode(email, token) { const { error } = await sb.auth.verifyOtp({ email, token, type: 'email' }); if (error) throw err(error); },
    async signInGoogle() { const { error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + location.pathname } }); if (error) throw err(error); },
    async signOut() { await sb.auth.signOut(); },
    uid,
  };
})();
