const pool = require('../config/connection');
const { getTingkatan, getJuara } = require('../model/tingkatanJuaraModel')

// Dapatkan id juara 
const getJuaraOptions = async (req, res) => {
    try {
        const {rows} = await pool.query(getJuara);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching juara options:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    };
};

// Dapatkan id tingkatan 
const getTingkatanOptions = async (req, res) => {
    try {
        const {rows} = await pool.query(getTingkatan);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching tingkatan juara options:", error);
        res.status(500).json({ msg: "Internal Server Error" });
        
    };
};

module.exports = {
    getJuaraOptions,
    getTingkatanOptions
}