class SoapRecordSerializer < ActiveModel::Serializer
  attributes :id, :subjective, :objective, :assessment, :plan,
             :created_at, :updated_at

  belongs_to :consultation
end
