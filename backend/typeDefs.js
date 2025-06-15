const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type RawatJalan {
    id_rawat_jalan: ID!
    id_kunjungan: Int!
    tanggal_kunjungan: String!
    keluhan: String
    catatan_dokter: String
    status: String
    diagnosa: DiagnosaJalan
  }

  type TindakanJalan {
    id_tindakan_jalan: ID!
    kode_icd10: String!
    nama_tindakan: String!
    tanggal_tindakan: String!
  }

  type DiagnosaJalan {
    id_diagnosa_jalan: ID!
    id_rawat_jalan: Int!
    nama_diagnosa: String!
    kode_icd10: String!
  }

  type Query {
    getRawatJalan: [RawatJalan]
    getTindakanJalan: [TindakanJalan]
    getDiagnosaJalan: [DiagnosaJalan]
    rawatJalanByKunjungan(id_kunjungan: Int!): RawatJalan
  }

  type Mutation {
    tambahRawatJalan(
      tanggal_kunjungan: String!
      keluhan: String
      catatan_dokter: String
      status: String
      id_kunjungan: Int!
    ): RawatJalan

    updateRawatJalan(
      id_rawat_jalan: ID!
      tanggal_kunjungan: String
      keluhan: String
      catatan_dokter: String
      status: String
    ): RawatJalan

    hapusRawatJalan(id_rawat_jalan: ID!): Boolean

    tambahTindakanJalan(
      kode_icd10: String!
      nama_tindakan: String!
      tanggal_tindakan: String!
    ): TindakanJalan

    updateTindakanJalan(
      id_tindakan_jalan: ID!
      kode_icd10: String
      nama_tindakan: String
      tanggal_tindakan: String
    ): TindakanJalan

    hapusTindakanJalan(id_tindakan_jalan: ID!): Boolean

    tambahDiagnosaJalan(
      nama_diagnosa: String!
      kode_icd10: String!
      id_rawat_jalan: Int!
    ): DiagnosaJalan

    updateDiagnosaJalan(
      id_diagnosa_jalan: ID!
      nama_diagnosa: String
      kode_icd10: String
    ): DiagnosaJalan

    hapusDiagnosaJalan(id_diagnosa_jalan: ID!): Boolean
  }
`;

module.exports = typeDefs;