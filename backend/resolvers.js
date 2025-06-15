const db = require("./db");
const pool = require('./db');

const resolvers = {
  Query: {
    getRawatJalan: async () => {
      const result = await db.query(`
        SELECT 
          id_rawat_jalan, 
          TO_CHAR(tanggal_kunjungan, 'YYYY-MM-DD') AS tanggal_kunjungan, 
          keluhan, 
          catatan_dokter, 
          status 
        FROM rawat_jalan
      `);
      return result.rows;
    },
    getTindakanJalan: async () => {
      const result = await db.query(`
        SELECT 
          id_tindakan_jalan, 
          kode_icd10, 
          nama_tindakan, 
          TO_CHAR(tanggal_tindakan, 'YYYY-MM-DD') AS tanggal_tindakan
        FROM tindakan_jalan
      `);
      return result.rows;
    },
    getDiagnosaJalan: async () => {
      const result = await db.query("SELECT * FROM diagnosa_jalan");
      return result.rows;
    },
    rawatJalanByKunjungan: async (_, { id_kunjungan }) => {
      const client = await pool.connect();

      try {
        // Ambil data rawat_jalan berdasarkan id_kunjungan
        const rawatJalanResult = await client.query(
          'SELECT * FROM rawat_jalan WHERE id_kunjungan = $1 LIMIT 1',
          [id_kunjungan]
        );

        const rawatJalan = rawatJalanResult.rows[0];
        if (!rawatJalan) return null;

        // Ambil diagnosa_jalan berdasarkan id_rawat_jalan
       const diagnosaResult = await client.query(
          'SELECT * FROM diagnosa_jalan WHERE id_rawat_jalan = $1 LIMIT 1',
          [rawatJalan.id_rawat_jalan]
        );

        const diagnosa = diagnosaResult.rows[0] || null;

        return {
          ...rawatJalan,
          diagnosa,
        };
      } finally {
        client.release();
      }
    }

  },
  Mutation: {
    tambahRawatJalan: async (_, { tanggal_kunjungan, keluhan, catatan_dokter, status, id_kunjungan }) => {
      const result = await db.query(
        `INSERT INTO rawat_jalan (tanggal_kunjungan, keluhan, catatan_dokter, status, id_kunjungan)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [tanggal_kunjungan, keluhan, catatan_dokter, status, id_kunjungan]
      );
      return result.rows[0];
    },
    updateRawatJalan: async (_, { id_rawat_jalan, tanggal_kunjungan, keluhan, catatan_dokter, status }) => {
      const result = await db.query(
        `UPDATE rawat_jalan SET tanggal_kunjungan=$2, keluhan=$3, catatan_dokter=$4, status=$5
         WHERE id_rawat_jalan=$1 RETURNING *`,
        [id_rawat_jalan, tanggal_kunjungan, keluhan, catatan_dokter, status]
      );
      return result.rows[0];
    },
    hapusRawatJalan: async (_, { id_rawat_jalan }) => {
      await db.query("DELETE FROM rawat_jalan WHERE id_rawat_jalan=$1", [id_rawat_jalan]);
      return true;
    },

    tambahTindakanJalan: async (_, { kode_icd10, nama_tindakan, tanggal_tindakan }) => {
      const result = await db.query(
        `INSERT INTO tindakan_jalan (kode_icd10, nama_tindakan, tanggal_tindakan)
         VALUES ($1, $2, $3) RETURNING *`,
        [kode_icd10, nama_tindakan, tanggal_tindakan]
      );
      return result.rows[0];
    },
    updateTindakanJalan: async (_, { id_tindakan_jalan, kode_icd10, nama_tindakan, tanggal_tindakan }) => {
      const result = await db.query(
        `UPDATE tindakan_jalan SET kode_icd10=$2, nama_tindakan=$3, tanggal_tindakan=$4
         WHERE id_tindakan_jalan=$1 RETURNING *`,
        [id_tindakan_jalan, kode_icd10, nama_tindakan, tanggal_tindakan]
      );
      return result.rows[0];
    },
    hapusTindakanJalan: async (_, { id_tindakan_jalan }) => {
      await db.query("DELETE FROM tindakan_jalan WHERE id_tindakan_jalan=$1", [id_tindakan_jalan]);
      return true;
    },

    tambahDiagnosaJalan: async (_, { nama_diagnosa, kode_icd10, id_rawat_jalan }) => {
      const result = await db.query(
        `INSERT INTO diagnosa_jalan (nama_diagnosa, kode_icd10, id_rawat_jalan)
         VALUES ($1, $2, $3) RETURNING *`,
        [nama_diagnosa, kode_icd10, id_rawat_jalan]
      );
      return result.rows[0];
    },
    updateDiagnosaJalan: async (_, { id_diagnosa_jalan, nama_diagnosa, kode_icd10 }) => {
      const result = await db.query(
        `UPDATE diagnosa_jalan SET nama_diagnosa=$2, kode_icd10=$3
         WHERE id_diagnosa_jalan=$1 RETURNING *`,
        [id_diagnosa_jalan, nama_diagnosa, kode_icd10]
      );
      return result.rows[0];
    },
    hapusDiagnosaJalan: async (_, { id_diagnosa_jalan }) => {
      await db.query("DELETE FROM diagnosa_jalan WHERE id_diagnosa_jalan=$1", [id_diagnosa_jalan]);
      return true;
    },
  },
};

module.exports = resolvers;
