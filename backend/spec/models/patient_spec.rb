require 'rails_helper'

RSpec.describe Patient, type: :model do
  describe 'validations' do
    subject { build(:patient) }

    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:cpf) }
    it { should validate_presence_of(:cns) }
    it { should validate_presence_of(:birth_date) }
    it { should validate_presence_of(:sex) }
    it { should validate_uniqueness_of(:cpf).case_insensitive }
    it { should validate_uniqueness_of(:cns).case_insensitive }
  end

  describe 'associations' do
    it { should have_many(:appointments) }
    it { should have_many(:consultations) }
    it { should have_many(:allergies) }
    it { should have_many(:measurements) }
  end

  describe 'scopes' do
    let!(:active_patient) { create(:patient, active: true) }
    let!(:inactive_patient) { create(:patient, active: false) }

    it 'returns only active patients' do
      expect(Patient.active).to include(active_patient)
      expect(Patient.active).not_to include(inactive_patient)
    end
  end

  describe 'methods' do
    let(:patient) { create(:patient, birth_date: 30.years.ago) }

    describe '#age' do
      it 'calculates age correctly' do
        expect(patient.age).to eq(30)
      end
    end

    describe '#full_address' do
      it 'returns formatted address' do
        address = patient.full_address
        expect(address).to include(patient.street_type)
        expect(address).to include(patient.street)
        expect(address).to include(patient.number)
      end
    end
  end

  describe 'CPF validation' do
    it 'accepts valid CPF' do
      patient = build(:patient, cpf: CPF.generate)
      expect(patient).to be_valid
    end

    it 'rejects invalid CPF' do
      patient = build(:patient, cpf: '12345678901')
      expect(patient).not_to be_valid
    end
  end
end
