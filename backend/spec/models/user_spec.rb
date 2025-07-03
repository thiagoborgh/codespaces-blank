require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    subject { build(:user) }

    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:email) }
    it { should validate_presence_of(:registration_number) }
    it { should validate_uniqueness_of(:email) }
    it { should validate_uniqueness_of(:registration_number) }
    it { should have_secure_password }
  end

  describe 'associations' do
    it { should belong_to(:team).optional }
    it { should have_many(:appointments).with_foreign_key('professional_id') }
    it { should have_many(:consultations).with_foreign_key('professional_id') }
  end

  describe 'enums' do
    it { should define_enum_for(:role).with_values(admin: 0, doctor: 1, nurse: 2, dentist: 3, auxiliary: 4, receptionist: 5) }
    it { should define_enum_for(:status).with_values(active: 0, inactive: 1, suspended: 2) }
  end

  describe 'scopes' do
    let!(:active_user) { create(:user, status: 'active') }
    let!(:inactive_user) { create(:user, status: 'inactive') }

    it 'returns only active users' do
      expect(User.active).to include(active_user)
      expect(User.active).not_to include(inactive_user)
    end
  end

  describe 'methods' do
    let(:user) { create(:user, status: 'active') }

    describe '#active_for_authentication?' do
      it 'returns true for active users' do
        expect(user.active_for_authentication?).to be true
      end

      it 'returns false for inactive users' do
        user.update(status: 'inactive')
        expect(user.active_for_authentication?).to be false
      end
    end

    describe '#full_info' do
      it 'returns formatted user information' do
        expect(user.full_info).to include(user.name)
        expect(user.full_info).to include(user.registration_number)
      end
    end
  end
end
