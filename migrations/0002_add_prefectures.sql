-- Seed all 47 prefectures
-- Hokkaido Region (北海道地方)
INSERT INTO prefectures (id, key, name, region) VALUES
  (1, 'hokkaido', '北海道', '北海道');

-- Tohoku Region (東北地方)
INSERT INTO prefectures (id, key, name, region) VALUES
  (2, 'aomori', '青森県', '東北'),
  (3, 'iwate', '岩手県', '東北'),
  (4, 'miyagi', '宮城県', '東北'),
  (5, 'akita', '秋田県', '東北'),
  (6, 'yamagata', '山形県', '東北'),
  (7, 'fukushima', '福島県', '東北');

-- Kanto Region (関東地方)
INSERT INTO prefectures (id, key, name, region) VALUES
  (8, 'ibaraki', '茨城県', '関東'),
  (9, 'tochigi', '栃木県', '関東'),
  (10, 'gunma', '群馬県', '関東'),
  (11, 'saitama', '埼玉県', '関東'),
  (12, 'chiba', '千葉県', '関東'),
  (13, 'tokyo', '東京都', '関東'),
  (14, 'kanagawa', '神奈川県', '関東');

-- Chubu Region (中部地方)
INSERT INTO prefectures (id, key, name, region) VALUES
  (15, 'niigata', '新潟県', '中部'),
  (16, 'toyama', '富山県', '中部'),
  (17, 'ishikawa', '石川県', '中部'),
  (18, 'fukui', '福井県', '中部'),
  (19, 'yamanashi', '山梨県', '中部'),
  (20, 'nagano', '長野県', '中部'),
  (21, 'gifu', '岐阜県', '中部'),
  (22, 'shizuoka', '静岡県', '中部'),
  (23, 'aichi', '愛知県', '中部');

-- Kansai Region (関西地方)
INSERT INTO prefectures (id, key, name, region) VALUES
  (24, 'mie', '三重県', '関西'),
  (25, 'shiga', '滋賀県', '関西'),
  (26, 'kyoto', '京都府', '関西'),
  (27, 'osaka', '大阪府', '関西'),
  (28, 'hyogo', '兵庫県', '関西'),
  (29, 'nara', '奈良県', '関西'),
  (30, 'wakayama', '和歌山県', '関西');

-- Chugoku Region (中国地方)
INSERT INTO prefectures (id, key, name, region) VALUES
  (31, 'tottori', '鳥取県', '中国'),
  (32, 'shimane', '島根県', '中国'),
  (33, 'okayama', '岡山県', '中国'),
  (34, 'hiroshima', '広島県', '中国'),
  (35, 'yamaguchi', '山口県', '中国');

-- Shikoku Region (四国地方)
INSERT INTO prefectures (id, key, name, region) VALUES
  (36, 'tokushima', '徳島県', '四国'),
  (37, 'kagawa', '香川県', '四国'),
  (38, 'ehime', '愛媛県', '四国'),
  (39, 'kochi', '高知県', '四国');

-- Kyushu Region (九州地方)
INSERT INTO prefectures (id, key, name, region) VALUES
  (40, 'fukuoka', '福岡県', '九州'),
  (41, 'saga', '佐賀県', '九州'),
  (42, 'nagasaki', '長崎県', '九州'),
  (43, 'kumamoto', '熊本県', '九州'),
  (44, 'oita', '大分県', '九州'),
  (45, 'miyazaki', '宮崎県', '九州'),
  (46, 'kagoshima', '鹿児島県', '九州'),
  (47, 'okinawa', '沖縄県', '九州');
