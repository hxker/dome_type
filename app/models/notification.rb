class Notification < ApplicationRecord
  belongs_to :user
  validates :user_id, presence: true
  validates :message_type, presence: true
  validates :content, presence: true
  # 友情提示 0
  # 队长邀请队员 1
  # 申请加入队伍 2
  # 申请退出队伍 3
  # 审核结果 5
  # 比赛通知裁判信息 6
  scope :unread, -> { where(read: false) }
  after_create :realtime_push_to_client

  private

  def realtime_push_to_client
    if user.private_token.present?
      hash = notify_hash
      hash[:user] = self.user.private_token
      hash[:count] = self.user.notifications.unread.count
      PushJob.perform_later hash
    end
  end

  def notify_hash
    {
        content: self.content[0, 30],
        time: Time.now.try(:strftime, '%Y-%m-%d %H:%M:%S')
    }
  end

end
