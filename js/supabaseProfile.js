(function() {
    'use strict';

    if (!window.sb) {
        console.warn('Supabase client not ready for profile API');
        return;
    }

    var PROFILES_TABLE = 'profiles';
    var AVATAR_BUCKET = 'avatars';

    async function getCurrentUser() {
        var res = await window.sb.auth.getUser();
        return res && res.data ? res.data.user : null;
    }

    async function fetchProfile() {
        var user = await getCurrentUser();
        if (!user) return null;
        var res = await window.sb.from(PROFILES_TABLE)
            .select('*')
            .eq('id', user.id)
            .single();
        if (res.error && res.error.code !== 'PGRST116') throw res.error;
        return res.data || null;
    }

    async function upsertProfile(profile) {
        var user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');
        var payload = Object.assign({ id: user.id, email: user.email }, profile);
        var res = await window.sb.from(PROFILES_TABLE).upsert(payload, { onConflict: 'id' }).select().single();
        if (res.error) throw res.error;
        return res.data;
    }

    async function uploadAvatar(file) {
        var user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');
        var fileExt = (file.name && file.name.split('.').pop()) || 'jpg';
        var filePath = user.id + '/' + Date.now() + '.' + fileExt;
        var uploadRes = await window.sb.storage.from(AVATAR_BUCKET).upload(filePath, file, { upsert: true });
        if (uploadRes.error) throw uploadRes.error;
        var urlRes = window.sb.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);
        return (urlRes && urlRes.data && urlRes.data.publicUrl) || null;
    }

    window.afzProfileApi = {
        fetchProfile: fetchProfile,
        upsertProfile: upsertProfile,
        uploadAvatar: uploadAvatar
    };
})();

