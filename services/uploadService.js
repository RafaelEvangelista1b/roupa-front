const { supabase, hasSupabaseConfig } = require('../config/supabase');

async function uploadFile(file, folder = 'uploads') {
    if (!file) {
        const uploadError = new Error('Arquivo não enviado.');
        uploadError.statusCode = 400;
        throw uploadError;
    }

    const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

    if (!hasSupabaseConfig) {
        return {
            path: fileName,
            url: null,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size
        };
    }

    const { error } = await supabase.storage
        .from('uploads')
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) {
        const serviceError = new Error('Erro ao enviar arquivo.');
        serviceError.statusCode = 400;
        serviceError.details = error.message;
        throw serviceError;
    }

    const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);

    return {
        path: fileName,
        url: data.publicUrl,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size
    };
}

module.exports = {
    uploadFile
};
