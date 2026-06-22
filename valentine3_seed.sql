-- Kịch bản SQL để thêm mẫu Valentine #3 vào CSDL (nếu cần thiết cho môi trường local/staging)
-- Lưu ý: Mẫu này đã được tôi tự động thêm vào Database chính thức qua API.

INSERT INTO templates (
    slug, 
    name, 
    description, 
    category_id, 
    base_price, 
    is_published, 
    component_key, 
    visual_label, 
    tagline, 
    data_schema
) VALUES (
    'valentine-3',
    'Valentine #3',
    'Nhật Ký Tình Yêu Toàn Tập (The Ultimate Pink Diary)',
    '10fc38bd-03d3-4739-b9f6-c786204838b4',
    99000,
    true,
    'valentine-3',
    'Valentine Diary',
    'Gửi trọn kỷ niệm',
    '{"type": "object", "properties": {"startDate": {"type": "string"}, "musicUrl": {"type": "string"}, "quiz": {"type": "array"}, "puzzleImage": {"type": "string"}, "fakeChat": {"type": "array"}, "photos": {"type": "array"}, "letterTitle": {"type": "string"}, "letterContent": {"type": "string"}}}'::jsonb
);
