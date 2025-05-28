import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  time,
  pgEnum,
} from "drizzle-orm/pg-core";

// ------------------------
// 1. Users Table
// ------------------------
// Tabela de usuários com ID do tipo UUID gerado randomicamente.
export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(), // Chave primária UUID
});

// Relações da tabela users
export const usersTableRelations = relations(usersTable, ({ many }) => ({
  usersToClinics: many(usersToClinicsTable), // 1 usuário pode pertencer a muitas clínicas
}));

// ------------------------
// 2. Clinics Table
// ------------------------
// Tabela de clínicas que armazena nome e timestamps de criação/atualização.
export const clinicaTable = pgTable("clinica", {
  id: uuid("id").defaultRandom().primaryKey(), // UUID PK
  name: text("name").notNull(), // Nome da clínica, campo obrigatório
  createdAt: timestamp("created_at").defaultNow().notNull(), // Data de criação
  updatedAt: timestamp("updated_st") // Data da última atualização
    .defaultNow()
    .$onUpdate(() => new Date()), // Atualiza timestamp no update
});

// Relações da tabela clinica
export const clinicTableRelations = relations(clinicaTable, ({ many }) => ({
  doctors: many(doctorTable), // 1 clínica tem muitos médicos
  patients: many(patientTable), // 1 clínica tem muitos pacientes
  appointments: many(appointmentTable), // 1 clínica tem muitas consultas
  usersToClinics: many(usersToClinicsTable), // 1 clínica tem muitos usuários associados
}));

// ------------------------
// 3. Users to Clinics (Junction) Table
// ------------------------
// Tabela de junção para relacionamento N-M entre users e clinics.
export const usersToClinicsTable = pgTable("users_to_clinics", {
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id), // FK para users.id
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicaTable.id), // FK para clinica.id
  createdAt: timestamp("created_at").defaultNow().notNull(), // Criação do vínculo
  updatedAt: timestamp("updated_at") // Atualização do vínculo
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Relações da tabela users_to_clinics
export const usersToClinicsTableRelations = relations(
  usersToClinicsTable,
  ({ one }) => ({
    user: one(usersTable, {
      // Cada vínculo aponta para um usuário
      fields: [usersToClinicsTable.userId],
      references: [usersTable.id],
    }),
    clinic: one(clinicaTable, {
      // Cada vínculo aponta para uma clínica
      fields: [usersToClinicsTable.clinicId],
      references: [clinicaTable.id],
    }),
  }),
);

// ------------------------
// 4. Doctors Table
// ------------------------
// Tabela de médicos, incluindo disponibilidade e preço de consulta.
export const doctorTable = pgTable("doctors", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicaTable.id, { onDelete: "cascade" }), // FK com cascade
  name: text("name").notNull(), // Nome do médico
  avatar: text("avatar_image_url"), // URL da foto
  // Disponibilidade em dias da semana (texto CSV ou outro formato)
  availableFromWeekdays: text("available_from_weekdays").notNull(),
  availableToWeekday: integer("available_to_weekday").notNull(),
  // Horários de início e fim
  availableFromTime: time("available_from_time").notNull(),
  availableToTime: time("available_to_time").notNull(),
  speciality: text("speciality").notNull(), // Especialidade médica
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(), // Preço em centavos
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_st")
    .defaultNow()
    .$onUpdate(() => new Date()), // Timestamp de atualização
});

// Relação doctors → clinic
export const doctorsTableRelations = relations(
  doctorTable,
  ({ many, one }) => ({
    clinic: one(clinicaTable, {
      // Médico pertence a 1 clínica
      fields: [doctorTable.clinicId],
      references: [clinicaTable.id],
    }),
    appointments: many(appointmentTable),
  }),
);

// ------------------------
// 5. Patient Sex Enum
// ------------------------
// Define tipo ENUM no PostgreSQL para sexo do paciente.
export const patientSexEnum = pgEnum("patient_sex", ["male", "female"]);

// ------------------------
// 6. Patients Table
// ------------------------
// Tabela de pacientes, incluindo informações de contato e sexo.
export const patientTable = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicaTable.id, { onDelete: "cascade" }), // FK para clínica
  name: text("name").notNull(), // Nome do paciente
  email: text("email").notNull(), // Email de contato
  phoneNumber: text("phone_number").notNull(), // Telefone
  createdAt: timestamp("created_at").defaultNow().notNull(),
  sex: patientSexEnum("sex").notNull(), // Enum de sexo
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()), // Timestamp de atualização
});

// Relação patients → clinic
export const patientsTableRelations = relations(patientTable, ({ one }) => ({
  clinic: one(clinicaTable, {
    // Paciente pertence a 1 clínica
    fields: [patientTable.clinicId],
    references: [clinicaTable.id],
  }),
}));

// ------------------------
// 7. Appointments Table
// ------------------------
// Tabela de consultas, relacionando clínica, paciente e médico.
export const appointmentTable = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: timestamp("date").notNull(), // Data/hora da consulta
  clinicId: uuid("clinic_id")
    .notNull()
    .references(() => clinicaTable.id, { onDelete: "cascade" }),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patientTable.id, { onDelete: "cascade" }),
  doctorId: uuid("doctor_id")
    .notNull()
    .references(() => doctorTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Relações appointments → clinic, patient, doctor
export const appointmentsTableRelations = relations(
  appointmentTable,
  ({ one }) => ({
    clinic: one(clinicaTable, {
      fields: [appointmentTable.clinicId],
      references: [clinicaTable.id],
    }),
    patient: one(patientTable, {
      fields: [appointmentTable.patientId],
      references: [patientTable.id],
    }),
    doctor: one(doctorTable, {
      fields: [appointmentTable.doctorId],
      references: [doctorTable.id],
    }),
  }),
);
