// profileController.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Inisialisasi Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);

// Function untuk upload file
const uploadProfileImage = async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const { data, error } = await supabase.storage
            .from('profile-images')
            .upload(`public/${file.originalname}`, file.buffer, {
                contentType: file.mimetype,
            });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const publicUrl = supabase.storage
            .from('profile-images')
            .getPublicUrl(`public/${file.originalname}`).publicURL;

        res.status(200).json({ url: publicUrl });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
};

// Function untuk download file
const downloadProfileImage = async (req, res) => {
    const { filename } = req.params;

    try {
        const { data, error } = await supabase.storage
            .from('profile-images')
            .download(`public/${filename}`);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', data.type);
        data.stream().pipe(res);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'Failed to download file' });
    }
};

// Function untuk mendapatkan URL gambar profil
const getProfileImage = async (req, res) => {
    const { userId } = req.params; // Misalnya userId didapat dari parameter URL

    try {
        // Lakukan pengambilan data dari Supabase sesuai dengan userId
        // Misalnya, jika Anda menyimpan URL gambar di database, Anda dapat mengambilnya langsung
        // Di sini, diasumsikan bahwa Anda mengambil dari tabel yang sesuai
        const { data, error } = await supabase
            .from('profiles')
            .select('profile_image_url')
            .eq('user_id', userId)
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (!data) {
            return res.status(404).json({ error: 'Profile image not found' });
        }

        res.status(200).json({ url: data.profile_image_url });
    } catch (error) {
        console.error('Error fetching profile image:', error);
        res.status(500).json({ error: 'Failed to fetch profile image' });
    }
};

module.exports = {
    uploadProfileImage,
    downloadProfileImage,
    getProfileImage,
};
