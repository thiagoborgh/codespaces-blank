# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_06_27_163727) do
  create_table "allergies", force: :cascade do |t|
    t.integer "patient_id", null: false
    t.string "allergen", null: false
    t.integer "severity", null: false
    t.integer "reaction_type", null: false
    t.text "description"
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_allergies_on_active"
    t.index ["allergen"], name: "index_allergies_on_allergen"
    t.index ["patient_id", "active"], name: "index_allergies_on_patient_id_and_active"
    t.index ["patient_id"], name: "index_allergies_on_patient_id"
    t.index ["severity"], name: "index_allergies_on_severity"
  end

  create_table "appointments", force: :cascade do |t|
    t.integer "patient_id", null: false
    t.integer "professional_id"
    t.integer "team_id"
    t.date "appointment_date", null: false
    t.datetime "arrival_time", null: false
    t.integer "status", default: 0, null: false
    t.integer "vulnerability"
    t.integer "service_type", null: false
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["appointment_date"], name: "index_appointments_on_appointment_date"
    t.index ["arrival_time"], name: "index_appointments_on_arrival_time"
    t.index ["patient_id", "appointment_date"], name: "index_appointments_on_patient_id_and_appointment_date"
    t.index ["patient_id"], name: "index_appointments_on_patient_id"
    t.index ["professional_id"], name: "index_appointments_on_professional_id"
    t.index ["service_type"], name: "index_appointments_on_service_type"
    t.index ["status"], name: "index_appointments_on_status"
    t.index ["team_id"], name: "index_appointments_on_team_id"
  end

  create_table "consultation_medications", force: :cascade do |t|
    t.integer "consultation_id", null: false
    t.integer "medication_id", null: false
    t.datetime "prescribed_at", null: false
    t.string "dosage", null: false
    t.string "frequency", null: false
    t.date "start_date"
    t.date "end_date"
    t.text "instructions"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["consultation_id", "medication_id"], name: "index_consultation_medications_on_consultation_and_medication"
    t.index ["consultation_id"], name: "index_consultation_medications_on_consultation_id"
    t.index ["medication_id"], name: "index_consultation_medications_on_medication_id"
  end

  create_table "consultations", force: :cascade do |t|
    t.integer "patient_id", null: false
    t.integer "professional_id", null: false
    t.integer "appointment_id"
    t.datetime "consultation_date", null: false
    t.integer "consultation_type", null: false
    t.integer "status", default: 0, null: false
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["appointment_id"], name: "index_consultations_on_appointment_id"
    t.index ["consultation_date"], name: "index_consultations_on_consultation_date"
    t.index ["consultation_type"], name: "index_consultations_on_consultation_type"
    t.index ["patient_id", "consultation_date"], name: "index_consultations_on_patient_id_and_consultation_date"
    t.index ["patient_id"], name: "index_consultations_on_patient_id"
    t.index ["professional_id"], name: "index_consultations_on_professional_id"
    t.index ["status"], name: "index_consultations_on_status"
  end

  create_table "measurements", force: :cascade do |t|
    t.integer "patient_id", null: false
    t.integer "consultation_id"
    t.integer "recorded_by_id", null: false
    t.datetime "measurement_date", null: false
    t.decimal "weight", precision: 5, scale: 2
    t.decimal "height", precision: 5, scale: 2
    t.decimal "head_circumference", precision: 5, scale: 2
    t.decimal "abdominal_circumference", precision: 5, scale: 2
    t.decimal "calf_circumference", precision: 5, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["consultation_id"], name: "index_measurements_on_consultation_id"
    t.index ["measurement_date"], name: "index_measurements_on_measurement_date"
    t.index ["patient_id", "measurement_date"], name: "index_measurements_on_patient_id_and_measurement_date"
    t.index ["patient_id"], name: "index_measurements_on_patient_id"
    t.index ["recorded_by_id"], name: "index_measurements_on_recorded_by_id"
  end

  create_table "medications", force: :cascade do |t|
    t.integer "patient_id", null: false
    t.string "name", null: false
    t.string "dosage", null: false
    t.string "frequency", null: false
    t.text "instructions"
    t.date "start_date", null: false
    t.date "end_date"
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_medications_on_active"
    t.index ["name"], name: "index_medications_on_name"
    t.index ["patient_id", "active"], name: "index_medications_on_patient_id_and_active"
    t.index ["patient_id"], name: "index_medications_on_patient_id"
    t.index ["start_date", "end_date"], name: "index_medications_on_start_date_and_end_date"
  end

  create_table "patients", force: :cascade do |t|
    t.string "name", null: false
    t.string "cpf", null: false
    t.string "cns", limit: 15, null: false
    t.date "birth_date", null: false
    t.string "sex", null: false
    t.string "race", null: false
    t.string "mother_name"
    t.string "father_name"
    t.string "nationality", null: false
    t.string "birth_state", null: false
    t.string "phone", null: false
    t.string "contact_phone", null: false
    t.string "cep", null: false
    t.string "street_type", null: false
    t.string "street", null: false
    t.string "number", null: false
    t.string "neighborhood", null: false
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["birth_date"], name: "index_patients_on_birth_date"
    t.index ["cns"], name: "index_patients_on_cns", unique: true
    t.index ["cpf"], name: "index_patients_on_cpf", unique: true
    t.index ["name"], name: "index_patients_on_name"
  end

  create_table "soap_records", force: :cascade do |t|
    t.integer "patient_id", null: false
    t.integer "consultation_id", null: false
    t.integer "professional_id", null: false
    t.integer "soap_type", null: false
    t.text "content", null: false
    t.json "vital_signs_data"
    t.json "measurements_data"
    t.json "medications_data"
    t.json "exams_data"
    t.json "procedures_data"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["consultation_id", "soap_type"], name: "index_soap_records_on_consultation_id_and_soap_type"
    t.index ["consultation_id"], name: "index_soap_records_on_consultation_id"
    t.index ["patient_id", "created_at"], name: "index_soap_records_on_patient_id_and_created_at"
    t.index ["patient_id"], name: "index_soap_records_on_patient_id"
    t.index ["professional_id"], name: "index_soap_records_on_professional_id"
    t.index ["soap_type"], name: "index_soap_records_on_soap_type"
  end

  create_table "teams", force: :cascade do |t|
    t.string "name", null: false
    t.string "code", null: false
    t.text "description"
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_teams_on_code", unique: true
    t.index ["name"], name: "index_teams_on_name", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.integer "role", default: 6, null: false
    t.integer "status", default: 0, null: false
    t.string "registration_number"
    t.integer "team_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["registration_number"], name: "index_users_on_registration_number", unique: true
    t.index ["role"], name: "index_users_on_role"
    t.index ["status"], name: "index_users_on_status"
    t.index ["team_id"], name: "index_users_on_team_id"
  end

  create_table "vital_signs", force: :cascade do |t|
    t.integer "patient_id", null: false
    t.integer "consultation_id"
    t.integer "recorded_by_id", null: false
    t.datetime "measurement_date", null: false
    t.integer "systolic_pressure", null: false
    t.integer "diastolic_pressure", null: false
    t.integer "heart_rate", null: false
    t.integer "respiratory_rate"
    t.decimal "temperature", precision: 4, scale: 2
    t.integer "oxygen_saturation"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["consultation_id"], name: "index_vital_signs_on_consultation_id"
    t.index ["measurement_date"], name: "index_vital_signs_on_measurement_date"
    t.index ["patient_id", "measurement_date"], name: "index_vital_signs_on_patient_id_and_measurement_date"
    t.index ["patient_id"], name: "index_vital_signs_on_patient_id"
    t.index ["recorded_by_id"], name: "index_vital_signs_on_recorded_by_id"
  end

  add_foreign_key "allergies", "patients"
  add_foreign_key "appointments", "patients"
  add_foreign_key "appointments", "teams"
  add_foreign_key "appointments", "users", column: "professional_id"
  add_foreign_key "consultation_medications", "consultations"
  add_foreign_key "consultation_medications", "medications"
  add_foreign_key "consultations", "appointments"
  add_foreign_key "consultations", "patients"
  add_foreign_key "consultations", "users", column: "professional_id"
  add_foreign_key "measurements", "consultations"
  add_foreign_key "measurements", "patients"
  add_foreign_key "measurements", "users", column: "recorded_by_id"
  add_foreign_key "medications", "patients"
  add_foreign_key "soap_records", "consultations"
  add_foreign_key "soap_records", "patients"
  add_foreign_key "soap_records", "users", column: "professional_id"
  add_foreign_key "users", "teams"
  add_foreign_key "vital_signs", "consultations"
  add_foreign_key "vital_signs", "patients"
  add_foreign_key "vital_signs", "users", column: "recorded_by_id"
end
