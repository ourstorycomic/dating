import { getOrderLogs } from "./lib/supabase/server.ts";

async function test() {
  const res1 = await getOrderLogs(1, 10);
  const res2 = await getOrderLogs(2, 10);
  
  console.log("Page 1 length:", res1.logs.length);
  if (res1.logs.length > 0) console.log("Page 1 first id:", res1.logs[0].id);

  console.log("Page 2 length:", res2.logs.length);
  if (res2.logs.length > 0) console.log("Page 2 first id:", res2.logs[0].id);
}

test();
