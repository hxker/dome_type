class UserRole < ApplicationRecord
  belongs_to :role
  belongs_to :user
  belongs_to :user_profile, optional: true
  belongs_to :school
  belongs_to :district
  validates :status, inclusion: [0, 1, 2]
  validates :role_id, inclusion: [1, 2]
  validates :school_id, presence: true, numericality: {:greater_than => 0, message: '参数不规范'}
  validates :user_id, presence: true, uniqueness: {scope: [:role_id, :role_type], message: '一个用户的同一角色不同重复'}
  validates :role_type, uniqueness: {scope: :school_id, message: '该学校已有该角色老师'}, if: :role_type_3?, on: :update
  validates :role_type, uniqueness: {scope: :district_id, message: '该区县已有该角色老师'}, if: :role_type_2?, on: :update

  after_update_commit :update_school_teacher_role
  mount_uploader :cover, CoverUploader

  private

  def update_school_teacher_role
    if role_type == 3
      status_change = attribute_previous_change(:status)
      if status_change.present? && status_change ==[0, 1]
        school = self.school
        if school.present? && school.teacher_role !=1
          school.update(teacher_role: 1)
        end
      end
    end
  end

  def role_type_3?
    role_type == 3
  end

  def role_type_2?
    role_type == 2
  end
end
