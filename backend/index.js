const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const db = require("./db");
const path = require("path");

async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();
  server.applyMiddleware({ app });

  app.use(express.json());

  // GET semua data tindakan_jalan (response terstruktur)
  app.get("/api/tindakan-jalan", async (req, res) => {
    try {
      const result = await db.query(`
        SELECT 
          id_tindakan_jalan, 
          kode_icd10, 
          nama_tindakan, 
          TO_CHAR(tanggal_tindakan, 'YYYY-MM-DD') AS tanggal_tindakan
        FROM tindakan_jalan
      `);
      // Untuk tindakan_jalan
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Gagal mengambil data tindakan_jalan", detail: err });
    }
  });

  // POST tambah tindakan
  app.post("/api/tindakan-jalan", async (req, res) => {
    const { kode_icd10, nama_tindakan, tanggal_tindakan } = req.body;
    try {
      const result = await db.query(
        `INSERT INTO tindakan_jalan (kode_icd10, nama_tindakan, tanggal_tindakan)
         VALUES ($1, $2, $3) RETURNING *`,
        [kode_icd10, nama_tindakan, tanggal_tindakan]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ message: "Gagal tambah tindakan", error: err });
    }
  });

  // GET semua data diagnosa_jalan (response terstruktur)
  app.get("/api/diagnosa-jalan", async (req, res) => {
    try {
      const result = await db.query(`
        SELECT 
          id_diagnosa_jalan, 
          nama_diagnosa, 
          kode_icd10 
        FROM diagnosa_jalan
      `);
      // Untuk diagnosa_jalan
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Gagal mengambil data diagnosa_jalan", detail: err });
    }
  });

  // POST tambah diagnosa
  app.post("/api/diagnosa-jalan", async (req, res) => {
    const { nama_diagnosa, kode_icd10 } = req.body;
    try {
      const result = await db.query(
        `INSERT INTO diagnosa_jalan (nama_diagnosa, kode_icd10)
         VALUES ($1, $2) RETURNING *`,
        [nama_diagnosa, kode_icd10]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ message: "Gagal tambah diagnosa", error: err });
    }
  });

  // GET semua data rawat jalan
  app.get("/api/rawat-jalan", async (req, res) => {
    try {
      const result = await db.query(`
        SELECT 
          id_rawat_jalan, 
          TO_CHAR(tanggal_kunjungan, 'YYYY-MM-DD') AS tanggal_kunjungan, 
          keluhan, 
          catatan_dokter, 
          status 
        FROM rawat_jalan
      `);
      res.json({
        data: {
          getRawatJalan: result.rows
        }
      });
    } catch (err) {
      res.status(500).json({ message: "Gagal mengambil data rawat jalan" });
    }
  });

  // ⚠️ Taruh ini setelah semua route API
  app.use(express.static(path.join(__dirname, "../frontend")));

  const PORT = 8004;
  app.listen(PORT, () => {
    console.log(`🚀 GraphQL: http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🔗 REST API: http://localhost:${PORT}/api/rawat-jalan`);
  });
}

startServer();