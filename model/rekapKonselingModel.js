const getRekapKonselingIndividu = `
      SELECT * FROM public.konseling_individu
      WHERE created_at BETWEEN $1 AND $2
      AND bidang_bimbingan_id = $3
    `;

    module.exports = {
      getRekapKonselingIndividu
    }