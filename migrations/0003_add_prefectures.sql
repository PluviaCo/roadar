-- Seed all 47 prefectures with region_id
-- Hokkaido Region (北海道地方)
INSERT INTO prefectures (id, key, name, region_id) VALUES
  (1, 'hokkaido', '北海道', 1);

-- Tohoku Region (東北地方)
INSERT INTO prefectures (id, key, name, region_id) VALUES
  (2, 'aomori', '青森県', 2),
  (3, 'iwate', '岩手県', 2),
  (4, 'miyagi', '宮城県', 2),
  (5, 'akita', '秋田県', 2),
  (6, 'yamagata', '山形県', 2),
  (7, 'fukushima', '福島県', 2);

-- Kanto Region (関東地方)
INSERT INTO prefectures (id, key, name, region_id) VALUES
  (8, 'ibaraki', '茨城県', 3),
  (9, 'tochigi', '栃木県', 3),
  (10, 'gunma', '群馬県', 3),
  (11, 'saitama', '埼玉県', 3),
  (12, 'chiba', '千葉県', 3),
  (13, 'tokyo', '東京都', 3),
  (14, 'kanagawa', '神奈川県', 3);

-- Chubu Region (中部地方)
INSERT INTO prefectures (id, key, name, region_id) VALUES
  (15, 'niigata', '新潟県', 4),
  (16, 'toyama', '富山県', 4),
  (17, 'ishikawa', '石川県', 4),
  (18, 'fukui', '福井県', 4),
  (19, 'yamanashi', '山梨県', 4),
  (20, 'nagano', '長野県', 4),
  (21, 'gifu', '岐阜県', 4),
  (22, 'shizuoka', '静岡県', 4),
  (23, 'aichi', '愛知県', 4);

-- Kansai Region (近畿地方)
INSERT INTO prefectures (id, key, name, region_id) VALUES
  (24, 'mie', '三重県', 5),
  (25, 'shiga', '滋賀県', 5),
  (26, 'kyoto', '京都府', 5),
  (27, 'osaka', '大阪府', 5),
  (28, 'hyogo', '兵庫県', 5),
  (29, 'nara', '奈良県', 5),
  (30, 'wakayama', '和歌山県', 5);

-- Chugoku Region (中国地方)
INSERT INTO prefectures (id, key, name, region_id) VALUES
  (31, 'tottori', '鳥取県', 6),
  (32, 'shimane', '島根県', 6),
  (33, 'okayama', '岡山県', 6),
  (34, 'hiroshima', '広島県', 6),
  (35, 'yamaguchi', '山口県', 6);

-- Shikoku Region (四国地方)
INSERT INTO prefectures (id, key, name, region_id) VALUES
  (36, 'tokushima', '徳島県', 7),
  (37, 'kagawa', '香川県', 7),
  (38, 'ehime', '愛媛県', 7),
  (39, 'kochi', '高知県', 7);

-- Kyushu Region (九州地方)
INSERT INTO prefectures (id, key, name, region_id) VALUES
  (40, 'fukuoka', '福岡県', 8),
  (41, 'saga', '佐賀県', 8),
  (42, 'nagasaki', '長崎県', 8),
  (43, 'kumamoto', '熊本県', 8),
  (44, 'oita', '大分県', 8),
  (45, 'miyazaki', '宮崎県', 8),
  (46, 'kagoshima', '鹿児島県', 8),
  (47, 'okinawa', '沖縄県', 8);
