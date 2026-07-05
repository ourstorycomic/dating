const str = JSON.stringify({image: 'https://foo.supabase.co/storage/v1/object/public/media/uploads/123.jpg', obj: { val: 'https://foo.supabase.co/storage/v1/object/public/media/uploads/456.jpg' }});
const regex = /\/storage\/v1\/object\/public\/media\/(uploads\/[^"'\s]+)/g;
let match;
while ((match = regex.exec(str)) !== null) {
  console.log(match[1]);
}
