const express = require('express');
const app = express();
const { createClient } = require('@supabase/supabase-js');
const helmet = require('helmet')

const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

// Load environment variables from .env file
dotenv.config();
const PORT = process.env.PORT || 4000;
// Check if environment variables are loaded correctly
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_KEY) {
  throw new Error('Missing Supabase URL or Key in environment variables');
}
// Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
// Inisialisasi postgresql
const pool = require('./config/connection');

// Import Routing
const studentRoutes = require('./routes/siswaRoutes');
const kelasRoutes = require('./routes/kelasRoutes');
const profileRoutes = require('./routes/profileRoutes');
const loginRoutes = require('./routes/login');
const konselorRoutes = require('./routes/konselorRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const PrestasiMadrasahRoutes = require('./routes/prestasiMadrasahRoutes');
const PrestasiIndividuRoutes = require('./routes/prestasiIndividuRoutes');
const usersRoutes = require('./routes/usersRoutes');
const optionRoutes = require('./routes/tingkatanJuaraRoutes');
const reguRoutes = require('./routes/reguRoutes');
const prestasiReguRoutes = require('./routes/prestasiReguRoutes');
const bimbinganRoutes = require('./routes/bimbinganRoutes');
const konselingIndividuRoutes = require('./routes/dashboardSiswa/konselingIndividuRoutes');
const rekapKonselingIndividuRoutes = require('./routes/rekapKonselingRoutes');
const waliKelasRoutes = require('./routes/waliKelasRoutes');
const kategoriPoinRoutes = require('./routes/kategoriPoinRoutes');
const poinRoutes = require('./routes/poinRoutes');
const statusKeluargaRoutes = require('./routes/statusKeluargaRoutes');
const waliSiswaRoutes = require('./routes/waliSiswaRoutes');
const konsultasiWaliSiswaRoutes = require('./routes/dashboardWaliSiswa/konsultasiRoutes')


// Router Dashboard Siswa
const prestasiIndividuSiswaRoutes = require('./routes/dashboardSiswa/prestasiIndividuRoutes');
const catatanKonselingRoutes = require('./routes/dashboardSiswa/catatanKonselingRoutes')

// Inisialisasi cors 
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));



// Inisialisasi Body Parser
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routing
app.use('/kelas', kelasRoutes);
app.use('/profile', profileRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/students', studentRoutes);
app.use('/konselor', konselorRoutes);
app.use('/auth', loginRoutes);
app.use('/users', usersRoutes);
app.use('/prestasi-madrasah', PrestasiMadrasahRoutes);
app.use('/prestasi-individu', PrestasiIndividuRoutes);
app.use('/options', optionRoutes );
app.use('/prestasi-regu', reguRoutes);
app.use('/prestasi-regu-siswa', prestasiReguRoutes)
app.use('/bidang-bimbingan', bimbinganRoutes);
app.use('/konseling-individu', konselingIndividuRoutes);
app.use('/catatan-konseling', catatanKonselingRoutes);
app.use('/rekap-konseling-individu', rekapKonselingIndividuRoutes);
app.use('/wali-kelas', waliKelasRoutes);
app.use('/poin', poinRoutes);
app.use('/kategori-poin', kategoriPoinRoutes);
app.use('/status-keluarga', statusKeluargaRoutes);
app.use('/wali-siswa', waliSiswaRoutes);
app.use('/konsultasi-wali-siswa', konsultasiWaliSiswaRoutes);


// Routing Dashboard Siswa
app.use('/prestasi-siswa', prestasiIndividuSiswaRoutes)

// Run Servers
app.listen(PORT, () => {
  console.log(`Server berjalan di localhost: ${PORT}`);
});

// Run Database
async function connect() {
  try {
    const client = await pool.connect();
    console.log('connected...');
  } catch (err) {
    console.log(err.message);
  }
}
connect();
