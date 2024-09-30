const pool = require('../config/connection');
const queries = require('../model/rekapKonselingModel');
const { Parser } = require('json2csv');
const { PDFDocument, rgb } = require('pdf-lib');

const getRekapKonselingIndividu = async (req, res) => {
    const { startDate, endDate, bidangBimbinganId, format } = req.query;
    try {
        // Query the database
    const result = await pool.query(queries.getRekapKonselingIndividu, [startDate, endDate, bidangBimbinganId]);
    const data = result.rows;

    // Handle CSV export
    if (format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(data);
      res.header('Content-Type', 'text/csv');
      res.attachment('rekap_konseling_individu.csv');
      return res.send(csv);
    }

    // Handle PDF export
    if (format === 'pdf') {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      const { height } = page.getSize();
      page.drawText('Rekap Konseling Individu', {
        x: 50,
        y: height - 50,
        size: 30,
        color: rgb(0, 0, 0),
      });

      // Add data to PDF
      data.forEach((row, index) => {
        page.drawText(`ID: ${row.id}, Nama Siswa: ${row.student_id}, Judul Pengaduan: ${row.judul_pengaduan}`, {
          x: 50,
          y: height - 100 - (index * 20),
          size: 12,
          color: rgb(0, 0, 0),
        });
      });

      const pdfBytes = await pdfDoc.save();
      res.header('Content-Type', 'application/pdf');
      res.attachment('rekap_konseling_individu.pdf');
      return res.send(pdfBytes);
    }

    // Default to JSON
    res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ msg: 'Error fetching data' });
    };
};

module.exports = {
    getRekapKonselingIndividu
}